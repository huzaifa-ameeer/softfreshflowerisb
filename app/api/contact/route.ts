import { jsonError } from "@/lib/api";

const RECIPIENT_EMAIL = process.env.RESEND_TO_EMAIL;
const RESEND_SEND_URL = "https://api.resend.com/emails";

type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

function isContactMessage(value: unknown): value is ContactMessage {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.name === "string" &&
    typeof body.email === "string" &&
    typeof body.message === "string"
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Invalid request body.");
  }

  if (!isContactMessage(body)) {
    return jsonError(400, "Name, email, and message are required.");
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();

  if (
    !name ||
    name.length > 120 ||
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message ||
    message.length > 5000
  ) {
    return jsonError(400, "Please provide a valid name, email, and message.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail || !RECIPIENT_EMAIL) {
    console.error("[contact] Resend environment variables are not configured.");
    return jsonError(503, "Email service is not configured.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const subjectName = name.replace(/[\r\n]+/g, " ");
  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;padding:0;background-color:#f8f5fa;font-family:Arial,Helvetica,sans-serif;color:#29222e;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#f8f5fa;padding:32px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1px solid #eee4f2;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px;background-color:#7b2fbf;color:#ffffff;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#f4dfff;">Soft Fresh Flower ISB</p>
                    <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">New contact message</h1>
                    <p style="margin:8px 0 0;font-size:14px;line-height:1.5;color:#f7eefe;">A new message was sent from your website.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 12px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#8b718f;">From</p>
                    <p style="margin:0;font-size:18px;line-height:1.5;font-weight:bold;color:#35243d;">${safeName}</p>
                    <p style="margin:4px 0 0;font-size:14px;line-height:1.5;"><a href="mailto:${safeEmail}" style="color:#7b2fbf;text-decoration:none;">${safeEmail}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 32px 28px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#8b718f;">Message</p>
                    <div style="padding:18px 20px;background-color:#fbf8fc;border:1px solid #eee4f2;border-radius:10px;font-size:15px;line-height:1.7;color:#35243d;overflow-wrap:anywhere;">${safeMessage}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 30px;">
                    <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 20px;border-radius:8px;background-color:#7b2fbf;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${safeName}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 32px;border-top:1px solid #eee4f2;background-color:#fdfbfd;color:#8b718f;font-size:12px;line-height:1.5;">
                    Sent through the contact form at Soft Fresh Flower ISB.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
  let response: Response;

  try {
    response = await fetch(RESEND_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: `Contact form message from ${subjectName}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html,
      }),
    });
  } catch (error) {
    console.error("[contact] Resend request failed:", error);
    return jsonError(502, "Unable to reach the email service. Please try again.");
  }

  if (!response.ok) {
    const providerError = await response.text();
    console.error(
      `[contact] Resend rejected the message (${response.status}):`,
      providerError,
    );
    return jsonError(502, "Email service could not send your message.");
  }

  return Response.json({ sent: true });
}

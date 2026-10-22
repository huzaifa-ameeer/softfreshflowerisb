import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getAuth } from "@/lib/auth";

export const instant = false;

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/admin/login");

  return (
    <AdminShell user={{ name: session.user.name, email: session.user.email }}>
      {children}
    </AdminShell>
  );
}

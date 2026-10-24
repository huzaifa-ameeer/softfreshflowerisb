"use client";

import Link from "next/link";
import { useState } from "react";
import { showToast } from "@/components/Toast";

type Location = {
  name: string;
  address: string;
  plusCode?: string;
  directions: string;
  embed: string;
};

const locations: Location[] = [
  {
    name: "Bahria Town Phase II",
    address:
      "Service Rd, Bahria Town Phase II, Phase 2, Bahria Town, Rawalpindi",
    plusCode: "H43F+266",
    directions:
      "https://www.google.com/maps/search/?api=1&query=33.552537,73.123016",
    embed: "https://www.google.com/maps?q=33.552537,73.123016&z=16&output=embed",
  },
  {
    name: "F-10/3 Islamabad",
    address: "Street 57, 3 Service Rd E, F-10/3, F-10, Islamabad",
    directions:
      "https://www.google.com/maps/search/?api=1&query=Street+57+Service+Rd+E+F-10%2F3+Islamabad",
    embed:
      "https://www.google.com/maps?q=Street+57+Service+Rd+E+F-10%2F3+Islamabad&z=16&output=embed",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // UI only - will integrate EmailJS later
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData({ name: "", email: "", message: "" });
      showToast("Message sent successfully!", "success");
    } catch (error) {
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700 sm:text-4xl">
          Contact Us
        </h1>
        <p className="max-w-2xl text-base text-neutral-600 sm:text-lg">
          Get in touch with us. Visit our stores or send us a message.
        </p>
      </header>

      <section className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
            Our locations
          </h2>
          <p className="max-w-2xl text-base text-neutral-600">
            Two shops, one in Rawalpindi and one in Islamabad.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {locations.map((location) => (
            <li key={location.name}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-pink-200">
                <iframe
                  title={`Map of ${location.name}`}
                  src={location.embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full border-0 sm:h-64"
                />

                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <h3 className="text-lg font-semibold text-pink-900">
                    {location.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{location.address}</p>
                  {location.plusCode && (
                    <p className="text-xs font-medium tracking-wide text-pink-600 uppercase">
                      Plus code {location.plusCode}
                    </p>
                  )}

                  <a
                    href={location.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex w-fit items-center justify-center rounded-md border border-pink-500 px-4 py-2 text-sm font-semibold text-pink-700 transition-colors hover:bg-pink-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                  >
                    Get directions
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-semibold text-pink-900 sm:text-2xl">
            Ask for Help
          </h2>
          <p className="text-base text-neutral-600">
            Send us a message and we'll get back to you
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-2xl rounded-2xl bg-white/70 p-6 ring-1 ring-pink-200 sm:p-8"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-pink-900"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="rounded-md border border-pink-200 px-4 py-2 text-neutral-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-pink-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-md border border-pink-200 px-4 py-2 text-neutral-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-pink-900"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="rounded-md border border-pink-200 px-4 py-2 text-neutral-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#7b2fbf] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#6a28a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-neutral-200 px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

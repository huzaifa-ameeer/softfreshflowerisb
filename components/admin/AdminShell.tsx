"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Spinner } from "@/components/admin/Loader";
import { showToast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Fresh Products", href: "/admin/fresh-products", icon: LeafIcon },
  {
    label: "Top Selling Products",
    href: "/admin/top-selling-products",
    icon: TrendIcon,
  },
  { label: "Add Products", href: "/admin/add-products", icon: PlusIcon },
  {
    label: "Edit/Delete Products",
    href: "/admin/edit-delete-products",
    icon: PencilIcon,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function baseIconProps(className?: string) {
  return {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="6.4" r="3.4" />
      <circle cx="17.33" cy="10.27" r="3.4" />
      <circle cx="15.29" cy="16.53" r="3.4" />
      <circle cx="8.71" cy="16.53" r="3.4" />
      <circle cx="6.67" cy="10.27" r="3.4" />
      <circle cx="12" cy="12" r="1.9" fill="#ffffff" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function PanelIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function itemClass(active: boolean, extra: string) {
  const tone = active
    ? "bg-pink-500 text-black"
    : "text-neutral-700 hover:bg-pink-100 hover:text-black";

  return `flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${tone} ${extra}`;
}

function labelClass(collapsed: boolean) {
  return `truncate transition-opacity duration-300 ease-out ${
    collapsed ? "lg:opacity-0" : "opacity-100"
  }`;
}

export default function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    showToast("Signed out successfully", "info", { persist: true });
    window.location.replace("/admin/login");
  };

  return (
    <div className="flex min-h-dvh flex-1 bg-neutral-50 text-neutral-900">
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 lg:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-16" : "lg:w-60"}`}
      >
        <div className="flex h-16 items-center gap-2 px-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-500 text-white">
            <FlowerIcon className="size-4" />
          </span>
          <span
            className={`text-sm font-bold text-pink-700 ${labelClass(collapsed)}`}
          >
            Admin Panel
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={itemClass(active, "")}
              >
                <Icon className="size-5 shrink-0" />
                <span className={labelClass(collapsed)}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-2">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
            title="Sign out"
            className={itemClass(
              false,
              "w-full border-0 bg-transparent disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {signingOut ? (
              <Spinner className="size-5" />
            ) : (
              <SignOutIcon className="size-5 shrink-0" />
            )}
            <span className={labelClass(collapsed)}>
              {signingOut ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-neutral-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-pink-100 hover:text-black lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="hidden size-9 cursor-pointer items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-pink-100 hover:text-black lg:inline-flex"
          >
            <PanelIcon className="size-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {user.name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

import { Suspense, type ReactNode } from "react";
import Loader from "@/components/admin/Loader";
import AdminPanelShell from "@/components/admin/AdminPanelShell";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<Loader label="Loading" />}>
      <AdminPanelShell>{children}</AdminPanelShell>
    </Suspense>
  );
}

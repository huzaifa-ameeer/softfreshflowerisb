import { Spinner } from "@/components/admin/Loader";

export default function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-4 py-20"
    >
      <Spinner className="size-9" />
      <span className="text-sm font-medium text-neutral-500">{label}</span>
    </div>
  );
}

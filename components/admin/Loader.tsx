export function Spinner({ className = "size-5" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-pink-200 border-t-pink-500 ${className}`}
    />
  );
}

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-16"
    >
      <Spinner className="size-8" />
      <span className="text-sm font-medium text-neutral-500">{label}…</span>
    </div>
  );
}

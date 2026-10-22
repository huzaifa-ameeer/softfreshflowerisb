export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        {title}
      </h1>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
        <span aria-hidden="true" className="text-3xl">
          🚧
        </span>
        <p className="text-base font-semibold text-neutral-800">Coming soon</p>
        {description && (
          <p className="max-w-md text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  );
}

const items = [
  { icon: "🌸", label: "Fresh Flowers" },
  { icon: "🙏", label: "Blessings" },
  { icon: "🎂", label: "Flower Cakes" },
  { icon: "💐", label: "Bouquets" },
  { icon: "📿", label: "Gajray" },
  { icon: "🎈", label: "Balloons" },
  { icon: "🍫", label: "Chocolates" },
  { icon: "💌", label: "Birthday Cards" },
  { icon: "💍", label: "Flower Jewelry" },
];

const copies = [0, 1, 2, 3];

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export default function AnnouncementBar({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`flex items-center gap-2 ${className || "bg-[#7b2fbf]"} p-2 sm:gap-3`}>
      <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-neutral-900/30 bg-[#f7d54a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-neutral-900 sm:text-xs">
        <ClockIcon className="size-3.5 shrink-0 sm:size-4" />
        <span className="whitespace-nowrap">30 Minutes Delivery</span>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
          {copies.map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center"
              aria-hidden={copy > 0 || undefined}
            >
              {items.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-2 whitespace-nowrap px-3 text-xs font-medium text-white sm:text-sm"
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function iconProps(className?: string) {
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V4a2 2 0 0 1 2-2h8l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const features = [
  {
    title: "30-minute delivery",
    description: "Delivered fast across Islamabad",
    icon: ClockIcon,
  },
  {
    title: "Affordable price",
    description: "Great value, no surprises",
    icon: TagIcon,
  },
  {
    title: "Safe & secure packaging",
    description: "Wrapped and handled with care",
    icon: ShieldIcon,
  },
  {
    title: "10k+ happy customers",
    description: "Loved across the city",
    icon: UsersIcon,
  },
];

export default function FeatureStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <li
            key={title}
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-pink-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700 sm:size-14">
              <Icon className="size-6" />
            </span>

            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold text-pink-900 sm:text-base">
                {title}
              </p>
              <p className="text-xs leading-snug text-neutral-500 sm:text-sm">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

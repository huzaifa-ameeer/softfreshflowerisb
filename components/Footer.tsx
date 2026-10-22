import AnnouncementBar from "@/components/AnnouncementBar";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-1.5 px-4 py-6 text-sm text-neutral-600 sm:px-6">
        <span>Built by</span>
        <a
          href="https://huzaifa-lake.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          Huzaifa
        </a>
        <HeartIcon className="size-4 text-pink-500" />
      </div>

      <AnnouncementBar />
    </footer>
  );
}

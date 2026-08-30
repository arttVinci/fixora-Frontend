// Koboyo hand-drawn style SVG icons with currentColor and organic lines

export function MapPinIcon({
  className = "w-5 h-5",
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.5c-3.5-4.5-7-8.8-7-12.5a7 7 0 1 1 14 0c0 3.7-3.5 8-7 12.5Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function GoogleStylePinIcon({
  className = "w-6 h-6",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#EA4335"
      />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.44 5.34 3.36 8.35L12 2v0z"
        fill="#4285F4"
        opacity="0.15"
      />
      <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

export function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export function CameraIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5a2.5 2.5 0 0 1 2.5-2.5h2l1.6-2.2a1.5 1.5 0 0 1 1.2-.6h4.4c.5 0 .9.2 1.2.6l1.6 2.2h2a2.5 2.5 0 0 1 2.5 2.5v9.5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5V8.5Z" />
      <circle cx="12" cy="13.2" r="3.5" />
    </svg>
  );
}

export function LocationTargetIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
    </svg>
  );
}

export function FlameIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-1.8-1-2.8-1.5-3.8-1-2-.2-4 1.8-5.8.5 2.2 2 4.2 3.5 5.5 1.5 1.5 2.7 3 2.7 5.1a8 8 0 1 1-16 0c0-1.2.4-2.5 1-3.2 1 1.2 1.5 2.2 1.5 2.2Z" />
    </svg>
  );
}

export function SunIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5m0 14v2.5M2.5 12H5m14 0h2.5M5.3 5.3l1.8 1.8m9.8 9.8 1.8 1.8M18.7 5.3l-1.8 1.8M6.9 17.1l-1.6 1.6" />
    </svg>
  );
}

export function MoonIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.8 8.8 0 1 0 20.5 13.2Z" />
    </svg>
  );
}

export function SparklesIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </svg>
  );
}

export function RoadIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 19.5 3.5-15h8l3.5 15" />
      <path d="M12 7v2.5m0 3.5v2.5" strokeDasharray="1 1" />
    </svg>
  );
}

export function BridgeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5h18M3 18.5V7.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v11M7.5 11.5v7m9-7v7m-4.5-7v7" />
    </svg>
  );
}

export function TrashIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 6.5h17M8.5 6.5V4a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2.5M18.5 6.5v12a2.5 2.5 0 0 1-2.5 2.5h-8a2.5 2.5 0 0 1-2.5-2.5v-12m4 4v6m4-6v6" />
    </svg>
  );
}

export function BuildingIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="3" width="15" height="18.5" rx="2" />
      <path d="M9 7.5h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M9.5 21.5v-3h5v3" />
    </svg>
  );
}

export function DrainageIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.2C8.5 7.5 5 11.8 5 15.5a7 7 0 1 0 14 0c0-3.7-3.5-8-7-12.3Z" />
      <path d="M12 9.5a4 4 0 0 0-4 4" />
    </svg>
  );
}

export function GpsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2v2.5m0 15V22M2 12h2.5m15 0H22" />
    </svg>
  );
}

export function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5.5v13m-6.5-6.5h13" />
    </svg>
  );
}

export function ArrowRightIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12h14.5m-5.5-6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 12.5 5 5L19.5 6.5" />
    </svg>
  );
}

export function EditIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4.5H5a2 2 0 0 0-2 2v12.5a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-2V13" />
      <path d="M18.5 2.8a2.1 2.1 0 0 1 3 3L12.5 14.8l-4 1 1-4 9-9Z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SendIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-label="launch newsletter"
      viewBox="0 0 211 132"
    >
      <path d="M192.5 7.7A4303 4303 0 0 0 65.6 39.2a44 44 0 0 0-12.4 4.6c-.2.8 7 4.8 20.1 11.1q20.5 9.9 21 11.7l3.9 17.3a76 76 0 0 0 4.4 15.8c.7.2 6.4-3 12.7-7.1a159 159 0 0 1 12.1-7.6c.3 0 6.7 4.1 14.2 9s14.1 9 14.9 9c.7 0 1.7-.6 2.2-1.3 2.5-3.1 40.1-87.5 41-91.7.5-2.8.3-3-2.3-2.9-1.6.1-3.8.3-4.9.6m-4.5 4.7c0 .2-3.7 2.3-8.2 4.6L165 25c-6.1 3.5-36.7 20-59.5 32l-10 5.2-18.3-8.8c-11-5.3-17.8-9-17-9.5a4959 4959 0 0 1 93.8-24l22.5-5.4c9.3-2.4 11.5-2.8 11.5-2.1m-3.9 26.8a4769 4769 0 0 1-27.5 60.5L116 73.5c0-.2 15-11.6 33.4-25.5a2208 2208 0 0 0 45.8-34.9 449 449 0 0 1-11.1 26.1m-3.6-18.3-23 17.3-34 25.6-12 9.1-3.9 10.1a64 64 0 0 1-4.3 9.7l-3.2-14L97.2 65l4.2-2.4c2.2-1.3 14-7.5 26.1-13.9s29-15.4 37.5-20.1c15.3-8.4 17.3-9.4 15.5-7.7M124 83c0 .7-16.2 11.1-16.7 10.7s1.7-6.3 4.6-13l2-4.7 5.1 3.2a26 26 0 0 1 5 3.8M34 71.6c-9.5 4.7-17.6 8.7-17.9 9q-.3.5.5 1.4C17.9 83.3 54 66.2 54 64.3q-.2-1.2-1.2-1.2c-.7 0-9.2 3.9-18.8 8.5m-6.5 20.3c-16 8.4-19.9 11.1-16 11.1A208 208 0 0 0 47 84.2q-.2-1-1.2-1.2c-.7 0-8.9 4-18.3 8.9m43.4-5.1L44.6 107c-19.3 14.7-23.9 19-20.6 19 .6 0 12-8.4 25.3-18.6l26.4-20.1c2.5-1.6 3.1-4.3 1.1-4.3-.7.1-3.4 1.7-5.9 3.8m3.2 21.8Q60.6 120.1 65 120c.7 0 13.6-10.8 20.5-17.1q.8-1-.2-2c-.7-.7-4 1.6-11.2 7.7"></path>
    </svg>
  );
}

export function BotIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="17" height="12" x="3.5" y="7" rx="2.5" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" />
      <path d="M12 2.5v4.5m-9 6h1.5m15 0H21" />
    </svg>
  );
}

export function CheckCircleIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function ArrowUpIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 18.5V5.5m-5 5 5-5 5 5" />
    </svg>
  );
}

export function MapIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 6.5 6-3 6 3 6-3v14l-6 3-6-3-6 3v-14Zm6-3v14m6-11v14" />
    </svg>
  );
}

export function AiSparkleIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-label="chat bubble ai"
      viewBox="0 0 178 153"
    >
      <path d="M64.9 8.5a69 69 0 0 0-40.5 19 55 55 0 0 0-16 44.4c1.4 18.5 9.2 33 22.8 42.2 5.7 3.9 5.9 4.1 5.2 7.7-.3 2-2 7.9-3.6 13a38 38 0 0 0-2.3 10.2q1.6 2.4 11.7-1.3c7-2.6 11.7-5.3 19.8-11.8l5.5-4.3 18.5.3c26.3.4 41-2.2 55.5-9.7a59 59 0 0 0 21.8-20.9 74 74 0 0 0 5.6-43.5c-3.9-19-19-34.9-39.7-41.8-14.5-4.8-45-6.5-64.3-3.5m45.8 4.6A95 95 0 0 1 143 24.2c14.9 9.9 22 24.2 22 44a49 49 0 0 1-34.7 49.5c-11.4 4.1-23.7 5.5-45.5 5.1l-19.7-.3-5.3 4.6c-8.2 7.1-20.8 14.2-22.4 12.7-.2-.3.7-4.9 2.1-10.3 3.6-14 3.7-13.6-4.5-18.9C14 97 7.1 67 19.3 42.5c7.7-15.5 25-26 48.5-29.4 8.4-1.2 33.9-1.3 42.9 0"></path>
      <path d="M83.4 29.9c-1.2.5-3.1 2.2-4.4 3.8-1.8 2.3-2.1 3.6-1.6 7.4l.6 4.5L69.1 56c-8.7 10.3-8.9 10.4-12.8 10.2-5.9-.5-10.3 3.5-10.3 9.2 0 5.2 2 8.1 6.5 9.6 3 1 4.1.9 7.9-.9l4.3-2.1 9.4 3.6 14.5 5.5c4.5 1.7 5.2 2.4 6.3 5.9q2 7.1 9.4 7c7.6 0 12.4-8.7 8.1-14.8-1.4-2.1-1.3-2.7 3.6-11.1 3.3-5.7 5.7-8.8 6.5-8.5s2.9-.2 4.9-1a9.4 9.4 0 0 0 2.4-16.1c-3.4-2.9-6.6-3.2-10.8-1-2.9 1.5-3.2 1.4-12.7-4.1-9.4-5.3-9.8-5.7-9.9-9-.1-6.1-7.4-10.8-13-8.5m7.5 7.3c1.4 2.4 1.4 2.8-.3 4.7-2.4 2.6-6.2 2.7-7.6.2-1.4-2.8-1.3-4.7.6-6.6 2.3-2.2 5.6-1.5 7.3 1.7m13.3 14.4c8.2 4.7 9.8 6 9.8 8.1 0 1.3.6 3.6 1.4 5.1 1.3 2.6 1.1 3.2-3.7 11.5-4.7 8-5.4 8.7-8.3 8.7-1.7 0-4.2.8-5.5 1.9-2.4 1.8-2.5 1.8-17.1-3.8-8-3.1-14.8-5.8-15.1-6.1s-.7-2.1-1.1-4.2c-.6-3.4-.3-4.1 8.3-14 8.7-10.2 9-10.4 12.7-10q4 .3 5.9-1.2c1.1-.8 2.2-1.6 2.4-1.6.3 0 4.9 2.5 10.3 5.6m23.4 5.9c1.5 2.3 1.5 2.7 0 5-2.7 4.2-8.6 2.6-8.6-2.3 0-5.5 5.6-7.2 8.6-2.7M58.8 72.2c1.8 1.8 1.4 5.3-.8 7.3-3.9 3.5-9.6-1.7-7-6.5 1.2-2.3 5.8-2.8 7.8-.8M107.1 90c2.7 1.5 2.5 6.4-.3 8.4a9 9 0 0 1-3 1.6c-1.4 0-4.8-3.9-4.8-5.5s3.5-5.5 5.1-5.5c.6 0 1.9.5 3 1"></path>
    </svg>
  );
}

export function ReportIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-label="snagging report"
      viewBox="0 0 204 199"
    >
      <path d="M62.4 10.9a9 9 0 0 0-5.7 6L55 21h-6.4c-7.8 0-9.5.6-10.7 3.6-.8 2.3-1.2 2.4-12.4 2.4-11 0-11.7.1-14.1 2.5L9 31.9l.2 75.2.3 75.1 2.4 1.9c2.2 1.8 4.7 1.9 58 1.9h55.8l2.1-2.3c2-2.1 2.2-3.4 2.2-15.5 0-11.1-.2-13.2-1.5-13.2s-1.5 2-1.5 12.4c0 10-.3 12.8-1.6 14-1.4 1.4-7.8 1.6-55.8 1.6-40.8 0-54.5-.3-55.4-1.2-1.7-1.7-1.7-148.9 0-150.6q1.3-1.2 12-1.2H37v3.9c0 7.2-.4 7.1 31.9 7.1 21 0 29-.3 29.9-1.2.7-.7 1.2-3.1 1.2-5.5V30h12.3q12.3 0 13.5 1.2c.9.9 1.2 8 1.2 26 0 21.4.2 24.8 1.5 24.8s1.5-3.5 1.5-25.5c0-31.9 1.4-29.5-17-29.5-10.2 0-13-.3-13-1.3q0-4.7-10.8-4.7c-6.4 0-7.2-.2-7.2-1.9 0-3-4.8-7.9-8.8-9.1-5-1.3-6-1.3-10.8.9m12.7 3.4c2.1 1.6 3.9 5.1 3.9 7.6 0 1.9.7 2 8.8 2.3l8.7.3.3 6.3.3 6.2-28.3-.2-28.3-.3-.1-4c-.2-7.5.3-7.9 9.7-8.5l8.3-.5.7-3.5q1.4-7.1 9.8-7c2.5 0 5.3.6 6.2 1.3"></path>
      <path d="M65.6 18.6c-.9.8-1.6 2.4-1.6 3.4 0 2.2 2.6 5 4.6 5 1.6 0 5.4-3.5 5.4-5s-3.8-5-5.4-5a5 5 0 0 0-3 1.6m4.9 3.4q-.2 1.4-1.7 1.8-1.9.4-1.8-1.8t1.8-1.8q1.5.4 1.7 1.8M80 59.5c0 1.3-.7 4.3-1.6 6.5-1.6 3.9-1.6 4 1 7.1 3.4 4 3.3 6.5-.4 9.6-1.6 1.3-3 3.3-3 4.2 0 1.3-1.2 2-4.7 2.7-5.9 1.1-7.4 3.8-1.7 2.9 7.3-1.2 8.4-1.5 8.4-2.9 0-.7 1-2.5 2.1-4 1.7-2.2 2.8-2.7 5.8-2.4 3.5.3 3.6.4 3.9 4.7.3 3.4 1 5.1 3.3 7.2 1.6 1.5 2.9 3.4 2.9 4.3q.1 1.5 1 1.6c1.9 0 1-5.1-1.4-7.3q-2.5-2.2-2.7-6.7c-.4-4.3-.2-4.7 4.4-8.9q4.8-4.5 3.8-5.4t-5.6 3.2q-8.5 7.8-10.8.6c-.6-1.7-1.8-4-2.8-5.3-1.4-1.8-1.6-2.9-.8-4.8 1.2-3.3 1.2-9.4-.1-9.4-.5 0-1 1.1-1 2.5M28.6 71.2a42 42 0 0 0-.3 15.7c1.3 1.3 12.6 1.4 14.5.2.9-.5 1.2-3 1-8.7l-.3-7.9-7.3-.3c-5.2-.2-7.3.1-7.6 1M41 79.1v6l-5.2-.3-5.3-.3-.3-5.8-.3-5.7H41zm80.2 8.9a33 33 0 0 0-18.6 30q0 21.1 18.6 30.4c6.1 3.1 8 3.6 14.3 3.6 4 0 9.3-.7 12-1.7 4.8-1.6 4.9-1.6 6.7.7 1.1 1.3 1.7 3.2 1.5 4.1-.6 2.2.1 3.2 13.5 20.1 9.5 11.9 11.4 13.8 14.5 14.4 6.2 1.2 11.9-5.3 9.7-11.1-.5-1.4-6.1-9.1-12.4-17-7.9-10-12-14.5-13.4-14.5-1.1 0-3-1.2-4.2-2.7l-2.2-2.8 2.9-4.2a36 36 0 0 0 3-32.8 37 37 0 0 0-16.6-16.6 26 26 0 0 0-14.6-2.9c-7.6 0-9.3.4-14.7 3m26.1 2a30.4 30.4 0 1 1-38.3 42.3 36 36 0 0 1-1.6-24.1A31 31 0 0 1 147.3 90m13.9 56.4c1.6 2.2 1.6 2.5-.1 4-1.6 1.5-1.9 1.4-4.2-1-2.4-2.5-2.4-2.6-.5-4 2.6-1.8 2.8-1.8 4.8 1m18.3 18.5c11 13.7 12.4 16.2 10.7 18.7-1.2 1.9-5 3.4-6.7 2.8-.9-.4-6.8-7.2-13.2-15.2l-11.7-14.5 4-3.3c2.1-1.9 4.2-3.3 4.7-3.1s5.9 6.7 12.2 14.6"></path>
      <path d="M127.4 93.6c-5.5 2-12 7.7-14.6 12.8a31 31 0 0 0-2.6 10.8c-.4 5.9-.1 7.5 2.2 12.2a25 25 0 0 0 23.6 14.9c18 .1 30.1-16.8 24.8-34.5-1.5-5-7.9-12.3-13.1-15a30 30 0 0 0-20.3-1.2m19.4 4.3c16.5 8.5 15.9 32.5-1 41.2-5 2.6-14.6 2.6-19.6 0a25 25 0 0 1-13.2-20.5c0-10 7.1-19.5 16.8-22.7a30 30 0 0 1 17 2m-118.9 5.8-.2 8.3-.2 7.5h16v-16l-7.7-.3c-4.3-.2-7.8.1-7.9.5m13.1 7.8v5.5H30v-11h11zm27.5 19.2c-13.8 6.9-14.5 7.6-14.5 12.7 0 3.9.7 4.8 12.3 17l12.4 12.9 10.9-5.7c17.5-8.9 17.4-8.9 17.4-13.9 0-4.1-.4-4.6-12.3-16.5A81 81 0 0 0 81 125.1a84 84 0 0 0-12.5 5.6m23.9 8.2c6 6 10.6 11.3 10.3 11.7-.3.5-5.5 3.4-11.6 6.4L80 162.4l-3.1-2.9L66 147.9l-7.9-8.5 11.2-5.7L81 128c.3 0 5.4 4.9 11.4 10.9M79 166.7q0 1.2-.9 1.3c-1.6 0-21.1-21.9-21.1-23.7.1-2 21.9 20.4 22 22.4m24.8-11.2c-.2.9-5.4 4.3-11.5 7.5-10 5.3-11.3 5.8-11.3 4 0-1.5 2.5-3.2 10.8-7.4 11.8-6.1 12.5-6.3 12-4.1m-74.4-19.7c-1.5.9-2.8 11.3-2 14.7.6 2.5.8 2.6 8.4 2.3l7.7-.3.3-7.3c.2-4.6-.2-7.9-.9-8.8-1.2-1.5-11.5-2-13.5-.6M41 144v6H30v-12h11z"></path>
    </svg>
  );
}

export function ShareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

type Tone = "peach" | "sage" | "sky" | "butter";

const TONES: Record<Tone, [string, string, string]> = {
  peach: ["#FFD2B0", "#F29E7B", "#E27B5A"],
  sage: ["#DDEBC9", "#A9C79A", "#7FA774"],
  sky: ["#CFE6FA", "#8EBDEB", "#5E94D1"],
  butter: ["#FFF0B8", "#F6CF63", "#E6A93A"],
};

/**
 * Original illustration of an iced coffee, used as the "photo" in the sample
 * ads. Drawn as SVG so it stays sharp and weighs almost nothing.
 */
export function CoffeeArt({
  id,
  tone = "peach",
  className,
}: {
  id: string;
  tone?: Tone;
  className?: string;
}) {
  const [a, b, c] = TONES[tone];
  return (
    <svg
      className={className}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of an iced coffee with a straw"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.65" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={`${id}-coffee`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8C9A0" />
          <stop offset="0.28" stopColor="#B9855A" />
          <stop offset="1" stopColor="#3B2216" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id={`${id}-cup`}>
          <path d="M112 150 L288 150 L262 438 Q260 452 246 452 L154 452 Q140 452 138 438 Z" />
        </clipPath>
      </defs>

      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      <circle cx="320" cy="80" r="120" fill="#fff" opacity="0.14" />
      <circle cx="60" cy="440" r="90" fill="#fff" opacity="0.1" />

      {/* soft table shadow */}
      <ellipse cx="200" cy="462" rx="104" ry="14" fill="#2b1608" opacity="0.28" />

      {/* straw (back) */}
      <rect
        x="206"
        y="34"
        width="15"
        height="230"
        rx="7"
        fill="#FFFFFF"
        transform="rotate(9 213 150)"
      />

      {/* cup contents */}
      <g clipPath={`url(#${id}-cup)`}>
        <rect x="100" y="150" width="200" height="310" fill="#fff" opacity="0.18" />
        <rect x="100" y="196" width="200" height="270" fill={`url(#${id}-coffee)`} />
        {/* milk swirl */}
        <path
          d="M112 210 C150 236 170 196 204 228 C238 258 250 214 290 240 L290 270 C250 250 236 292 204 262 C170 232 150 280 112 252 Z"
          fill="#F6E9D5"
          opacity="0.75"
        />
        {/* ice */}
        <g fill="#fff" opacity="0.5" stroke="#fff" strokeOpacity="0.8" strokeWidth="2">
          <rect x="124" y="176" width="64" height="58" rx="12" transform="rotate(-12 156 205)" />
          <rect x="196" y="168" width="66" height="60" rx="12" transform="rotate(10 229 198)" />
          <rect x="152" y="262" width="60" height="56" rx="12" transform="rotate(8 182 290)" />
          <rect x="222" y="272" width="56" height="52" rx="12" transform="rotate(-9 250 298)" />
          <rect x="140" y="352" width="58" height="52" rx="12" transform="rotate(-6 169 378)" />
        </g>
      </g>

      {/* straw (front) */}
      <rect
        x="206"
        y="34"
        width="15"
        height="230"
        rx="7"
        fill="#fff"
        opacity="0.55"
        transform="rotate(9 213 150)"
      />
      <path
        d="M205 70 l14 -2 l3 26 l-14 2 Z M211 116 l14 -2 l3 26 l-14 2 Z M217 162 l14 -2 l3 26 l-14 2 Z"
        fill="#E5484D"
        opacity="0.85"
        transform="translate(0 0)"
      />

      {/* glass highlight + rim */}
      <path
        d="M112 150 L288 150 L262 438 Q260 452 246 452 L154 452 Q140 452 138 438 Z"
        fill={`url(#${id}-glass)`}
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="3"
      />
      <ellipse cx="200" cy="150" rx="88" ry="10" fill="#fff" opacity="0.35" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M128 188 L146 420" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.5" />

      {/* condensation */}
      <g fill="#fff" opacity="0.7">
        <circle cx="262" cy="230" r="4" />
        <circle cx="254" cy="298" r="3" />
        <circle cx="268" cy="344" r="4.5" />
        <circle cx="244" cy="396" r="3" />
        <circle cx="158" cy="320" r="3" />
      </g>
    </svg>
  );
}

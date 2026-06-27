/** The abstract city backdrop, shared by map-centric workspaces. */
const BLOCKS = Array.from({ length: 40 }, (_, i) => {
  const col = i % 8;
  const row = Math.floor(i / 8);
  return {
    x: 80 + col * 135 + ((row % 2) * 18 - 9),
    y: 70 + row * 130,
    w: 96 + (i % 3) * 10,
    h: 80 + (i % 2) * 14,
  };
});

export function MapBackground({ dim = false }: { dim?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 760"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M -50 180 C 300 240 500 120 760 220 C 980 300 1100 240 1300 320 L 1300 460 C 1080 380 980 440 760 360 C 520 270 320 380 -50 320 Z"
        style={{ fill: "rgb(var(--info-soft))" }}
        opacity={dim ? 0.5 : 0.9}
      />
      <rect
        x="860"
        y="470"
        width="260"
        height="210"
        rx="28"
        style={{ fill: "rgb(var(--success-soft))" }}
        opacity={dim ? 0.6 : 1}
      />
      {BLOCKS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="10"
          style={{ fill: "rgb(var(--surface))", stroke: "rgb(var(--border))" }}
          strokeWidth={1.5}
          opacity={dim ? 0.7 : 1}
        />
      ))}
    </svg>
  );
}

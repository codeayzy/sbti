import { useMemo } from 'react';
import { dimensionOrder, dimensionMeta } from '../../data/dimensions';

interface Props {
  rawScores: Record<string, number>;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 48;
const LEVELS = 6;
const LABELS = dimensionOrder;

function polarToCart(angle: number, radius: number): [number, number] {
  const rad = (angle - Math.PI / 2);
  return [
    CENTER + radius * Math.cos(rad),
    CENTER + radius * Math.sin(rad),
  ];
}

export function RadarChart({ rawScores }: Props) {
  const points = useMemo(() => {
    const count = LABELS.length;
    const angleStep = (2 * Math.PI) / count;

    return LABELS.map((dim, i) => {
      const score = rawScores[dim] ?? 0;
      const ratio = score / LEVELS;
      const angle = i * angleStep;
      const [x, y] = polarToCart(angle, MAX_RADIUS * ratio);
      return { dim, score, angle, x, y };
    });
  }, [rawScores]);

  const count = LABELS.length;
  const angleStep = (2 * Math.PI) / count;

  // Grid rings
  const rings = [1, 2, 3, 4, 5, 6].map(level => {
    const r = (level / LEVELS) * MAX_RADIUS;
    const ringPoints = Array.from({ length: count }, (_, i) => {
      const [x, y] = polarToCart(i * angleStep, r);
      return `${x},${y}`;
    }).join(' ');
    return ringPoints;
  });

  // Axis lines
  const axes = LABELS.map((_, i) => {
    const [x, y] = polarToCart(i * angleStep, MAX_RADIUS);
    return { x1: CENTER, y1: CENTER, x2: x, y2: y };
  });

  // Data polygon
  const dataPolygon = points.map(p => `${p.x},${p.y}`).join(' ');

  // Label positions
  const labelPoints = LABELS.map((dim, i) => {
    const [x, y] = polarToCart(i * angleStep, MAX_RADIUS + 22);
    const meta = dimensionMeta[dim];
    const shortLabel = dim;
    return { x, y, label: shortLabel, fullLabel: meta?.name ?? dim };
  });

  return (
    <div className="radar">
      <h3 className="radar__title">十五维度雷达</h3>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="radar__svg">
        {/* Grid */}
        {rings.map((ring, i) => (
          <polygon
            key={i}
            points={ring}
            fill="none"
            stroke="rgba(106,120,111,0.15)"
            strokeWidth="1"
          />
        ))}
        {/* Axes */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={axis.x1} y1={axis.y1}
            x2={axis.x2} y2={axis.y2}
            stroke="rgba(106,120,111,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Data fill */}
        <polygon
          points={dataPolygon}
          fill="rgba(108,141,113,0.18)"
          stroke="#4d6a53"
          strokeWidth="2"
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y}
            r="3.5"
            fill="#4d6a53"
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}
        {/* Labels */}
        {labelPoints.map((lp, i) => (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="radar__label"
            fontSize="9"
            fontWeight="600"
            fill="#4d6a53"
          >
            {lp.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

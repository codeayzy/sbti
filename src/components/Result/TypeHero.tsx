import { useEffect, useState } from 'react';
import { TYPE_IMAGES } from '../../data/types';
import type { TestResult } from '../../utils/scoring';

interface Props {
  result: TestResult;
}

export function TypeHero({ result }: Props) {
  const { finalType } = result;
  const imgSrc = TYPE_IMAGES[finalType.code] ?? '';
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; r: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#87A96B', '#A8D5A2', '#D4E4D0', '#5C8A5E', '#E8F5E2'];
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#87A96B',
    }));
    setConfetti(items);
  }, []);

  return (
    <div className="type-hero">
      {/* Confetti burst */}
      <div className="type-hero__confetti">
        {confetti.map(c => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: c.r,
              height: c.r,
              backgroundColor: c.color,
              animationDelay: `${c.id * 0.04}s`,
            }}
          />
        ))}
      </div>

      {/* Main row: avatar left, info right */}
      <div className="type-hero__main">
        {/* Avatar */}
        <div className="type-hero__avatar">
          {imgSrc ? (
            <img src={imgSrc} alt={finalType.code} className="type-hero__img" />
          ) : (
            <div className="type-hero__placeholder">{finalType.code}</div>
          )}
        </div>

        {/* Badge */}
        <div className="type-hero__badge">
          <span className="type-hero__mode">{result.modeKicker}</span>
          <h2 className="type-hero__code">{finalType.code}（{finalType.cn}）</h2>
          <p className="type-hero__badge-text">{result.badge}</p>
        </div>
      </div>

      {/* Quote */}
      <div className="type-hero__quote">
        <p>"{finalType.intro}"</p>
      </div>
    </div>
  );
}

import { dimensionOrder, dimensionMeta, DIM_EXPLANATIONS } from '../../data/dimensions';

interface Props {
  rawScores: Record<string, number>;
  levels: Record<string, string>;
}

export function DimBreakdown({ rawScores, levels }: Props) {
  return (
    <div className="dim-list">
      <h3 className="dim-list__title">十五维度详情</h3>
      {dimensionOrder.map(dim => {
        const level = levels[dim] ?? 'M';
        const score = rawScores[dim] ?? 0;
        const meta = dimensionMeta[dim];
        const explanation = DIM_EXPLANATIONS[dim]?.[level as keyof typeof DIM_EXPLANATIONS[string]] ?? '';
        return (
          <div className="dim-item" key={dim}>
            <div className="dim-item__top">
              <span className="dim-item__name">{meta?.name ?? dim}</span>
              <span className="dim-item__score">{level} / {score}分</span>
            </div>
            {/* Level bar */}
            <div className="dim-item__bar">
              <div
                className="dim-item__bar-fill"
                style={{ width: `${(score / 6) * 100}%` }}
              />
            </div>
            <p className="dim-item__explanation">{explanation}</p>
          </div>
        );
      })}
    </div>
  );
}

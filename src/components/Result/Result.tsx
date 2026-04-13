import { useTest } from '../../context/TestContext';
import { TypeHero } from './TypeHero';
import { DimBreakdown } from './DimBreakdown';
import { RadarChart } from './RadarChart';
import { ShareBar } from './ShareBar';
import { AdSlot } from '../common/AdSlot';

export function Result() {
  const { result } = useTest();

  if (!result) return null;

  return (
    <section className="result">
      <TypeHero result={result} />

      {/* Description */}
      <div className="result__desc-card">
        <h3 className="result__desc-title">一句话解读</h3>
        <p className="result__desc-text">{result.finalType.desc}</p>
        <p className="result__desc-sub">{result.sub}</p>
      </div>

      <AdSlot className="result__ad" />

      {/* Radar Chart */}
      <RadarChart rawScores={result.rawScores} />

      {/* Dimension Breakdown */}
      <DimBreakdown rawScores={result.rawScores} levels={result.levels} />

      <ShareBar result={result} />
    </section>
  );
}

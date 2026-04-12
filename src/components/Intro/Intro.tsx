import { useTest } from '../../context/TestContext';
import { TYPE_LIBRARY, ALL_TYPE_CODES, SPECIAL_TYPE_CODES, TYPE_IMAGES } from '../../data/types';
import { shareSite, formatSavedTime } from '../../utils/share';

export function Intro() {
  const { startTest, showToast, savedResult, viewSavedResult } = useTest();

  const handleShare = () => shareSite(showToast);
  const handleViewSaved = () => viewSavedResult();

  return (
    <section className="intro">
      {/* Floating decorative elements */}
      <div className="intro__decor">
        <span className="leaf leaf--1">🍃</span>
        <span className="leaf leaf--2">🌿</span>
        <span className="leaf leaf--3">🍀</span>
        <span className="leaf leaf--4">🌱</span>
      </div>

      <div className="intro__hero">
        <div className="intro__sprout">🌱</div>
        <h1 className="intro__title">
          SBTI
        </h1>
        <p className="intro__tagline">MBTI已经过时，SBTI来了。</p>
        <p className="intro__desc">
          免费在线完成 31 道 SBTI 人格测试题，快速查看你的隐藏人格类型、性格倾向和趣味解析。
        </p>
      </div>

      <button className="btn btn--primary btn--pulse" onClick={startTest}>
        开始
        <span className="btn__icon">→</span>
      </button>

      {savedResult && (
        <div className="intro__saved">
          <button className="btn btn--ghost" onClick={handleViewSaved}>
            查看上次结果：{savedResult.result.finalType.code}（{savedResult.result.finalType.cn}）
          </button>
          <span className="intro__saved-time">
            {formatSavedTime(savedResult.savedAt)}
          </span>
        </div>
      )}

      <div className="intro__share">
        <button className="btn btn--ghost" onClick={handleShare}>
          分享给朋友
        </button>
      </div>

      <div className="intro__types">
        <h2 className="intro__types-title">
          共有 {Object.keys(TYPE_LIBRARY).length} 种人格
        </h2>
        <p className="intro__types-sub">
          {ALL_TYPE_CODES.length - SPECIAL_TYPE_CODES.length} 种常规人格，{SPECIAL_TYPE_CODES.length} 种特殊触发人格
        </p>
        <div className="intro__grid">
          {ALL_TYPE_CODES.map(code => {
            const data = TYPE_LIBRARY[code];
            if (!data) return null;
            const imgSrc = TYPE_IMAGES[code];
            const isSpecial = SPECIAL_TYPE_CODES.includes(code as typeof SPECIAL_TYPE_CODES[number]);
            return (
              <div className="type-card" key={code}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={code}
                    className="type-card__img"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="type-card__code">{code}</div>
                <div className="type-card__cn">{data.cn}</div>
                {isSpecial && <div className="type-card__tag">特殊</div>}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="intro__footer">
        原作者：<a href="https://space.bilibili.com/417038183" target="_blank" rel="noopener noreferrer">B站@蛆肉儿串儿</a>
      </footer>
    </section>
  );
}

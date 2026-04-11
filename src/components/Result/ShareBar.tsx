import { useState } from 'react';
import { useTest } from '../../context/TestContext';
import { copySiteLink, generatePoster, sharePoster } from '../../utils/share';
import { TYPE_IMAGES } from '../../data/types';
import type { TestResult } from '../../utils/scoring';

interface Props {
  result: TestResult;
}

export function ShareBar({ result }: Props) {
  const { showToast, startTest, goToScreen } = useTest();
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);

  const handlePoster = async () => {
    if (posterLoading) return;
    setPosterLoading(true);
    try {
      const imageSrc = TYPE_IMAGES[result.finalType.code] ?? '';
      const blob = await generatePoster({ ...result, imageSrc });
      const fileName = `SBTI_${result.finalType.code}.png`;
      const dataUrl = await sharePoster(blob, fileName, result, showToast);
      if (dataUrl) {
        setPosterImage(dataUrl);
      }
    } catch {
      showToast('海报生成失败，请稍后再试');
    } finally {
      setPosterLoading(false);
    }
  };

  return (
    <div className="share-bar">
      <div className="share-bar__actions">
        <button
          className="btn btn--primary"
          onClick={handlePoster}
          disabled={posterLoading}
        >
          {posterLoading ? '生成中...' : '保存并分享'}
        </button>
        <button
          className="btn btn--outline"
          onClick={() => copySiteLink(showToast)}
        >
          复制链接
        </button>
        <button
          className="btn btn--ghost"
          onClick={startTest}
        >
          重新测试
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => goToScreen('intro')}
        >
          回到首页
        </button>
      </div>

      {/* Poster modal: long-press to save in WeChat */}
      {posterImage && (
        <div className="poster-modal" onClick={() => setPosterImage(null)}>
          <div className="poster-modal__content" onClick={e => e.stopPropagation()}>
            <img src={posterImage} alt="SBTI 结果海报" />
            <p className="poster-modal__hint">长按图片保存到相册</p>
            <button
              className="btn btn--outline"
              onClick={() => setPosterImage(null)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

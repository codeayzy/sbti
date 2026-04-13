interface Props {
  className?: string;
}

const AD_IMAGE_SRC = '/images/yanjiushe.webp';
const AD_IMAGE_ALT = '言究社英语学习';

export function AdSlot({ className = '' }: Props) {
  return (
    <section onClick={() => {
      window.open('https://english.codecvcv.com?utm_source=sbti')
    }} className={`ad-slot ${className}`.trim()} aria-label="广告">
      <div className="ad-slot__meta">免费背单词学句子 - 英语学习平台 ⬇️，点击体验</div>
      <img src={AD_IMAGE_SRC} alt={AD_IMAGE_ALT} className="ad-slot__img" loading="lazy" decoding="async" />
    </section>
  );
}

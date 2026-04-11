export const SITE_URL = 'https://sbti.codecvcv.com';
export const SITE_HOST = 'sbti.codecvcv.com';
export const RESULT_STORAGE_KEY = 'sbti:last-result:v2';

export interface SavedResult {
  savedAt: number;
  imageSrc: string;
  result: {
    finalType: { code: string; cn: string; intro: string; desc: string };
    modeKicker: string;
    badge: string;
    sub: string;
    special: boolean;
    rawScores: Record<string, number>;
    levels: Record<string, string>;
  };
}

export function getQrUrl(size = 240, format = 'png'): string {
  return `https://quickchart.io/qr?text=${encodeURIComponent(SITE_URL)}&size=${size}&margin=1&dark=1e2a22&light=ffffff&format=${format}`;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function getDefaultShareText(): string {
  return '我刚玩了 SBTI 人格测试，来测测你的隐藏人格类型。';
}

export function getResultShareText(result: {
  finalType: { code: string; cn: string };
  badge: string;
  sub: string;
}): string {
  return `我测出的 SBTI 结果是 ${result.finalType.code}（${result.finalType.cn}）。${result.badge}。${result.sub}`;
}

async function sharePayload(payload: {
  title?: string;
  text?: string;
  url?: string;
}, showToast: (msg: string) => void): Promise<void> {
  try {
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    await copyText([payload.title, payload.text, payload.url].filter(Boolean).join('\n'));
    showToast('分享文案和链接已复制');
  } catch {
    showToast('当前环境暂时无法分享，请稍后再试');
  }
}

export async function shareSite(showToast: (msg: string) => void): Promise<void> {
  await sharePayload({
    title: 'SBTI 人格测试',
    text: getDefaultShareText(),
    url: SITE_URL,
  }, showToast);
}

export async function shareResult(
  result: { finalType: { code: string; cn: string }; badge: string; sub: string },
  showToast: (msg: string) => void,
): Promise<void> {
  await sharePayload({
    title: `我的 SBTI 结果：${result.finalType.code}（${result.finalType.cn}）`,
    text: getResultShareText(result),
    url: SITE_URL,
  }, showToast);
}

export async function copySiteLink(showToast: (msg: string) => void): Promise<void> {
  try {
    await copyText(SITE_URL);
    showToast('测试链接已复制');
  } catch {
    showToast('当前环境暂时无法复制链接');
  }
}

// --- Poster Generation ---

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = '';
  for (const char of text) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generatePoster(result: {
  finalType: { code: string; cn: string; intro: string; desc: string };
  badge: string;
  imageSrc: string;
}): Promise<Blob> {
  const W = 750;
  const AVATAR_SIZE = 240;
  const DESC_MAX_LINES = 5;
  const DESC_LINE_H = 30;
  const BOTTOM_H = 170;
  const BOTTOM_PAD = 40;

  // --- Measure phase: calculate total height ---
  const measureCanvas = document.createElement('canvas');
  measureCanvas.width = W;
  const mctx = measureCanvas.getContext('2d')!;

  const avatarY = 90;
  const nameY = avatarY + AVATAR_SIZE + 70;

  mctx.font = 'italic 21px system-ui, -apple-system, sans-serif';
  const quoteLineCount = Math.min(wrapText(mctx, `"${result.finalType.intro}"`, W - 120).length, 3);
  const descStartY = nameY + 88 + quoteLineCount * 32 + 14;

  mctx.font = '400 18px system-ui, -apple-system, sans-serif';
  const descLineCount = Math.min(wrapText(mctx, result.finalType.desc, W - 120).length, DESC_MAX_LINES);
  const descEndY = descStartY + descLineCount * DESC_LINE_H;

  const contentEndY = descEndY + 36;
  const H = Math.max(contentEndY + BOTTOM_H + BOTTOM_PAD, 700);

  // --- Draw phase ---
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#2E5A3D');
  grad.addColorStop(0.6, '#3A6B4A');
  grad.addColorStop(1, '#1E3F2B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.fillStyle = 'rgba(135,169,107,0.12)';
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.06, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W * 0.1, H * 0.94, 80, 0, Math.PI * 2);
  ctx.fill();

  // Top branding
  ctx.fillStyle = 'rgb(240, 247, 238)';
  ctx.font = '700 40px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SBTI', W / 2, 55);

  // Avatar
  const avatarX = (W - AVATAR_SIZE) / 2;

  ctx.fillStyle = 'rgba(240,247,238,0.15)';
  roundRect(ctx, avatarX - 14, avatarY - 14, AVATAR_SIZE + 28, AVATAR_SIZE + 28, 22);
  ctx.fill();

  try {
    const avatarImg = await loadImage(result.imageSrc);
    ctx.save();
    roundRect(ctx, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE, 16);
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, AVATAR_SIZE, AVATAR_SIZE);
    ctx.restore();
  } catch {
    ctx.fillStyle = '#F0F7EE';
    ctx.font = '700 56px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(result.finalType.code, W / 2, avatarY + AVATAR_SIZE / 2 + 18);
  }

  // Type code & name
  ctx.fillStyle = '#F0F7EE';
  ctx.font = '700 40px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${result.finalType.code}（${result.finalType.cn}）`, W / 2, nameY);

  // Badge
  ctx.fillStyle = 'rgba(135,169,107,0.9)';
  ctx.font = '600 23px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.badge, W / 2, nameY + 44);

  // Intro quote
  ctx.fillStyle = 'rgba(240,247,238,0.8)';
  ctx.font = 'italic 21px system-ui, -apple-system, sans-serif';
  const quoteLines = wrapText(ctx, `"${result.finalType.intro}"`, W - 120);
  let quoteY = nameY + 88;
  for (const line of quoteLines.slice(0, 3)) {
    ctx.fillText(line, W / 2, quoteY);
    quoteY += 32;
  }

  // Description (一句话解读)
  ctx.fillStyle = 'rgba(240,247,238,0.65)';
  ctx.font = '400 18px system-ui, -apple-system, sans-serif';
  const descLines = wrapText(ctx, result.finalType.desc, W - 120);
  const visibleDescLines = descLines.slice(0, DESC_MAX_LINES);
  const descYStart = quoteY + 14;
  for (let i = 0; i < visibleDescLines.length; i++) {
    const line = visibleDescLines[i] ?? '';
    const text = i === DESC_MAX_LINES - 1 && descLines.length > DESC_MAX_LINES
      ? line.slice(0, -1) + '…'
      : line;
    ctx.fillText(text, W / 2, descYStart + i * DESC_LINE_H);
  }

  // Bottom section: QR code + CTA
  const bottomY = H - BOTTOM_H - BOTTOM_PAD;

  ctx.fillStyle = 'rgba(240,247,238,0.1)';
  roundRect(ctx, 40, bottomY, W - 80, BOTTOM_H, 20);
  ctx.fill();

  try {
    const qrImg = await loadImage(getQrUrl(130));
    ctx.drawImage(qrImg, 70, bottomY + 18, 130, 130);
  } catch {
    // Skip QR if fails
  }

  ctx.fillStyle = '#F0F7EE';
  ctx.font = '600 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('扫码测测你的隐藏人格', 225, bottomY + 60);

  ctx.fillStyle = 'rgba(240,247,238,0.5)';
  ctx.font = '400 17px system-ui, -apple-system, sans-serif';
  ctx.fillText('sbti.codecvcv.com', 225, bottomY + 95);

  // Export
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Canvas export failed')),
      'image/png',
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function sharePoster(
  blob: Blob,
  fileName: string,
  result: { finalType: { code: string; cn: string } },
  showToast: (msg: string) => void,
): Promise<void> {
  const file = new File([blob], fileName, { type: 'image/png' });

  // Try Web Share API with files (mobile)
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `我的 SBTI 结果：${result.finalType.code}`,
        text: `我测出了 ${result.finalType.code}（${result.finalType.cn}），快来测测你的！`,
        files: [file],
      });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  showToast('海报已保存');
}

// --- Storage ---

function storageAvailable(): boolean {
  try {
    const key = '__sbti_probe__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function saveResultToStorage(data: SavedResult): void {
  if (!storageAvailable()) return;
  try {
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function loadSavedResultFromStorage(): SavedResult | null {
  if (!storageAvailable()) return null;
  try {
    const raw = localStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.result?.finalType) return null;
    return parsed as SavedResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function formatSavedTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

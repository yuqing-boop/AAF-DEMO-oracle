/** @type {Map<string, Promise<HTMLImageElement>>} */
const maskLoadPromises = new Map();

/**
 * @param {string} maskUrl
 * @returns {Promise<HTMLImageElement>}
 */
function loadMaskImage(maskUrl) {
  let p = maskLoadPromises.get(maskUrl);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Mask failed to load: ${maskUrl}`));
      img.src = maskUrl;
    });
    maskLoadPromises.set(maskUrl, p);
  }
  return p;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {HTMLVideoElement} video
 * @param {HTMLImageElement} maskImg
 * @param {string} badgeText
 * @param {string} titleText
 */
function drawOracleFrame(ctx, w, h, video, maskImg, badgeText, titleText) {
  ctx.clearRect(0, 0, w, h);

  if (video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, w, h);
  }

  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskImg, 0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  const cx = w / 2;
  const badgeY = h * 0.52;
  const titleY = h * 0.565;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `500 ${Math.round(w * 0.045)}px "Neuzeit 2", "DM Sans", system-ui, sans-serif`;
  ctx.fillStyle = 'oklch(97% 0.03 300)';
  ctx.fillText(badgeText, cx, badgeY);

  ctx.font = `300 ${Math.round(w * 0.038)}px "Neuzeit 2", "DM Sans", system-ui, sans-serif`;
  const maxW = w * 0.42;
  wrapFillText(ctx, titleText, cx, titleY, maxW, Math.round(w * 0.038) * 1.36);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} cx
 * @param {number} startY
 * @param {number} maxWidth
 * @param {number} lineHeight
 */
function wrapFillText(ctx, text, cx, startY, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const totalH = (lines.length - 1) * lineHeight;
  let y = startY - totalH / 2;
  ctx.fillStyle = 'oklch(98% 0.015 300)';
  for (const ln of lines) {
    ctx.fillText(ln, cx, y);
    y += lineHeight;
  }
}

/**
 * Records masked oracle card motion from a playing {@link HTMLVideoElement}.
 *
 * @param {object} opts
 * @param {HTMLVideoElement} opts.video
 * @param {string} opts.maskUrl
 * @param {string} opts.badgeText
 * @param {string} opts.titleText
 * @param {number} [opts.durationMs]
 * @param {number} [opts.width]
 * @param {number} [opts.height]
 * @returns {Promise<Blob>}
 */
export async function recordOracleCardWebm({
  video,
  maskUrl,
  badgeText,
  titleText,
  durationMs = 5200,
  width = 595,
  height = 842,
}) {
  const maskImg = await loadMaskImage(maskUrl);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas 2D unsupported');

  let mimeType = 'video/webm;codecs=vp9';
  if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const stream = canvas.captureStream(30);
  const chunks = [];

  await video.play().catch(() => {});

  return new Promise((resolve, reject) => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported(mimeType)) {
      reject(new Error('Video recording is not supported in this browser.'));
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onerror = () => reject(new Error('Recording failed.'));
    recorder.onstop = () => {
      const blobType = mimeType.split(';')[0] || 'video/webm';
      resolve(new Blob(chunks, { type: blobType }));
    };

    recorder.start(100);

    const t0 = performance.now();

    const tick = () => {
      drawOracleFrame(ctx, width, height, video, maskImg, badgeText, titleText);
      if (performance.now() - t0 >= durationMs) {
        recorder.stop();
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

/**
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * @param {Blob} blob
 * @param {string} filename
 * @param {string} [title]
 * @returns {Promise<boolean>} true if shared
 */
export async function shareVideoBlob(blob, filename, title = '') {
  const file = new File([blob], filename, { type: blob.type || 'video/webm' });
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title });
    return true;
  }
  return false;
}

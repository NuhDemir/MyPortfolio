import { useState, useEffect, useRef } from "react";

const DEFAULT_COLOR = "transparent";

const extractColors = (img) => {
  try {
    const canvas = document.createElement("canvas");
    const size = 50;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    const colorBuckets = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r + g + b < 30 || r + g + b > 720) continue;
      const key = `${Math.round(r / 32)},${Math.round(g / 32)},${Math.round(b / 32)}`;
      if (!colorBuckets[key]) colorBuckets[key] = { r: 0, g: 0, b: 0, count: 0 };
      colorBuckets[key].r += r;
      colorBuckets[key].g += g;
      colorBuckets[key].b += b;
      colorBuckets[key].count++;
    }

    const sorted = Object.values(colorBuckets)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((c) => ({
        r: Math.round(c.r / c.count),
        g: Math.round(c.g / c.count),
        b: Math.round(c.b / c.count),
      }));

    if (sorted.length === 0) return DEFAULT_COLOR;

    const boostSat = (col, factor) => {
      const avg = (col.r + col.g + col.b) / 3;
      return {
        r: Math.round(Math.min(255, avg + (col.r - avg) * factor)),
        g: Math.round(Math.min(255, avg + (col.g - avg) * factor)),
        b: Math.round(Math.min(255, avg + (col.b - avg) * factor)),
      };
    };

    const boosted = sorted.map((c) => boostSat(c, 1.6));

    const stops = boosted.map((c, i) => {
      const alpha = (0.5 - i * 0.15).toFixed(2);
      return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
    });

    return stops.join(", ") + ", transparent";
  } catch {
    return "transparent";
  }
};

export const useDominantColor = (imageUrl) => {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) { setColor(DEFAULT_COLOR); return; }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    imgRef.current = img;

    const handleLoad = () => {
      if (cancelled) return;
      setTimeout(() => {
        if (!cancelled) setColor(extractColors(img));
      }, 50);
    };

    const handleError = () => {
      if (!cancelled) setColor(DEFAULT_COLOR);
    };

    if (img.complete && img.naturalWidth > 0) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad, { once: true });
    }
    img.addEventListener("error", handleError, { once: true });

    const url = new URL(imageUrl, window.location.origin);
    url.searchParams.set("_cors", Date.now().toString(36));
    img.src = url.toString();

    return () => {
      cancelled = true;
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [imageUrl]);

  return color;
};

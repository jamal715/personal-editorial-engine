"use client";

import { useEffect, useState } from "react";

const sizes = [18, 20, 22, 24];
const widths = [620, 720, 820];

export default function ReaderControls() {
  const [sizeIndex, setSizeIndex] = useState(1);
  const [widthIndex, setWidthIndex] = useState(1);
  const [theme, setTheme] = useState("warm");
  const [font, setFont] = useState("editorial");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.font = font;
    document.documentElement.style.setProperty("--reader-size", `${sizes[sizeIndex]}px`);
    document.documentElement.style.setProperty("--reader-width", `${widths[widthIndex]}px`);
  }, [sizeIndex, widthIndex, theme, font]);

  return (
    <div className="reader-toolbar" aria-label="Reading preferences">
      <button onClick={() => setSizeIndex(Math.max(0, sizeIndex - 1))}>A−</button>
      <button onClick={() => setSizeIndex(Math.min(sizes.length - 1, sizeIndex + 1))}>A+</button>
      <select value={font} onChange={e => setFont(e.target.value)} aria-label="Typeface">
        <option value="editorial">Editorial</option>
        <option value="sans">Sans</option>
        <option value="accessible">Accessible</option>
      </select>
      <select value={theme} onChange={e => setTheme(e.target.value)} aria-label="Theme">
        <option value="warm">Warm</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button onClick={() => setWidthIndex((widthIndex + 1) % widths.length)}>↔</button>
    </div>
  );
}

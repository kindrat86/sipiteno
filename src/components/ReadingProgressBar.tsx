import { useEffect, useState } from "react";

/**
 * ReadingProgressBar — Fixed top bar that shows page scroll progress.
 * Uses requestAnimationFrame for smooth 60fps updates.
 * R15 premium UX enhancement.
 */
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 z-[10001] h-[3px] transition-[width] duration-100"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
      }}
    />
  );
};

export default ReadingProgressBar;

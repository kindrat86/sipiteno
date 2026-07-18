import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop — Floating button that appears after scrolling 400px.
 * Smooth scrolls to top on click. Positioned with safe-area insets.
 * R15 premium UX enhancement.
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`
        fixed z-[9999]
        bottom-[calc(24px+env(safe-area-inset-bottom,0px))]
        right-[calc(24px+env(safe-area-inset-right,0px))]
        w-12 h-12 rounded-full
        bg-primary text-primary-foreground
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:bg-primary/90
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
        ${visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-5 pointer-events-none"
        }
      `}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
};

export default BackToTop;

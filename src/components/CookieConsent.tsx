import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConsent, hasConsented, setConsent } from "@/lib/consent";
import { initPostHogDeferred } from "@/lib/posthog";
import { initClarityDeferred } from "@/lib/clarity";
import { trackAiReferral } from "@/lib/analytics";

// No ad/retargeting pixels are loaded here — see the note in acceptAll(). The
// former "@/lib/marketing-pixels" module (Meta/Reddit/LinkedIn) was deleted
// 2026-07-25; do not reintroduce it into either consent category.

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Brief delay so the banner doesn't flash on every load
    const t = setTimeout(() => {
      if (!hasConsented()) {
        setVisible(true);
      } else {
        // Returning visitor with stored consent — init services immediately.
        // (Visitors without analytics consent already run cookieless PostHog
        // from main.tsx; nothing extra to start here.)
        const consent = getConsent();
        if (consent?.analytics) {
          initPostHogDeferred();
          trackAiReferral();
        }
        if (consent?.experience) {
          initClarityDeferred();
        }
      }
    }, 400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  // "Accept All" grants exactly what the banner text names: PostHog (analytics)
  // and Microsoft Clarity (experience). It used to also fire the Meta, Reddit and
  // LinkedIn pixels, which the banner never mentioned — consent that doesn't name
  // advertising is neither specific nor informed, so it wasn't valid consent for
  // them. They were removed portfolio-wide on 2026-07-25 rather than added to the
  // banner text, because 180 days of PostHog showed no ad campaign has ever run.
  function acceptAll() {
    setConsent({ analytics: true, experience: true });
    initPostHogDeferred();
    initClarityDeferred();
    trackAiReferral();
    setVisible(false);
  }

  function essentialOnly() {
    setConsent({ analytics: false, experience: false });
    setVisible(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        borderTop: "1px solid #1f2937",
        padding: "16px 24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "0.85rem",
        color: "#d1d5db",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ margin: 0, maxWidth: "600px", lineHeight: 1.5 }}>
        We use cookies for analytics (PostHog) and user experience improvement
        (Microsoft Clarity).{" "}
        <Link
          to="/privacy"
          style={{ color: "#00d4aa", textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={essentialOnly}
          style={{
            background: "transparent",
            color: "#9ca3af",
            border: "1px solid #374151",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          Essential Only
        </button>
        <button
          onClick={acceptAll}
          style={{
            background: "linear-gradient(135deg, #00d4aa, #2deec0)",
            color: "#04130e",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}

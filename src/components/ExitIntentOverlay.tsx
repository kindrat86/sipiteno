import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { X, Download, Lock } from "lucide-react";

const DISMISSED_KEY = "sipiteno_exit_dismissed_v1";

export default function ExitIntentOverlay() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animate, setAnimate] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || shown.current) return;
      shown.current = true;
      setVisible(true);
      requestAnimationFrame(() => setAnimate(true));
    };

    const t = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim() !== "") return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: t("leadMagnet.errorValidEmail"), description: t("leadMagnet.errorValidEmailDesc"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name || "Exit-Intent Subscriber",
          companyName: "(exit intent)",
          email,
          phone: "",
          country: "",
          service: "Free Expansion Playbook (Exit Intent)",
          message: "EXIT INTENT: User triggered exit-intent overlay and requested the expansion playbook. Please add to autoresponder.",
          honeypot,
        }),
      });
      if (!resp.ok) throw new Error(`contact api ${resp.status}`);
      trackEvent("exit_intent_conversion", {});
      toast({ title: t("exitIntent.successTitle"), description: t("exitIntent.successDesc") });
      setEmail(""); setName("");
      localStorage.setItem(DISMISSED_KEY, "true");
      setVisible(false);
    } catch {
      trackEvent("exit_intent_failed", {});
      toast({ title: t("exitIntent.errorTitle"), description: t("exitIntent.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        opacity: animate ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "relative", maxWidth: "520px", width: "100%",
        background: "#0d1117", border: "1px solid #1f2937",
        borderRadius: "20px", padding: "36px 28px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        transform: animate ? "translateY(0)" : "translateY(24px)",
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <button onClick={dismiss} aria-label={t("exitIntent.close")} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "transparent", border: "none", cursor: "pointer",
          color: "#9ca3af", padding: "4px", lineHeight: 1,
        }}>
          <X size={20} />
        </button>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 14px", borderRadius: "100px",
          background: "rgba(0,212,170,0.12)",
          border: "1px solid rgba(0,212,170,0.25)",
          marginBottom: "16px",
        }}>
          <Download size={14} color="#00d4aa" />
          <span style={{ color: "#00d4aa", fontWeight: 700, fontSize: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {t("exitIntent.badge")}
          </span>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#e5e7eb", lineHeight: 1.3, margin: "0 0 8px" }}>
          {t("exitIntent.title")}
        </h2>
        <p style={{ fontSize: "15px", color: "#9ca3af", lineHeight: 1.5, margin: "0 0 20px" }}>
          {t("exitIntent.body")}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text" name="honeypot" value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="ei-name" style={{ display: "block", fontSize: "13px", color: "#d1d5db", fontWeight: 500, marginBottom: "4px" }}>
              {t("exitIntent.firstName")} <span style={{ color: "#6b7280", fontWeight: 400 }}>{t("leadMagnet.optional")}</span>
            </label>
            <input id="ei-name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("exitIntent.firstNamePlaceholder")}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #1f2937", background: "#161b22", color: "#e5e7eb", fontSize: "15px", outline: "none" }}
              autoComplete="name" />
          </div>

          <div>
            <label htmlFor="ei-email" style={{ display: "block", fontSize: "13px", color: "#d1d5db", fontWeight: 500, marginBottom: "4px" }}>
              {t("exitIntent.email")} <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input id="ei-email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("exitIntent.emailPlaceholder")}
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #1f2937", background: "#161b22", color: "#e5e7eb", fontSize: "15px", outline: "none" }}
              autoComplete="email" />
          </div>

          <button type="submit" disabled={isSubmitting}
            style={{
              width: "100%", padding: "12px 20px", borderRadius: "10px",
              border: "none", background: "linear-gradient(135deg, #00d4aa, #2deec0)",
              color: "#04130e", fontSize: "16px", fontWeight: 700,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: "0 4px 14px rgba(0,212,170,0.25)",
            }}
          >
            {isSubmitting ? t("exitIntent.sending") : t("exitIntent.submit")}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
            <Lock size={12} color="#6b7280" />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>{t("exitIntent.privacy")}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

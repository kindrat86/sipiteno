import { useTranslation } from "react-i18next";
import { ArrowRight, Flag } from "lucide-react";
import { Link } from "react-router-dom";

const MassMovement = () => {
  const { t } = useTranslation();
  return (
    <section className="py-section-lg bg-foreground text-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            <Flag className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            <span className="text-secondary font-bold uppercase tracking-widest text-xs md:text-sm">{t("massMovement.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-8 leading-tight">
            {t("massMovement.title1")}<br />
            <span className="text-secondary">{t("massMovement.title2")}</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-background/70 text-center max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">{t("massMovement.body")}</p>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
            <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-background/5 border border-background/10">
              <div className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-wide mb-3 md:mb-4">{t("massMovement.forYou")}</div>
              <ul className="space-y-2 md:space-y-3 text-background/80 text-sm md:text-base">
                {[1,2,3,4].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-secondary font-bold flex-shrink-0">&rarr;</span><span>{t(`massMovement.forYou${i}`)}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-background/5 border border-background/10">
              <div className="text-destructive font-bold text-[10px] md:text-xs uppercase tracking-wide mb-3 md:mb-4">{t("massMovement.notForYou")}</div>
              <ul className="space-y-2 md:space-y-3 text-background/60 text-sm md:text-base">
                {[1,2,3,4].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-destructive/70 flex-shrink-0">&#10005;</span><span>{t(`massMovement.notForYou${i}`)}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center">
            <p className="text-background/60 mb-4 md:mb-6 text-xs md:text-sm">{t("massMovement.invitation")}</p>
            <Link to="/#free-playbook" className="inline-flex items-center gap-2 text-secondary font-bold text-base md:text-lg hover:gap-3 transition-all">
              {t("massMovement.cta")}<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MassMovement;

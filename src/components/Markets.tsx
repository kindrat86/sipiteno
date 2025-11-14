import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

const markets = [
  { country: "Ukraine", flag: "🇺🇦" },
  { country: "Kazakhstan", flag: "🇰🇿" },
  { country: "Azerbaijan", flag: "🇦🇿" },
  { country: "Uzbekistan", flag: "🇺🇿" },
  { country: "Serbia", flag: "🇷🇸" },
  { country: "Poland", flag: "🇵🇱" },
  { country: "Cyprus", flag: "🇨🇾" },
  { country: "Greece", flag: "🇬🇷" },
];

const Markets = () => {
  return (
    <section id="markets" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Markets We Serve
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deep expertise across Eastern European tech ecosystems. We understand the unique challenges and opportunities in each market.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {markets.map((market, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-6 bg-card rounded-xl border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {market.flag}
                </div>
                <div className="text-sm font-semibold text-center text-foreground">
                  {market.country}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-card rounded-2xl p-8 border-2 border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">Regional Expertise</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">Market Intelligence</Badge>
                </h4>
                <p className="text-muted-foreground">
                  Local market insights, cultural nuances, and business practices that drive successful partnerships.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-secondary/10">Regulatory Navigation</Badge>
                </h4>
                <p className="text-muted-foreground">
                  Expert guidance through complex regulatory landscapes and compliance requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-accent/10">Network Access</Badge>
                </h4>
                <p className="text-muted-foreground">
                  Established relationships with key players, government agencies, and industry leaders.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">Language Support</Badge>
                </h4>
                <p className="text-muted-foreground">
                  Multilingual team fluent in local languages and business communication styles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;

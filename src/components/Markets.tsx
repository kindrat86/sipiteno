import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

const markets = [
  { country: "Albania", flag: "🇦🇱" },
  { country: "Armenia", flag: "🇦🇲" },
  { country: "Azerbaijan", flag: "🇦🇿" },
  { country: "Bosnia", flag: "🇧🇦" },
  { country: "Bulgaria", flag: "🇧🇬" },
  { country: "Croatia", flag: "🇭🇷" },
  { country: "Cyprus", flag: "🇨🇾" },
  { country: "Czech Republic", flag: "🇨🇿" },
  { country: "Estonia", flag: "🇪🇪" },
  { country: "Ethiopia", flag: "🇪🇹" },
  { country: "Georgia", flag: "🇬🇪" },
  { country: "Greece", flag: "🇬🇷" },
  { country: "Hungary", flag: "🇭🇺" },
  { country: "India", flag: "🇮🇳" },
  { country: "Kazakhstan", flag: "🇰🇿" },
  { country: "Kyrgyzstan", flag: "🇰🇬" },
  { country: "Latvia", flag: "🇱🇻" },
  { country: "Lithuania", flag: "🇱🇹" },
  { country: "Moldova", flag: "🇲🇩" },
  { country: "Montenegro", flag: "🇲🇪" },
  { country: "North Macedonia", flag: "🇲🇰" },
  { country: "Poland", flag: "🇵🇱" },
  { country: "Romania", flag: "🇷🇴" },
  { country: "Serbia", flag: "🇷🇸" },
  { country: "Slovakia", flag: "🇸🇰" },
  { country: "Slovenia", flag: "🇸🇮" },
  { country: "Ukraine", flag: "🇺🇦" },
  { country: "Uzbekistan", flag: "🇺🇿" },
];

const Markets = () => {
  return (
    <section id="markets" className="py-32 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Globe2 className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              Global Reach
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Markets We Serve
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Deep expertise across Europe, Caucasus, Central Asia, and emerging tech markets. 
            We understand the unique challenges and opportunities in each region.
          </p>
        </div>
        
        {/* Markets Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {markets.map((market, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group hover:-translate-y-1"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {market.flag}
                </div>
                <div className="text-xs font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">
                  {market.country}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Regional Expertise */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-3xl p-10 border-2 border-border shadow-xl">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Regional Expertise</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5">
                    Market Intelligence
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Local market insights, cultural nuances, and business practices that drive successful partnerships.
                </p>
              </div>
              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20">
                <div className="mb-3">
                  <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/30 px-4 py-1.5">
                    Regulatory Navigation
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Expert guidance through complex regulatory landscapes and compliance requirements.
                </p>
              </div>
              <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                <div className="mb-3">
                  <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/30 px-4 py-1.5">
                    Network Access
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Established relationships with key players, government agencies, and industry leaders.
                </p>
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5">
                    Language Support
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
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

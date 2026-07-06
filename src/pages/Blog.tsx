import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  published_at: string | null;
  word_count: number | null;
  week_number: number | null;
}

const CATEGORIES: { label: string; week: number | null }[] = [
  { label: "All", week: null },
  { label: "Speed to Market", week: 1 },
  { label: "Vertical & Niche SaaS", week: 2 },
  { label: "AI & Technical Strategy", week: 3 },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, meta_description, published_at, word_count, week_number")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const filteredPosts = activeCategory
    ? posts?.filter((p) => p.week_number === activeCategory)
    : posts;

  const getCategoryLabel = (week: number | null) => {
    return CATEGORIES.find((c) => c.week === week)?.label ?? null;
  };

  const readingTime = (wordCount: number | null) => {
    if (!wordCount) return "5 min read";
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | Sipiteno - MicroSaaS Insights"
        description="Practical insights on building MicroSaaS products, rapid validation, and AI-powered tools. Learn from real builds like VoiceLogPro and FunnelFixer."
        url="https://sipiteno.com/blog"
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              MicroSaaS Insights
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
              Build Faster. Ship Smarter.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tactical guides on building, launching, and validating MicroSaaS products in weeks, not months. Real lessons from real builds.
            </p>
          </header>

          {/* Category filters */}
          {posts && posts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.week)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.week
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Posts list */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-xl p-8 border border-border">
                  <div className="h-7 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group relative bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden ${
                    index === 0 && !activeCategory ? "p-8 md:p-10" : "p-6 md:p-8"
                  }`}
                >
                  {/* Featured badge for first post */}
                  {index === 0 && !activeCategory && (
                    <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      Latest
                    </div>
                  )}
                  
                  <Link to={`/blog/${post.slug}`} className="block">
                    {getCategoryLabel(post.week_number) && (
                      <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
                        {getCategoryLabel(post.week_number)}
                      </span>
                    )}

                    <h2 className={`font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-tight ${
                      index === 0 && !activeCategory ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                    }`}>
                      {post.title}
                    </h2>
                    
                    {post.meta_description && (
                      <p className={`text-muted-foreground mb-5 leading-relaxed ${
                        index === 0 && !activeCategory ? "text-base md:text-lg line-clamp-3" : "text-base line-clamp-2"
                      }`}>
                        {post.meta_description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {post.published_at && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {readingTime(post.word_count)}
                      </span>
                      
                      <span className="ml-auto flex items-center gap-1.5 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Coming Soon
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                We're working on fresh content. Check back soon for insights on building MicroSaaS products.
              </p>
            </div>
          )}

          {/* Newsletter CTA */}
          {posts && posts.length > 0 && (
            <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Want to build your own MicroSaaS?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                We ship products in 4-8 weeks. Real products, real results, no fluff.
              </p>
              <Link
                to="/#contact"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start Your Project
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

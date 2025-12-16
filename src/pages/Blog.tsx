import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  published_at: string | null;
  word_count: number | null;
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, meta_description, published_at, word_count")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const readingTime = (wordCount: number | null) => {
    if (!wordCount) return "5 min read";
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | Sipiteno - MicroSaaS MVP Insights"
        description="Practical insights on building MicroSaaS MVPs, rapid validation, and AI-powered tools. Learn from real builds like VoiceLogPro and FunnelFixer."
        canonicalUrl="https://sipiteno.com/blog"
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              MicroSaaS MVP Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tactical guides on building, launching, and validating MicroSaaS products in weeks, not months.
            </p>
          </header>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-lg p-6 border border-border">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                      {post.title}
                    </h2>
                    {post.meta_description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {readingTime(post.word_count)}
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No posts published yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

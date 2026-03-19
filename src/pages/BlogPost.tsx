import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import SEOHead from "@/components/SEOHead";
import { articleSchema } from "@/lib/seo/schemas";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { trackEvent } from "@/lib/analytics";

const CATEGORY_LABELS: Record<number, string> = {
  1: "Speed to Market",
  2: "Vertical & Niche SaaS",
  3: "AI & Technical Strategy",
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const trackedRef = useRef(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Related posts — same week_number, exclude current
  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.week_number, post?.id],
    queryFn: async () => {
      const query = supabase
        .from("blog_posts")
        .select("id, title, slug, meta_description, published_at")
        .eq("status", "published")
        .neq("id", post!.id)
        .order("published_at", { ascending: false })
        .limit(3);

      if (post!.week_number) {
        query.eq("week_number", post!.week_number);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!post,
  });

  // Scroll-based read tracking (75% scroll)
  useEffect(() => {
    if (!post || trackedRef.current) return;
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent >= 0.75 && !trackedRef.current) {
        trackedRef.current = true;
        trackEvent("blog_post_read", {
          post_slug: post.slug,
          category: post.week_number ? CATEGORY_LABELS[post.week_number] || "" : "",
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  const readingTime = (wordCount: number | null) => {
    if (!wordCount) return "5 min read";
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-8" />
              <div className="h-12 bg-muted rounded w-3/4 mb-6" />
              <div className="flex gap-4 mb-10">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The blog post you're looking for doesn't exist or hasn't been published yet.
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | Sipiteno Blog`}
        description={post.meta_description || `Read ${post.title} on the Sipiteno blog.`}
        canonicalUrl={`https://sipiteno.com/blog/${post.slug}`}
        ogType="article"
        schemas={[articleSchema({
          title: post.title,
          description: post.meta_description || `Read ${post.title} on the Sipiteno blog.`,
          url: `https://sipiteno.com/blog/${post.slug}`,
          datePublished: post.published_at || undefined,
          wordCount: post.word_count || undefined,
        })]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Blog", url: "https://sipiteno.com/blog" },
          { name: post.title, url: `https://sipiteno.com/blog/${post.slug}` }
        ]}
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all posts</span>
          </Link>

          {/* Article header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              {post.week_number && CATEGORY_LABELS[post.week_number] && (
                <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {CATEGORY_LABELS[post.week_number]}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Sipiteno Team</span>
              </div>
              
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime(post.word_count)}
              </span>
              
              {post.word_count && (
                <span className="text-muted-foreground/60">
                  {post.word_count.toLocaleString()} words
                </span>
              )}
            </div>
          </header>

          {/* Article content */}
          <div className="blog-content">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
                p: ({ node, children, ...props }) => {
                  const text = String(children);
                  if (text.includes("Have an idea for your industry?")) {
                    return <p className="cta-paragraph" {...props}>{children}</p>;
                  }
                  return <p {...props}>{children}</p>;
                },
              }}
            >
              {post.content.replace(/^#\s+.+\n+/, '')}
            </ReactMarkdown>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <nav className="mt-12 pt-8 border-t border-border" aria-label="Related posts">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Articles</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className="group p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {rp.title}
                    </h4>
                    {rp.published_at && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(rp.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Related Services */}
          <nav className="mt-12 pt-8 border-t border-border" aria-label="Related services">
            <h3 className="text-lg font-semibold text-foreground mb-4">Explore Our Services</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to="/services/ai-consulting"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-primary rotate-180" />
                </div>
                <div>
                  <span className="font-medium text-foreground text-sm">AI Consulting</span>
                  <p className="text-xs text-muted-foreground">Strategy, ML implementation, automation</p>
                </div>
              </Link>
              <Link
                to="/services/business-development"
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-primary rotate-180" />
                </div>
                <div>
                  <span className="font-medium text-foreground text-sm">Business Development B2B</span>
                  <p className="text-xs text-muted-foreground">Partnerships, lead gen, market entry</p>
                </div>
              </Link>
            </div>
          </nav>

          {/* Article footer CTA */}
          <footer className="mt-8 pt-8 border-t border-border">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Have an idea for your industry?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Let's build your product in 4 weeks. We turn ideas into shipped products with proven speed.
              </p>
              <Link
                to="/#contact"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start Your Project
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

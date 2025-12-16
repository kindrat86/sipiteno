import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

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
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Article footer CTA */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Have an idea for your industry?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Let's build your MVP in 4 weeks. We turn ideas into shipped products with proven speed.
              </p>
              <Link
                to="/#contact"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start Your MVP
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

/**
 * Converts markdown content to styled HTML
 * Handles: headings, bold, italic, lists, blockquotes, code, links
 */
function formatContent(content: string): string {
  let html = content;

  // Remove the title if it starts with # (we show it in header)
  html = html.replace(/^#\s+.+\n+/, '');

  // Convert code blocks (before other processing)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert blockquotes
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Convert headings (must be before paragraph processing)
  html = html.replace(/^###\s+(.+)$/gm, '</p><h3>$1</h3><p>');
  html = html.replace(/^##\s+(.+)$/gm, '</p><h2>$1</h2><p>');
  html = html.replace(/^#\s+(.+)$/gm, '</p><h1>$1</h1><p>');

  // Convert horizontal rules
  html = html.replace(/^---$/gm, '</p><hr /><p>');

  // Convert unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  
  // Convert ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Wrap consecutive list items in ul/ol
  html = html.replace(/(<li>[\s\S]*?<\/li>)\n(?=<li>)/g, '$1');
  html = html.replace(/(<li>[\s\S]*?<\/li>)(?!\n<li>)/g, '<ul>$1</ul>');
  
  // Fix nested ul tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Convert bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert double newlines to paragraph breaks
  html = html.replace(/\n\n+/g, '</p><p>');
  
  // Convert single newlines within paragraphs to spaces (for flow)
  html = html.replace(/([^>])\n([^<])/g, '$1 $2');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr)/g, '$1');
  html = html.replace(/(\/?>)\s*<\/p>/g, '$1');

  // Style the CTA paragraph (detect by content)
  html = html.replace(
    /<p>([^<]*Have an idea for your industry\?[^<]*Let's build your MVP[^<]*)<\/p>/gi,
    '<p class="cta-paragraph">$1</p>'
  );

  return html;
}

export default BlogPost;

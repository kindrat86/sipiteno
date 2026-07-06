import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Calendar, FileText, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BLOG_TOPICS, getCurrentDayInCycle } from "@/data/blogTopics";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface GeneratedPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  linkedin_summary?: string;
  internal_links?: Array<{ text: string; url: string }>;
  word_count: number;
}

const BlogGenerator = () => {
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDayInCycle());
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedTopic = BLOG_TOPICS.find(t => t.day === selectedDay);

  const handleGenerate = async (useCustom = false) => {
    setIsGenerating(true);
    setGeneratedPost(null);

    try {
      // Get current session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate blog posts",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-blog-post', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: useCustom && customTopic 
          ? { customTopic, generateMeta: true }
          : { topicDay: selectedDay, generateMeta: true }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Generation Failed",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      if (data?.post) {
        setGeneratedPost(data.post);
        toast({
          title: "Blog Post Generated",
          description: data.saved ? "Post saved to database" : "Post generated (not saved)",
        });
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate blog post",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-destructive">Access Denied</CardTitle>
                <CardDescription>Admin access required to use the blog generator.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/">
                  <Button variant="outline" className="w-full">Return Home</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const weekGroups = [1, 2, 3].map(week => ({
    week,
    theme: BLOG_TOPICS.find(t => t.week === week)?.weekTheme || "",
    topics: BLOG_TOPICS.filter(t => t.week === week)
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog Generator | Sipiteno Admin"
        description="Sipiteno admin blog generator."
        url="https://sipiteno.com/admin/blog-generator"
        noindex
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blog Content Generator</h1>
                <p className="text-muted-foreground">AI-powered content for Sipiteno MicroSaaS blog</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Topic Selector */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Topic Schedule
                    </CardTitle>
                    <CardDescription>15-day rotation cycle</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weekGroups.map(({ week, theme, topics }) => (
                      <div key={week}>
                        <h4 className="text-sm font-semibold text-primary mb-2">
                          Week {week}: {theme}
                        </h4>
                        <div className="space-y-1">
                          {topics.map((topic) => (
                            <button
                              key={topic.day}
                              onClick={() => setSelectedDay(topic.day)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                selectedDay === topic.day
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="font-medium">Day {topic.day}:</span>{" "}
                              <span className="text-xs opacity-80 line-clamp-1">
                                {topic.topic.substring(0, 40)}...
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Custom Topic */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Custom Topic</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Enter a custom blog topic..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={() => handleGenerate(true)}
                      disabled={!customTopic.trim() || isGenerating}
                      variant="outline"
                      className="w-full"
                    >
                      Generate Custom
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Generator & Output */}
              <div className="lg:col-span-2 space-y-4">
                {/* Selected Topic Card */}
                {selectedTopic && (
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedTopic.topic}</CardTitle>
                      <CardDescription>{selectedTopic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleGenerate(false)}
                        disabled={isGenerating}
                        className="w-full"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating (~30s)...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Blog Post
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Generated Content */}
                {generatedPost && (
                  <div className="space-y-4">
                    {/* Meta Assets */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Generated Assets
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4">
                          {/* Title & Slug */}
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Title</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                                {generatedPost.title}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(generatedPost.title, 'title')}
                              >
                                {copiedField === 'title' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          {/* Meta Description */}
                          {generatedPost.meta_description && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                Meta Description ({generatedPost.meta_description.length}/155)
                              </label>
                              <div className="flex items-start gap-2 mt-1">
                                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                                  {generatedPost.meta_description}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(generatedPost.meta_description!, 'meta')}
                                >
                                  {copiedField === 'meta' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* LinkedIn Summary */}
                          {generatedPost.linkedin_summary && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                LinkedIn Summary ({generatedPost.linkedin_summary.length}/280)
                              </label>
                              <div className="flex items-start gap-2 mt-1">
                                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                                  {generatedPost.linkedin_summary}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(generatedPost.linkedin_summary!, 'linkedin')}
                                >
                                  {copiedField === 'linkedin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Internal Links */}
                          {generatedPost.internal_links && generatedPost.internal_links.length > 0 && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Internal Link Suggestions</label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {generatedPost.internal_links.map((link, i) => (
                                  <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                    {link.text} → {link.url}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Word Count */}
                          <div className="text-xs text-muted-foreground">
                            Word count: {generatedPost.word_count} words
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Full Content */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Blog Content (Markdown)</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedPost.content, 'content')}
                          >
                            {copiedField === 'content' ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy All
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px] text-sm whitespace-pre-wrap">
                          {generatedPost.content}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogGenerator;

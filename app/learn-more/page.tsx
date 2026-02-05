"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Zap, 
  Clock, 
  PenTool,
  RefreshCw,
  Wand2,
  Target,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Globe,
  FileText,
  BarChart,
  MessageSquare,
  BookOpen,
  Video,
  Download,
  Share2,
  Lock,
  Copy,
  Layout,
  Calendar,
  TrendingUp,
  Bell,
  Users2,
  Rocket
} from "lucide-react";

export default function LearnMorePage() {
  const [activeTab, setActiveTab] = useState("multiplatform");
  const [activePlatform, setActivePlatform] = useState("all");

  const platforms = [
    { id: "instagram", name: "Instagram", icon: <Instagram className="h-5 w-5" />, color: "bg-gradient-to-r from-pink-500 to-purple-600" },
    { id: "twitter", name: "Twitter/X", icon: <Twitter className="h-5 w-5" />, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, color: "bg-gradient-to-r from-blue-600 to-blue-800" },
    { id: "facebook", name: "Facebook", icon: <Facebook className="h-5 w-5" />, color: "bg-gradient-to-r from-blue-500 to-blue-700" },
    { id: "youtube", name: "YouTube", icon: <Youtube className="h-5 w-5" />, color: "bg-gradient-to-r from-red-500 to-red-700" },
    { id: "blog", name: "Blog", icon: <Globe className="h-5 w-5" />, color: "bg-gradient-to-r from-green-500 to-green-700" },
  ];

  const timeSavingStats = [
    { 
      icon: <Clock className="h-8 w-8" />, 
      value: "10x", 
      label: "Faster Content Creation",
      description: "Generate content in minutes instead of hours"
    },
    { 
      icon: <Copy className="h-8 w-8" />, 
      value: "80%", 
      label: "Time Saved",
      description: "Cut content planning and writing time dramatically"
    },
    { 
      icon: <Calendar className="h-8 w-8" />, 
      value: "7 Days", 
      label: "Content in Advance",
      description: "Create a week's worth of content in one session"
    },
    { 
      icon: <TrendingUp className="h-8 w-8" />, 
      value: "3x", 
      label: "More Consistency",
      description: "Maintain regular posting across all platforms"
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "One Input, Multiple Outputs",
      description: "Start with a single topic or piece of content",
      features: [
        "Generate content for all platforms at once",
        "Automatically adapt format for each platform",
        "Maintain consistent messaging across channels"
      ],
      icon: <Layout className="h-10 w-10" />
    },
    {
      step: "02",
      title: "Platform Optimization",
      description: "AI optimizes content for each platform's requirements",
      features: [
        "Character limits and formatting",
        "Platform-specific hashtags",
        "Optimal posting times and formats"
      ],
      icon: <Target className="h-10 w-10" />
    },
    {
      step: "03",
      title: "Batch Scheduling",
      description: "Plan and schedule all content in one place",
      features: [
        "Create content calendars",
        "Set publishing schedules",
        "Automated cross-platform posting"
      ],
      icon: <Calendar className="h-10 w-10" />
    },
    {
      step: "04",
      title: "Analytics & Optimization",
      description: "Track performance and optimize future content",
      features: [
        "Cross-platform analytics",
        "Engagement tracking",
        "AI-powered improvement suggestions"
      ],
      icon: <BarChart className="h-10 w-10" />
    },
  ];

  const platformContentExamples = {
    instagram: [
      "Engaging captions with relevant hashtags",
      "Stories content with CTAs",
      "Reels scripts and descriptions",
      "Carousel post ideas"
    ],
    twitter: [
      "Tweet threads (up to 25 tweets)",
      "Trending topic commentary",
      "Engagement-driving questions",
      "Thread unrolling for longer content"
    ],
    linkedin: [
      "Professional articles and posts",
      "Industry insights and analysis",
      "Company updates and announcements",
      "Thought leadership content"
    ],
    blog: [
      "SEO-optimized blog posts",
      "Comprehensive guides and tutorials",
      "Product reviews and comparisons",
      "Industry trend analysis"
    ]
  };

  const useCases = [
    {
      title: "Social Media Managers",
      description: "Create and schedule a month's worth of content in one afternoon",
      icon: <Users2 className="h-6 w-6" />,
      features: [
        "30 days of content in 3 hours",
        "Consistent brand voice across platforms",
        "Trend-jacking content suggestions"
      ]
    },
    {
      title: "Content Creators",
      description: "Repurpose one video into 20+ pieces of content across platforms",
      icon: <Video className="h-6 w-6" />,
      features: [
        "YouTube video → Blog post → Social snippets",
        "Transcript optimization for different formats",
        "Hashtag and keyword optimization"
      ]
    },
    {
      title: "Marketing Teams",
      description: "Launch coordinated campaigns across all channels simultaneously",
      icon: <Rocket className="h-6 w-6" />,
      features: [
        "Unified campaign messaging",
        "Platform-specific adaptations",
        "Performance tracking across channels"
      ]
    },
    {
      title: "Small Businesses",
      description: "Maintain active presence on 5+ platforms with minimal time investment",
      icon: <Bell className="h-6 w-6" />,
      features: [
        "Daily posts across all platforms",
        "Localized content for different audiences",
        "Customer engagement templates"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Social Media Manager",
      company: "TechStart Inc",
      content: "I went from spending 20+ hours per week on content to just 3 hours. This platform is a game-changer for multi-platform management.",
      avatar: "SC",
      platforms: ["Instagram", "Twitter", "LinkedIn"]
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      company: "Digital Nomad",
      content: "Creating content for 6 platforms used to be overwhelming. Now I batch-create everything on Monday and schedule for the week.",
      avatar: "MJ",
      platforms: ["YouTube", "Instagram", "Twitter", "Blog"]
    },
    {
      name: "Lisa Rodriguez",
      role: "Marketing Director",
      company: "GrowthLab",
      content: "Our cross-platform engagement increased by 300% while cutting content creation time in half. ROI is incredible.",
      avatar: "LR",
      platforms: ["All Platforms"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section - Focus on Time Saving */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white border-0 hover:opacity-90">
                <Zap className="h-3 w-3 mr-2" />
                TIME-SAVING PLATFORM
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight">
                Create Once,{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Publish Everywhere
                </span>
              </h1>
              
              <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Generate content for <span className="font-semibold text-primary">Instagram, Twitter, LinkedIn, Blog, YouTube, and more</span> in one click. 
                Save 80% of your content creation time.
              </p>
              
              <div className="inline-flex flex-wrap justify-center gap-3 mb-10">
                {platforms.map((platform) => (
                  <Badge key={platform.id} variant="outline" className="px-4 py-2">
                    {platform.icon}
                    <span className="ml-2">{platform.name}</span>
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Sparkles className="h-4 w-4" />
                  Start Free Trial - Save 20 Hours/Week
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Video className="h-4 w-4" />
                  Watch 2-Min Demo
                </Button>
              </div>
            </div>
            
            {/* Time Saving Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
            >
              {timeSavingStats.map((stat, index) => (
                <Card key={index} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Multi-Platform Workflow */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Your Complete Multi-Platform Workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From idea to published content across all platforms in minutes, not days
            </p>
          </div>

          <div className="space-y-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 z-0" />
                )}
                <Card className="relative z-10 border-border/60 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                          {step.step}
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto">
                          {step.icon}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                          <Badge variant="outline" className="text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Saves 5+ hours
                          </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex -space-x-2 mb-4">
                            {platforms.slice(0, 4).map((platform) => (
                              <div 
                                key={platform.id}
                                className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white`}
                              >
                                {platform.icon}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            {index === 0 && "6 platforms supported"}
                            {index === 1 && "Platform-optimized"}
                            {index === 2 && "Batch scheduling"}
                            {index === 3 && "Cross-platform analytics"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Content Examples */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Platform-Specific Content Optimization
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI automatically adapts your content for each platform's best practices
            </p>
          </div>

          <Tabs value={activePlatform} onValueChange={setActivePlatform} className="max-w-6xl mx-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
              {platforms.map((platform) => (
                <TabsTrigger 
                  key={platform.id} 
                  value={platform.id}
                  className="flex flex-col items-center gap-2 py-3 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white`}>
                    {platform.icon}
                  </div>
                  <span>{platform.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="instagram" className="mt-0">
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Instagram Content Features</h3>
                      <ul className="space-y-4">
                        {platformContentExamples.instagram.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-lg p-6">
                      <h4 className="font-bold mb-4">Generated Example</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                          <p className="mb-2">🎨 Transform your ideas into visual stories that captivate your audience...</p>
                          <div className="flex flex-wrap gap-1">
                            {["#ContentCreation", "#SocialMediaTips", "#InstagramMarketing", "#AIContent"].map(tag => (
                              <span key={tag} className="text-xs text-blue-500">#{tag}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          AI automatically adds relevant hashtags, emojis, and CTAs optimized for Instagram engagement.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="twitter" className="mt-0">
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Twitter/X Content Features</h3>
                      <ul className="space-y-4">
                        {platformContentExamples.twitter.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-lg p-6">
                      <h4 className="font-bold mb-4">Generated Example</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                          <p>🚀 Just created a week's worth of content in 30 minutes!</p>
                          <p className="mt-2">Using AI to generate content for multiple platforms is a game-changer:</p>
                          <p className="mt-2">1️⃣ Saves 20+ hours per week</p>
                          <p>2️⃣ Consistent messaging across platforms</p>
                          <p>3️⃣ Higher engagement rates</p>
                          <p className="mt-2">#Productivity #AIContent #SocialMedia</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Threads, character optimization, and trending hashtags included.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Similar tabs for other platforms... */}
          </Tabs>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Who Benefits Most?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professionals who manage multiple platforms see the biggest time savings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-border/60 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Time Saved, Results Delivered
            </h2>
            <p className="text-xl text-muted-foreground">
              See how others are saving hours every week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex flex-wrap gap-2">
                    {testimonial.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mx-auto mb-8">
                <Clock className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Start Saving 20+ Hours Per Week
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 10,000+ creators and marketers who are already publishing consistently across all platforms with minimal effort.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-primary">20+</div>
                  <div className="text-sm">Hours saved weekly</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm">Platforms supported</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-primary">300%</div>
                  <div className="text-sm">Average engagement increase</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl text-lg py-6 px-8">
                  <Rocket className="h-5 w-5" />
                  Start Free Trial (Save 80+ Hours/Month)
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-lg py-6 px-8">
                  <Users className="h-5 w-5" />
                  Book Team Demo
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8">
                No credit card required • 10,000 free words monthly • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
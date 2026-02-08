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
  CheckCircle2,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
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
import { SiPeerlist } from "react-icons/si";
import { cn } from "@/lib/utils";

export default function LearnMorePage() {
  const [activeTab, setActiveTab] = useState("multiplatform");
  const [activePlatform, setActivePlatform] = useState("instagram");

  const platforms = [
    { id: "instagram", name: "Instagram", icon: <Instagram className="h-5 w-5" />, color: "bg-gradient-to-r from-pink-500 to-purple-600" },
    { id: "twitter", name: "Twitter/X", icon: <Twitter className="h-5 w-5" />, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, color: "bg-gradient-to-r from-blue-600 to-blue-800" },
    { id: "peerlist", name: "Peerlist", icon: <SiPeerlist className="h-5 w-5" />, color: "bg-gradient-to-r from-green-500 to-green-700" },
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
      "Professional articles and posts (1200–2000 characters)",
      "Industry insights and thought leadership",
      "Short paragraphs, end with 3 relevant hashtags",
      "Company updates and announcements"
    ],
    peerlist: [
      "Professional and concise posts (up to 2000 characters)",
      "Developer and tech community–friendly tone",
      "Profile and project highlights",
      "Clear, scannable formatting for recruiters and peers"
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-x-hidden">
      {/* Hero Section - Focus on Time Saving */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute top-10 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 px-0 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <Badge className="mb-4 sm:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-primary to-purple-600 text-white border-0 hover:opacity-90">
                <Zap className="h-3 w-3 mr-1.5 sm:mr-2" />
                TIME-SAVING PLATFORM
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 sm:mb-6 leading-tight px-1">
                Create Once,{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Publish Everywhere
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-0 sm:px-2">
                Generate content for <span className="font-semibold text-primary">Instagram, Twitter, LinkedIn, and Peerlist</span> in one click. 
                Save 80% of your content creation time.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-1">
                {platforms.map((platform) => (
                  <Badge key={platform.id} variant="outline" className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
                    {platform.icon}
                    <span className="ml-1.5 sm:ml-2">{platform.name}</span>
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-sm sm:text-base">
                  Start Free Trial - Save 20 Hours/Week
                </Button>
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                  <Video className="h-4 w-4 shrink-0" />
                  Watch 2-Min Demo
                </Button>
              </div>
            </div>
            
            {/* Time Saving Stats - Responsive & Professional */}
            <div className="mt-10 sm:mt-12 md:mt-16 px-2 sm:px-0">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
              >
                {timeSavingStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 * index }}
                  >
                    <Card className="h-full border border-border/80 bg-card/80 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-xl overflow-hidden">
                      <CardContent className="p-5 sm:p-6 lg:p-6 text-center flex flex-col items-center min-h-[200px] sm:min-h-[220px]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/10 shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-sm [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                            {stat.icon}
                          </div>
                        </div>
                        <p className="text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                          {stat.value}
                        </p>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 leading-tight">
                          {stat.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-snug max-w-[240px] mx-auto">
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Multi-Platform Workflow */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 px-2">
              Your Complete Multi-Platform Workflow
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              From idea to published content across all platforms in minutes, not days
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
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
                <Card className="relative z-10 border-border/60 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
                      <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-0 shrink-0 w-full lg:w-auto">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold shrink-0">
                          {step.step}
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center lg:mx-auto [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7 lg:[&>svg]:h-8 lg:[&>svg]:w-8">
                          {step.icon}
                        </div>
                      </div>
                      
                      <div className="grow min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <h3 className="text-xl sm:text-2xl font-bold">{step.title}</h3>
                          <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                            <Clock className="h-3 w-3 mr-1 shrink-0" />
                            Saves 5+ hours
                          </Badge>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">{step.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-xs sm:text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="shrink-0 w-full lg:w-auto">
                        <div className="bg-muted/50 rounded-lg p-3 sm:p-4 flex flex-row lg:flex-col items-center justify-center gap-3 lg:gap-4">
                          <div className="flex -space-x-2">
                            {platforms.slice(0, 4).map((platform) => (
                              <div
                                key={platform.id}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${platform.color} flex items-center justify-center text-white border-2 border-background [&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-4 sm:[&>svg]:w-4`}
                              >
                                {platform.icon}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground text-center">
                            {index === 0 && "4 platforms supported"}
                            {index === 1 && "Platform-optimized"}
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

      {/* Platform Content — Product-grade tab section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              One input, four outputs
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2 sm:mb-3 px-2">
              Optimized for each platform
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              See what PostGenius generates for each channel. One topic or draft → four ready-to-paste posts.
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-w-0">
            <Tabs value={activePlatform} onValueChange={setActivePlatform} className="w-full">
              {/* Product-style segmented control */}
              <TabsList className="w-full h-auto p-1 sm:p-1.5 md:p-2 bg-muted/50 border-b border-border rounded-none grid grid-cols-4 gap-0.5 sm:gap-1 min-w-0">
                {platforms.map((platform) => (
                  <TabsTrigger
                    key={platform.id}
                    value={platform.id}
                    className={cn(
                      "flex items-center justify-center gap-2 sm:gap-3 rounded-lg py-3 sm:py-3.5 px-3 sm:px-4 text-sm font-medium transition-all duration-200 cursor-pointer",
                      "text-muted-foreground hover:text-foreground hover:bg-background/80",
                      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border",
                      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    )}
                  >
                    <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${platform.color} flex items-center justify-center text-white shrink-0`}>
                      {platform.icon}
                    </span>
                    <span className="hidden sm:inline truncate">{platform.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content — consistent two-column layout */}
              <TabsContent value="instagram" className="mt-0 outline-none data-[state=inactive]:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border min-w-0">
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-10 h-10 rounded-lg bg-linear-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                        <Instagram className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Instagram</h3>
                        <p className="text-sm text-muted-foreground">Captions & Reels</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">What we optimize</p>
                    <ul className="space-y-3">
                      {platformContentExamples.instagram.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sample output</p>
                    <div className="rounded-lg sm:rounded-xl border border-border bg-background p-3 sm:p-4 md:p-5 border-l-4 border-l-pink-500 min-w-0">
                      <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                        Transform your ideas into visual stories that captivate your audience. Strong hook in the first 125 characters, friendly tone, and 5 relevant hashtags—ready to paste under your Reel or post.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["#ContentCreation", "#SocialMediaTips", "#AIContent"].map(tag => (
                          <span key={tag} className="text-xs font-medium text-pink-600 dark:text-pink-400">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Up to 2,200 characters · Copy from Generate page</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="twitter" className="mt-0 outline-none data-[state=inactive]:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border min-w-0">
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-10 h-10 rounded-lg bg-linear-to-r from-sky-400 to-blue-600 flex items-center justify-center text-white shrink-0">
                        <Twitter className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">X (Twitter)</h3>
                        <p className="text-sm text-muted-foreground">Posts & threads</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">What we optimize</p>
                    <ul className="space-y-3">
                      {platformContentExamples.twitter.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sample output</p>
                    <div className="rounded-lg sm:rounded-xl border border-border bg-background p-3 sm:p-4 md:p-5 border-l-4 border-l-blue-500 font-mono text-xs sm:text-sm min-w-0">
                      <p className="leading-relaxed">Just created a week's worth of content in 30 minutes. Using AI for multiple platforms is a game-changer: saves 20+ hrs/week, consistent messaging, higher engagement. #Productivity #AIContent</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Max 280 characters · Optional thread · Copy from Generate page</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="linkedin" className="mt-0 outline-none data-[state=inactive]:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border min-w-0">
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-10 h-10 rounded-lg bg-linear-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white shrink-0">
                        <Linkedin className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">LinkedIn</h3>
                        <p className="text-sm text-muted-foreground">Posts & articles</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">What we optimize</p>
                    <ul className="space-y-3">
                      {platformContentExamples.linkedin.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sample output</p>
                    <div className="rounded-lg sm:rounded-xl border border-border bg-background p-3 sm:p-4 md:p-5 border-l-4 border-l-blue-600 min-w-0">
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        PostGenius turns your topic or draft into a polished LinkedIn post: 1,200–2,000 characters, short paragraphs, professional tone, 3 hashtags. Choose tone and audience on the Generate page, then copy and paste. One click to copy.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Optimized for engagement on LinkedIn</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="peerlist" className="mt-0 outline-none data-[state=inactive]:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border min-w-0">
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-10 h-10 rounded-lg bg-linear-to-r from-emerald-500 to-green-700 flex items-center justify-center text-white shrink-0">
                        <SiPeerlist className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Peerlist</h3>
                        <p className="text-sm text-muted-foreground">Developer community</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">What we optimize</p>
                    <ul className="space-y-3">
                      {platformContentExamples.peerlist.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sample output</p>
                    <div className="rounded-lg sm:rounded-xl border border-border bg-background p-3 sm:p-4 md:p-5 border-l-4 border-l-emerald-600 min-w-0">
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        Professional, concise posts (up to 2,000 characters) for developers and tech professionals—clear, scannable, great for profile updates and project highlights. Same input as other platforms; pick Peerlist on results and copy.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">One input → four platforms. Copy the one you need.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4">
              Who Benefits Most?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Professionals who manage multiple platforms see the biggest time savings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-border/60 hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-3 sm:mb-4 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                    {useCase.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{useCase.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{useCase.description}</p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
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
     

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mx-auto mb-6 sm:mb-8 [&>svg]:h-8 [&>svg]:w-8 sm:[&>svg]:h-10 sm:[&>svg]:w-10 md:[&>svg]:h-12 md:[&>svg]:w-12 text-white">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 px-2">
                Start Saving 20+ Hours Per Week
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Join 10,000+ creators and marketers who are already publishing consistently across all platforms with minimal effort.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-xl sm:text-2xl font-bold text-primary">20+</div>
                  <div className="text-xs sm:text-sm">Hours saved weekly</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-xl sm:text-2xl font-bold text-primary">4</div>
                  <div className="text-xs sm:text-sm">Platforms supported</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow col-span-2 md:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-primary">300%</div>
                  <div className="text-xs sm:text-sm">Avg. engagement increase</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg py-5 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  Start Free Trial (Save 80+ Hours/Month)
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-sm sm:text-base md:text-lg py-5 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  Book Team Demo
                </Button>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8 px-2">
                No credit card required • 10,000 free words monthly • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
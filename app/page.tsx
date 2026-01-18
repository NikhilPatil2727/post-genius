import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered Content",
      description: "Generate high-quality, platform-optimized content in seconds."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Multi-Platform Support",
      description: "LinkedIn, X (Twitter), Instagram, Peerlist, and more."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Human-Like Quality",
      description: "Natural, engaging content that doesn't sound robotic."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Tone Customization",
      description: "Match your brand voice across all platforms."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Generate{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Media Content
          </span>
          {' '}That Actually Works
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Create platform-optimized content for LinkedIn, Twitter, Instagram, and more with AI.
          No more copying and pasting between platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/generate">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Generating
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SocialSync</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="pt-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Social Media?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of creators and marketers saving hours every week.
            </p>
            <Link href="/generate">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Generate Content Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
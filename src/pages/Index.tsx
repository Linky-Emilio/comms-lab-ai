import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Mic, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Play,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Analysis",
      description: "AI-powered analysis of your in-game communication patterns and frequency"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Coordination",
      description: "Measure speech overlap, turn-taking, and coordination effectiveness"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Track communication improvements over time with detailed analytics"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI Feedback",
      description: "Get personalized suggestions to improve clarity and strategic communication"
    }
  ];

  const benefits = [
    "Analyze words spoken and speaking volume",
    "Track strategic vocabulary usage",
    "Identify communication gaps",
    "Improve team coordination",
    "Get AI-powered coaching insights",
    "Professional coach feedback"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Gamepad2 className="h-12 w-12 text-primary" />
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EsportsCoach AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Communication
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered analysis of your in-game communication and behavior. 
              Get personalized feedback to improve teamwork, clarity, and strategic callouts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8"
                onClick={() => navigate('/register')}
              >
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 pt-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Play className="mr-2 h-4 w-4" />
                Audio & Video Support
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <TrendingUp className="mr-2 h-4 w-4" />
                Real-time Analysis
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Star className="mr-2 h-4 w-4" />
                Pro Coach Feedback
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Communication Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI technology that understands esports communication patterns
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 rounded-lg bg-primary/10 text-primary w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What You'll Improve
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI analyzes every aspect of your communication to help you become 
                a better teammate and leader in competitive gaming.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sample Analysis</CardTitle>
                <CardDescription>Real metrics from our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Words per session</span>
                    <Badge>1,250 words</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team coordination</span>
                    <Badge variant="secondary">78% score</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Strategic commands</span>
                    <Badge variant="outline">45 callouts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Communication gaps</span>
                    <Badge variant="destructive">12 instances</Badge>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  onClick={() => navigate('/register')}
                >
                  Get Your Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Level Up Your Communication?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players improving their teamwork and strategic communication
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-12"
            onClick={() => navigate('/register')}
          >
            Start Free Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

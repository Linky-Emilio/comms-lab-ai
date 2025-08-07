import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/ui/navigation';
import { 
  MessageSquare, 
  Bot, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Filter
} from 'lucide-react';
import { 
  mockCurrentUser, 
  getUserSessions, 
  getSessionFeedback,
  mockSessions,
  mockFeedback,
  mockUsers
} from '@/services/mockData';
import { format } from 'date-fns';

const Feedback = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  
  const userSessions = getUserSessions(mockCurrentUser.id);
  const allFeedback = userSessions.flatMap(session => 
    getSessionFeedback(session.id).map(feedback => ({
      ...feedback,
      session: session
    }))
  );

  const filteredFeedback = allFeedback.filter(feedback => {
    const categoryMatch = selectedCategory === 'all' || feedback.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || feedback.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const aiFeedback = filteredFeedback.filter(f => f.type === 'ai');
  const coachFeedback = filteredFeedback.filter(f => f.type === 'coach');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'teamwork': return <Target className="h-4 w-4" />;
      case 'strategy': return <Lightbulb className="h-4 w-4" />;
      case 'clarity': return <TrendingUp className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const FeedbackCard = ({ feedback, session }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {feedback.type === 'ai' ? (
              <Bot className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-accent" />
            )}
            <div>
              <CardTitle className="text-sm">
                {feedback.type === 'ai' ? 'AI Analysis' : 'Coach Feedback'}
              </CardTitle>
              <CardDescription className="text-xs">
                {session.fileName} • {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(feedback.priority)} className="text-xs">
              {feedback.priority}
            </Badge>
            <div className="flex items-center space-x-1">
              {getCategoryIcon(feedback.category)}
              <span className="text-xs text-muted-foreground capitalize">
                {feedback.category}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{feedback.content}</p>
        {feedback.createdBy && (
          <p className="text-xs text-muted-foreground mt-2">
            By: {mockUsers.find(u => u.id === feedback.createdBy)?.username || 'Coach'}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Feedback & Coaching
            </h1>
            <p className="text-muted-foreground mt-1">
              Personalized insights to improve your communication skills
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredFeedback.length} insights
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{aiFeedback.length}</p>
                  <p className="text-xs text-muted-foreground">AI Insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{coachFeedback.length}</p>
                  <p className="text-xs text-muted-foreground">Coach Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredFeedback.filter(f => f.priority === 'high').length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredFeedback.filter(f => f.priority === 'low').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Improvements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'communication', 'teamwork', 'strategy', 'clarity'].map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'high', 'medium', 'low'].map(priority => (
                    <Button
                      key={priority}
                      variant={selectedPriority === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPriority(priority)}
                      className="capitalize"
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
            <TabsTrigger value="coach">Coach Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredFeedback.length > 0 ? (
              <div className="space-y-4">
                {filteredFeedback
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((feedback) => (
                    <FeedbackCard 
                      key={feedback.id} 
                      feedback={feedback} 
                      session={feedback.session}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No feedback found with current filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedPriority('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {aiFeedback.length > 0 ? (
              <div className="space-y-4">
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertDescription>
                    AI insights are generated automatically from your session analysis. 
                    These suggestions focus on measurable communication patterns.
                  </AlertDescription>
                </Alert>
                {aiFeedback
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((feedback) => (
                    <FeedbackCard 
                      key={feedback.id} 
                      feedback={feedback} 
                      session={feedback.session}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No AI insights available yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a session to get AI-powered feedback
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="coach" className="space-y-4">
            {coachFeedback.length > 0 ? (
              <div className="space-y-4">
                <Alert>
                  <User className="h-4 w-4" />
                  <AlertDescription>
                    Coach feedback provides personalized insights from professional esports coaches
                    based on your specific gameplay patterns and team dynamics.
                  </AlertDescription>
                </Alert>
                {coachFeedback
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((feedback) => (
                    <FeedbackCard 
                      key={feedback.id} 
                      feedback={feedback} 
                      session={feedback.session}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No coach feedback yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Coaches will review your sessions and provide personalized feedback
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Feedback;
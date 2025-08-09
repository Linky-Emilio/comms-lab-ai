import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/ui/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { getAnalysisData, AnalysisData } from '@/services/api';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';

const Feedback = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAnalysis, setShowAllAnalysis] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        // Usar el ID del usuario autenticado de Discord
        const data = await getAnalysisData(user.id);
        setAnalysisData(data);
      } catch (err) {
        setError('Failed to fetch analysis data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAuthenticated, navigate, isLoading]);

  const allFeedback = analysisData.map(analysis => ({
    id: analysis.analysis_id || analysis.id!,
    type: 'ai', // Assuming all analysis from this source is AI
    content: analysis.analysis_text || 'No summary available.',
    priority: 'medium', // Assigning a default priority
    category: 'communication', // Assigning a default category
    createdAt: analysis.timestamp ? new Date(analysis.timestamp) : new Date(),
    session: {
      id: analysis.id!,
      fileName: analysis.game ? `${analysis.game} Session` : `Session Analysis`,
      // Add other session details if needed
    }
  })).filter(feedback => {
    const categoryMatch = selectedCategory === 'all' || feedback.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || feedback.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const aiFeedback = allFeedback; // All feedback is from AI for now
  const coachFeedback: typeof allFeedback = []; // No coach feedback from this API

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "h-5 w-5";
    switch (category) {
      case 'communication': return <MessageSquare className={iconClass} />;
      case 'teamwork': return <Target className={iconClass} />;
      case 'strategy': return <Lightbulb className={iconClass} />;
      case 'clarity': return <TrendingUp className={iconClass} />;
      default: return <MessageSquare className={iconClass} />;
    }
  };

  // Global loading (auth or page data)
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your feedback...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Alert variant="destructive" className="max-w-md glass">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  const FeedbackCard = ({ feedback, session }: any) => (
    <Card className="glass hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-primary">
              {feedback.type === 'ai' ? (
                <Bot className="h-6 w-6 text-white" />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {feedback.type === 'ai' ? 'AI Analysis' : 'Coach Feedback'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {session.fileName} • {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1 text-xs">
             <Badge variant={getPriorityColor(feedback.priority)} className="capitalize">
              {feedback.priority} Priority
            </Badge>
            <div className="flex items-center space-x-1.5 pt-1">
              {getCategoryIcon(feedback.category)}
              <span className="text-muted-foreground capitalize">
                {feedback.category}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90">{feedback.content}</p>
      </CardContent>
    </Card>
  );

  // Helper para obtener la URL de audio
  const getAudioUrl = (audio: string | { S: string } | undefined) => {
    if (!audio) return undefined;
    if (typeof audio === 'string') return audio;
    if ('S' in audio) return audio.S;
    return undefined;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Feedback & Insights
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Actionable recommendations from AI and human coaches to elevate your gameplay.
          </p>
        </div>

        {/* Filters */}
        <Card className="glass">
          <CardContent className="p-4 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Filter by:</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Select onValueChange={setSelectedCategory} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="teamwork">Teamwork</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="clarity">Clarity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Select onValueChange={setSelectedPriority} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Tabs */}
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" /> AI Feedback ({aiFeedback.length})
            </TabsTrigger>
            <TabsTrigger value="coach">
              <User className="mr-2 h-4 w-4" /> Coach Feedback ({coachFeedback.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="mt-6">
            {aiFeedback.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {aiFeedback.map(feedback => (
                  <FeedbackCard key={feedback.id} feedback={feedback} session={feedback.session} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-lg">
                <p className="text-muted-foreground">No AI feedback matches your filters.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="coach" className="mt-6">
            {coachFeedback.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {coachFeedback.map(feedback => (
                  <FeedbackCard key={feedback.id} feedback={feedback} session={feedback.session} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-lg">
                <p className="text-muted-foreground">No coach feedback available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Analysis Details Section */}
        <div>
          <div className="text-center mt-12 mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Detailed Session Analysis
            </h2>
            <p className="text-muted-foreground mt-1">
              A breakdown of your recent gameplay sessions.
            </p>
          </div>

          {analysisData.length > 0 ? (
            <div className="space-y-6">
              {(showAllAnalysis ? analysisData : analysisData.slice(0, 2)).map((analysis, index) => (
                <Card key={index} className="glass overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gradient-primary">
                        {analysis.game ? `${analysis.game} Session` : `Session from ${format(new Date(analysis.timestamp!), 'PPp')}`}
                      </CardTitle>
                      <Badge variant="outline">{format(new Date(analysis.timestamp!), 'MMM dd, yyyy')}</Badge>
                    </div>
                    <CardDescription>
                      Game: {analysis.game || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.analysis_text && (
                      <Alert className="glass">
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI Summary:</strong> {analysis.analysis_text}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 glass rounded-lg">
                        <p className="text-2xl font-bold text-primary">{analysis.wpm || '0'}</p>
                        <p className="text-sm text-muted-foreground">Words Per Minute</p>
                      </div>
                      <div className="p-4 glass rounded-lg">
                        <p className="text-2xl font-bold text-primary">N/A</p>
                        <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                      </div>
                      <div className="p-4 glass rounded-lg">
                        <p className="text-2xl font-bold text-primary">N/A</p>
                        <p className="text-sm text-muted-foreground">Total Words</p>
                      </div>
                      <div className="p-4 glass rounded-lg">
                        <p className="text-2xl font-bold text-primary">N/A</p>
                        <p className="text-sm text-muted-foreground">Talk-Listen Ratio</p>
                      </div>
                    </div>
                    {getAudioUrl(analysis.audio_url) && (
                      <div className="pt-2">
                        <p className="text-sm font-semibold mb-2 text-foreground">Session Recording</p>
                        <AudioPlayer audioUrl={getAudioUrl(analysis.audio_url)!} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {analysisData.length > 2 && (
                <div className="text-center">
                  <Button variant="soft" onClick={() => setShowAllAnalysis(!showAllAnalysis)}>
                    {showAllAnalysis ? 'Show Less' : 'Show All Analyses'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-lg">
              <p className="text-muted-foreground">No detailed analysis available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Upload a session to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feedback;
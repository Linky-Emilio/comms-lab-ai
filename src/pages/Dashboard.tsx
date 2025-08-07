import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/MetricCard';
import Navigation from '@/components/ui/navigation';
import { 
  Mic, 
  Volume2, 
  MessageSquare, 
  Clock, 
  Users, 
  TrendingUp,
  Upload,
  Play,
  Calendar
} from 'lucide-react';
import { 
  mockCurrentUser, 
  getUserSessions, 
  getUserMetrics,
  getSessionFeedback 
} from '@/services/mockData';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userSessions = getUserSessions(mockCurrentUser.id);
  const userMetrics = getUserMetrics(mockCurrentUser.id);
  
  // Calculate average metrics
  const avgMetrics = userMetrics.reduce((acc, curr) => ({
    wordsSpoken: acc.wordsSpoken + curr.wordsSpoken,
    averageVolume: acc.averageVolume + curr.averageVolume,
    commandsGiven: acc.commandsGiven + curr.commandsGiven,
    teamCoordination: acc.teamCoordination + curr.teamCoordination,
    strategicVocab: acc.strategicVocab + curr.strategicVocabUsed,
    communicationGaps: acc.communicationGaps + curr.communicationGaps
  }), {
    wordsSpoken: 0,
    averageVolume: 0,
    commandsGiven: 0,
    teamCoordination: 0,
    strategicVocab: 0,
    communicationGaps: 0
  });

  const sessionsCount = userSessions.length;
  if (sessionsCount > 0) {
    avgMetrics.wordsSpoken = Math.round(avgMetrics.wordsSpoken / sessionsCount);
    avgMetrics.averageVolume = Math.round(avgMetrics.averageVolume / sessionsCount);
    avgMetrics.commandsGiven = Math.round(avgMetrics.commandsGiven / sessionsCount);
    avgMetrics.teamCoordination = Math.round(avgMetrics.teamCoordination / sessionsCount);
    avgMetrics.strategicVocab = Math.round(avgMetrics.strategicVocab / sessionsCount);
    avgMetrics.communicationGaps = Math.round(avgMetrics.communicationGaps / sessionsCount);
  }

  const recentSessions = userSessions
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 3);

  const totalFeedback = userSessions.reduce((acc, session) => {
    return acc + getSessionFeedback(session.id).length;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome back, {mockCurrentUser.username}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your communication performance overview
            </p>
          </div>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sessions"
            value={sessionsCount}
            icon={<Play className="h-4 w-4" />}
            description="Gameplay sessions analyzed"
            variant="default"
          />
          <MetricCard
            title="Avg Words/Session"
            value={avgMetrics.wordsSpoken}
            change={12}
            icon={<Mic className="h-4 w-4" />}
            description="Communication frequency"
            variant="success"
          />
          <MetricCard
            title="Team Coordination"
            value={`${avgMetrics.teamCoordination}%`}
            change={8}
            icon={<Users className="h-4 w-4" />}
            description="Overall coordination score"
            variant="success"
          />
          <MetricCard
            title="AI Insights"
            value={totalFeedback}
            icon={<MessageSquare className="h-4 w-4" />}
            description="Feedback recommendations"
            variant="default"
          />
        </div>

        {/* Communication Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Communication Breakdown</span>
              </CardTitle>
              <CardDescription>
                Your latest session performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Commands Given"
                  value={avgMetrics.commandsGiven}
                  icon={<MessageSquare className="h-4 w-4" />}
                />
                <MetricCard
                  title="Average Volume"
                  value={`${avgMetrics.averageVolume}%`}
                  icon={<Volume2 className="h-4 w-4" />}
                />
                <MetricCard
                  title="Strategic Terms"
                  value={avgMetrics.strategicVocab}
                  change={15}
                  icon={<Mic className="h-4 w-4" />}
                  variant="success"
                />
                <MetricCard
                  title="Communication Gaps"
                  value={avgMetrics.communicationGaps}
                  change={-23}
                  icon={<Clock className="h-4 w-4" />}
                  variant="success"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Your latest analyzed gameplay sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        {session.fileType === 'video' ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          <Mic className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{session.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.gameMode} • {Math.round(session.duration / 60)}min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={session.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {session.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(session.uploadDate), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                ))}
                
                {recentSessions.length === 0 && (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No sessions yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/upload')}
                    >
                      Upload your first session
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with analyzing your gameplay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col space-y-2"
                onClick={() => navigate('/upload')}
              >
                <Upload className="h-6 w-6" />
                <span>Upload Session</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col space-y-2"
                onClick={() => navigate('/feedback')}
              >
                <MessageSquare className="h-6 w-6" />
                <span>View Feedback</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col space-y-2"
                onClick={() => navigate('/metrics')}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
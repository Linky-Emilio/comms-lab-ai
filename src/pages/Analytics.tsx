import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/ui/navigation';
import MetricCard from '@/components/MetricCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Mic, 
  Volume2, 
  MessageSquare, 
  Users, 
  Clock,
  Target,
  Calendar
} from 'lucide-react';
import { 
  mockCurrentUser, 
  getUserSessions, 
  getUserMetrics
} from '@/services/mockData';
import { format, subDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Analytics = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [user, isAuthenticated, navigate, isLoading]);

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Preparing analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const userSessions = getUserSessions(mockCurrentUser.id);
  const userMetrics = getUserMetrics(mockCurrentUser.id);

  // Prepare chart data
  const sessionsOverTime = userSessions.map((session, index) => {
    const metrics = userMetrics.find(m => m.sessionId === session.id);
    return {
      date: format(new Date(session.uploadDate), 'MMM dd'),
      session: index + 1,
      wordsSpoken: metrics?.wordsSpoken || 0,
      teamCoordination: metrics?.teamCoordination || 0,
      commandsGiven: metrics?.commandsGiven || 0,
      averageVolume: metrics?.averageVolume || 0,
      communicationGaps: metrics?.communicationGaps || 0
    };
  });

  const communicationBreakdown = [
    { name: 'Strategic Calls', value: 35, color: 'hsl(217, 91%, 60%)' },
    { name: 'General Comms', value: 40, color: 'hsl(280, 100%, 70%)' },
    { name: 'Tactical Updates', value: 15, color: 'hsl(142, 76%, 36%)' },
    { name: 'Team Coordination', value: 10, color: 'hsl(38, 92%, 50%)' }
  ];

  const radarData = [
    { subject: 'Communication Frequency', value: 78, fullMark: 100 },
    { subject: 'Team Coordination', value: 85, fullMark: 100 },
    { subject: 'Strategic Vocabulary', value: 72, fullMark: 100 },
    { subject: 'Voice Clarity', value: 88, fullMark: 100 },
    { subject: 'Response Time', value: 75, fullMark: 100 },
    { subject: 'Leadership', value: 68, fullMark: 100 }
  ];

  const averageMetrics = userMetrics.reduce((acc, curr) => ({
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
    Object.keys(averageMetrics).forEach(key => {
      averageMetrics[key as keyof typeof averageMetrics] = Math.round(
        averageMetrics[key as keyof typeof averageMetrics] / sessionsCount
      );
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6 pt-24 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Communication Analytics
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Deep insights into your gameplay communication patterns. Track your progress and identify areas for improvement.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Avg Words/Session"
            value={averageMetrics.wordsSpoken}
            change={12}
            icon={<Mic className="h-6 w-6" />}
            variant="success"
          />
          <MetricCard
            title="Team Coordination"
            value={`${averageMetrics.teamCoordination}%`}
            change={8}
            icon={<Users className="h-6 w-6" />}
            variant="success"
          />
          <MetricCard
            title="Commands Given"
            value={averageMetrics.commandsGiven}
            change={-5}
            icon={<MessageSquare className="h-6 w-6" />}
            variant="default"
          />
          <MetricCard
            title="Communication Gaps"
            value={averageMetrics.communicationGaps}
            change={-15}
            icon={<Clock className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="trends">
              <TrendingUp className="mr-2 h-4 w-4" /> Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <PieChart className="mr-2 h-4 w-4" /> Breakdown
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Target className="mr-2 h-4 w-4" /> Performance
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <Users className="mr-2 h-4 w-4" /> Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Communication Over Time</CardTitle>
                  <CardDescription>
                    Words spoken per session trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sessionsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted) / 0.5)" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))' 
                        }}
                      />
                      <Line type="monotone" dataKey="wordsSpoken" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Team Coordination Trend</CardTitle>
                  <CardDescription>
                    Coordination score improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sessionsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="teamCoordination" 
                        stroke="hsl(280, 100%, 70%)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Session Metrics Comparison</CardTitle>
                <CardDescription>
                  Commands given vs communication gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sessionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted) / 0.5)" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                    />
                    <Bar dataKey="commandsGiven" fill="hsl(var(--primary))" name="Commands Given" />
                    <Bar dataKey="communicationGaps" fill="hsl(0, 84%, 60%)" name="Communication Gaps" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Communication Type Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of different communication categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={communicationBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {communicationBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Voice Quality Metrics</CardTitle>
                  <CardDescription>
                    Volume and clarity analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetricCard
                    title="Average Volume"
                    value={`${averageMetrics.averageVolume}%`}
                    description="Optimal range: 70-85%"
                    icon={<Volume2 className="h-4 w-4" />}
                    variant={averageMetrics.averageVolume >= 70 ? 'success' : 'warning'}
                  />
                  <MetricCard
                    title="Strategic Vocabulary"
                    value={averageMetrics.strategicVocab}
                    description="Per session average"
                    icon={<Target className="h-4 w-4" />}
                    change={18}
                    variant="success"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Overall Performance Radar</CardTitle>
                <CardDescription>
                  A holistic view of your communication skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--muted) / 0.5)" />
                    <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                    <Radar name="Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.6)" fillOpacity={0.6} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Coming Soon: Community Comparison</CardTitle>
                <CardDescription>
                  Compare your stats with other players of similar skill levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-16">
                <p className="text-muted-foreground">This feature is under development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
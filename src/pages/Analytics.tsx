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

const Analytics = () => {
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
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Communication Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Deep insights into your gameplay communication patterns
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {sessionsCount} Sessions Analyzed
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Avg Words/Session"
            value={averageMetrics.wordsSpoken}
            change={12}
            icon={<Mic className="h-4 w-4" />}
            variant="success"
          />
          <MetricCard
            title="Team Coordination"
            value={`${averageMetrics.teamCoordination}%`}
            change={8}
            icon={<Users className="h-4 w-4" />}
            variant="success"
          />
          <MetricCard
            title="Commands Given"
            value={averageMetrics.commandsGiven}
            change={-5}
            icon={<MessageSquare className="h-4 w-4" />}
            variant="default"
          />
          <MetricCard
            title="Communication Gaps"
            value={averageMetrics.communicationGaps}
            change={-15}
            icon={<Clock className="h-4 w-4" />}
            variant="success"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Over Time</CardTitle>
                  <CardDescription>
                    Words spoken per session trend
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
                        dataKey="wordsSpoken" 
                        stroke="hsl(217, 91%, 60%)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Coordination Progress</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Session Metrics Comparison</CardTitle>
                <CardDescription>
                  Commands given vs communication gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sessionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="commandsGiven" fill="hsl(217, 91%, 60%)" name="Commands Given" />
                    <Bar dataKey="communicationGaps" fill="hsl(0, 84%, 60%)" name="Communication Gaps" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Type Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of your communication patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={communicationBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {communicationBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {communicationBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>
                  Overall communication skill assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(217, 91%, 60%)"
                      fill="hsl(217, 91%, 60%)"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Voice clarity (88%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Team coordination (85%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Communication frequency (78%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Areas to Improve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-sm">Leadership skills (68%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-sm">Strategic vocabulary (72%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-sm">Response time (75%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">Increase callouts by 20%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">Reduce silence gaps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">Improve strategic vocabulary</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Benchmark Comparison</CardTitle>
                <CardDescription>
                  How you compare to similar skill level players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Words per session</span>
                      <span className="text-sm text-muted-foreground">+12% above average</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Team coordination</span>
                      <span className="text-sm text-muted-foreground">+8% above average</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Strategic vocabulary</span>
                      <span className="text-sm text-muted-foreground">-5% below average</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response time</span>
                      <span className="text-sm text-muted-foreground">+15% above average</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
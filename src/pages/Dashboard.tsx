import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/MetricCard';
import Navigation from '@/components/ui/navigation';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Volume2, 
  MessageSquare, 
  Clock, 
  Users, 
  TrendingUp,
  Upload,
  Play,
  Calendar,
  MoreVertical,
  CheckCircle,
  BarChart2,
  Target,
  GitCommit,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  mockCurrentUser, 
  getUserSessions, 
  getUserMetrics,
  getSessionFeedback,
  tasksToDo,
  mockUsers
} from '@/services/mockData';
import { getAnalysisData, AnalysisData } from '@/services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AudioPlayer from '@/components/AudioPlayer';
import { formatTime } from '@/lib/utils';

const getTaskIcon = (iconName: string) => {
  switch (iconName) {
    case 'volume-2':
      return <Volume2 className="h-4 w-4 text-primary" />;
    case 'bar-chart-2':
      return <BarChart2 className="h-4 w-4 text-primary" />;
    case 'target':
      return <Target className="h-4 w-4 text-primary" />;
    case 'git-commit':
      return <GitCommit className="h-4 w-4 text-primary" />;
    default:
      return null;
  }
};

const getUrgencyVariant = (urgency: string): "destructive" | "secondary" | "outline" => {
  switch (urgency) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'outline';
    default:
      return 'secondary';
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessionFilter, setSessionFilter] = useState('All');
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const { user, isAuthenticated, isLoading } = useAuth();
  const [durations, setDurations] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        // Usar el ID del usuario autenticado de Discord
        console.log('Fetching data for user ID:', user.id);
        console.log('Full user object:', user);
        const data = await getAnalysisData(user.id);
        setAnalysisData(data);
      } catch (err) {
        setError('Failed to fetch analysis data. Please try again later.');
        console.error('API Error:', err);
        console.error('User ID that failed:', user.id);
      } finally {        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, navigate, isLoading]);

  const handleDurationChange = (analysisId: string, duration: number) => {
    setDurations(prev => ({ ...prev, [analysisId]: duration }));
  };

  const recentCoachAnalyses = analysisData
    .filter(a => a.analysis_id && a.user_id)
    .slice(0, 4);

  const allUserSessions = getUserSessions(mockCurrentUser.id);

  const filteredSessions = allUserSessions.filter(session => 
    sessionFilter === 'All' || session.gameMode === sessionFilter
  );

  const userMetrics = getUserMetrics(mockCurrentUser.id);
  
  const latestWPM = analysisData.length > 0 ? analysisData[0].wmp : 0;
  let wpmChange = 0;
  if (analysisData.length > 1) {
    const lastWPM = analysisData[0].wmp || 0;
    const secondToLastWPM = analysisData[1].wmp || 0;
    if (secondToLastWPM > 0) {
      wpmChange = Math.round(((lastWPM - secondToLastWPM) / secondToLastWPM) * 100);
    } else if (lastWPM > 0) {
      wpmChange = 100; // Handle case where previous was 0
    }
  }

  // Calculate average metrics
  const avgMetrics = allUserSessions.reduce((acc, curr) => {
    const metrics = userMetrics.find(m => m.sessionId === curr.id);
    if (!metrics) return acc;
    return {
      wordsSpoken: acc.wordsSpoken + metrics.wordsSpoken,
      averageVolume: acc.averageVolume + metrics.averageVolume,
      commandsGiven: acc.commandsGiven + metrics.commandsGiven,
      teamCoordination: acc.teamCoordination + metrics.teamCoordination,
      strategicVocab: acc.strategicVocab + metrics.strategicVocabUsed,
      communicationGaps: acc.communicationGaps + metrics.communicationGaps,
      toxicityScore: acc.toxicityScore + (metrics.toxicityScore || 0)
    }
  }, {
    wordsSpoken: 0,
    averageVolume: 0,
    commandsGiven: 0,
    teamCoordination: 0,
    strategicVocab: 0,
    communicationGaps: 0,
    toxicityScore: 0
  });

  const sessionsCount = allUserSessions.length;
  if (sessionsCount > 0) {
    avgMetrics.wordsSpoken = Math.round(avgMetrics.wordsSpoken / sessionsCount);
    avgMetrics.averageVolume = Math.round(avgMetrics.averageVolume / sessionsCount);
    avgMetrics.commandsGiven = Math.round(avgMetrics.commandsGiven / sessionsCount);
    avgMetrics.teamCoordination = Math.round(avgMetrics.teamCoordination / sessionsCount);
    avgMetrics.strategicVocab = Math.round(avgMetrics.strategicVocab / sessionsCount);
    avgMetrics.communicationGaps = Math.round(avgMetrics.communicationGaps / sessionsCount);
    avgMetrics.toxicityScore = Math.round(avgMetrics.toxicityScore / sessionsCount);
  }

  const chartData = analysisData
    .slice(0, 7) // Take the last 7 sessions
    .map(analysis => ({
      date: format(new Date(analysis.timestamp!), 'MMM dd'),
      wmp: analysis.wmp || 0,
    }))
    .reverse(); // To show oldest to newest

  const latestSession = filteredSessions.length > 0 ? filteredSessions.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0] : null;
  const latestSessionMetrics = latestSession ? userMetrics.find(m => m.sessionId === latestSession.id) : null;
  
  const longestPhrases = [
    { id: 1, phrase: "I think we should probably try to push through the mid-lane together as a team.", suggestion: "Push mid together." },
    { id: 2, phrase: "Can someone please check if the enemy team is doing the main objective?", suggestion: "Check objective." },
    { id: 3, phrase: "I'm seeing one of them on the top side of the map, near our tower.", suggestion: "One top." }
  ];

  const playerActivityData = latestSessionMetrics && latestSessionMetrics.playerMetrics
  ? latestSessionMetrics.playerMetrics.map(playerMetric => {
      const player = mockUsers.find(u => u.id === playerMetric.playerId);
      return {
        name: player ? player.username : 'Unknown',
        value: playerMetric.wordsSpoken,
      };
    })
  : [];

  const volumeData = latestSessionMetrics?.volumeBreakdown 
    ? [
        { name: 'High', value: latestSessionMetrics.volumeBreakdown.high },
        { name: 'Medium', value: latestSessionMetrics.volumeBreakdown.medium },
        { name: 'Low', value: latestSessionMetrics.volumeBreakdown.low }
      ] 
    : [];
  
  const coordinationScore = latestSessionMetrics?.teamCoordination || 0;
  const coordinationData = [
    { name: 'Score', value: coordinationScore },
    { name: 'Remaining', value: 100 - coordinationScore }
  ];
  const COLORS = ['#00C49F', 'rgba(255, 255, 255, 0.1)'];
  const VOLUME_COLORS = ['#3b82f6', '#22c55e', '#ef4444']; // Blue, Green, Red for Low, Medium, High


  const recentSessions = allUserSessions
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 3);

  const totalFeedback = allUserSessions.reduce((acc, session) => {
    return acc + getSessionFeedback(session.id).length;
  }, 0);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient-primary">
              Welcome back, {user?.username || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your communication performance overview
            </p>
          </div>
          <Button 
            onClick={() => navigate('/upload')}
            className="gradient-primary text-primary-foreground shadow-md hover:opacity-95"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Toxicity Level"
            value={`${avgMetrics.toxicityScore}%`}
            icon={<ShieldAlert className="h-4 w-4" />}
            description="Avg. toxicity score"
            variant="destructive"
          />
          <MetricCard
            title="Avg Words/Session"
            value={latestWPM || 0}
            change={wpmChange}
            icon={<Mic className="h-4 w-4" />}
            description="vs. previous session"
            variant={wpmChange >= 0 ? "success" : "destructive"}
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

        {/* Communication Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Communication Trends</CardTitle>
              <CardDescription>Your performance over the last sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWordsSpoken" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTeamCoordination" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" />
                  <YAxis yAxisId="left" stroke="rgba(255, 255, 255, 0.5)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 30, 30, 0.8)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)' 
                    }} 
                  />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Area yAxisId="left" type="monotone" dataKey="wpm" name="Words Per Minute" stroke="#8884d8" fillOpacity={1} fill="url(#colorWordsSpoken)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Coach Feedback</CardTitle>
                  <CardDescription>
                    Your latest analyzed gameplay sessions
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCoachAnalyses.map((analysis) => (
                  <div 
                    key={analysis.analysis_id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <AudioPlayer
                        userId={analysis.user_id!}
                        analysisId={analysis.analysis_id!}
                        audioType="coach"
                        showPlayer={false}
                        onDurationChange={(duration) => handleDurationChange(analysis.analysis_id!, duration)}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          Coach Analysis - '{analysis.user_preferences?.M?.elevenlabs_voice?.S || 'Default Voice'}'
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.coach_type || 'Standard'} • {formatTime(durations[analysis.analysis_id!] || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {analysis.timestamp ? format(new Date(analysis.timestamp), 'MMM dd') : ''}
                      </span>
                    </div>
                  </div>
                ))}
                
                {recentCoachAnalyses.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No coach audio found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/upload')}
                    >
                      Upload a session to get feedback
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Volume Analysis</CardTitle>
                  <CardDescription>Latest session volume breakdown</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {volumeData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-medium text-muted-foreground">{item.name} Volume</span>
                    <span className="text-xl font-bold text-white">{item.value}%</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${item.value}%`, 
                        backgroundColor: VOLUME_COLORS[index % VOLUME_COLORS.length] 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Player Activity</CardTitle>
                  <CardDescription>Words spoken in the latest session</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant={sessionFilter === 'All' ? 'default' : 'outline'} onClick={() => setSessionFilter('All')}>All</Button>
                  <Button size="sm" variant={sessionFilter === 'Scrimmage' ? 'default' : 'outline'} onClick={() => setSessionFilter('Scrimmage')}>Scrim</Button>
                  <Button size="sm" variant={sessionFilter === 'Competitive' ? 'default' : 'outline'} onClick={() => setSessionFilter('Competitive')}>Competitive</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={playerActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" />
                      <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 30, 30, 0.8)', 
                          borderColor: 'rgba(255, 255, 255, 0.2)' 
                        }} 
                      />
                      <Bar dataKey="value" name="Words Spoken" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tasks to do */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tasks to do</CardTitle>
                <CardDescription className="flex items-center text-green-400 pt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{tasksToDo.filter(t => t.completion === 100).length} done this month</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-xs text-muted-foreground font-bold uppercase px-4 py-2">
                <div className="col-span-5">TAREA POR HACER</div>
                <div className="col-span-3">PLAYERS</div>
                <div className="col-span-2">NIVEL DE URGENCIA</div>
                <div className="col-span-2">COMPLETION</div>
              </div>
              {/* Rows */}
              {tasksToDo.map(task => (
                <div key={task.id} className="grid grid-cols-12 gap-4 items-center border-t border-border px-4 py-3">
                  <div className="col-span-5 flex items-center">
                    <div className="p-2 bg-primary/10 rounded-md mr-3">
                      {getTaskIcon(task.icon)}
                    </div>
                    <span className="font-medium">{task.name}</span>
                  </div>
                  <div className="col-span-3 flex -space-x-2">
                    {task.players.map(player => (
                      <img key={player.id} src={player.avatar} alt="player" className="h-8 w-8 rounded-full border-2 border-background" />
                    ))}
                  </div>
                  <div className="col-span-2">
                    <Badge variant={getUrgencyVariant(task.urgency)}>{task.urgency}</Badge>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-bold">{task.completion}%</span>
                      <Progress value={task.completion} className="w-full h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/ui/navigation';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Play, 
  Edit3,
  Save,
  X,
  Calendar,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { 
  mockUsers, 
  mockSessions, 
  mockMetrics,
  mockFeedback,
  mockCurrentUser,
  getSessionMetrics
} from '@/services/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [newFeedback, setNewFeedback] = useState({
    sessionId: '',
    content: '',
    category: 'communication' as const,
    priority: 'medium' as const
  });
  const { toast } = useToast();

  // Check if current user has admin access
  const hasAdminAccess = mockCurrentUser.role === 'admin' || mockCurrentUser.role === 'coach';

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto p-6">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access the admin dashboard.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const filteredSessions = selectedUser 
    ? mockSessions.filter(s => s.userId === selectedUser)
    : mockSessions;

  const filteredFeedback = selectedUser
    ? mockFeedback.filter(f => {
        const session = mockSessions.find(s => s.id === f.sessionId);
        return session?.userId === selectedUser;
      })
    : mockFeedback;

  const handleSaveFeedback = () => {
    if (!newFeedback.sessionId || !newFeedback.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback saved",
      description: "Your feedback has been added to the session",
    });

    setNewFeedback({
      sessionId: '',
      content: '',
      category: 'communication',
      priority: 'medium'
    });
  };

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
      case 'teamwork': return <Users className="h-4 w-4" />;
      case 'strategy': return <BarChart3 className="h-4 w-4" />;
      case 'clarity': return <Settings className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, review sessions, and provide feedback
            </p>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-primary/20 to-accent/20">
            {mockCurrentUser.role === 'admin' ? 'Administrator' : 'Coach'}
          </Badge>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockUsers.length}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{mockSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-success" />
                <div>
                  <p className="text-2xl font-bold">{mockFeedback.length}</p>
                  <p className="text-xs text-muted-foreground">Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockSessions.filter(s => s.status === 'completed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by User</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All users</SelectItem>
                {mockUsers.filter(u => u.role === 'player').map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="add-feedback">Add Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {mockSessions.filter(s => s.userId === user.id).length} sessions
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mockFeedback.filter(f => {
                              const session = mockSessions.find(s => s.id === f.sessionId);
                              return session?.userId === user.id;
                            }).length} feedback
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Overview</CardTitle>
                <CardDescription>
                  Review all uploaded sessions and their analysis status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSessions.map(session => {
                    const user = mockUsers.find(u => u.id === session.userId);
                    const metrics = getSessionMetrics(session.id);
                    return (
                      <div 
                        key={session.id} 
                        className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Play className="h-4 w-4 text-primary" />
                              <p className="font-medium">{session.fileName}</p>
                              <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {user?.username} • {session.gameMode} • {Math.round(session.duration / 60)}min
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {format(new Date(session.uploadDate), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          {metrics && (
                            <div className="text-right space-y-1">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Words:</span> {metrics.wordsSpoken}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Coordination:</span> {metrics.teamCoordination}%
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Commands:</span> {metrics.commandsGiven}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Management</CardTitle>
                <CardDescription>
                  View and edit all AI and coach feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedback.map(feedback => {
                    const session = mockSessions.find(s => s.id === feedback.sessionId);
                    const user = mockUsers.find(u => u.id === session?.userId);
                    const isEditing = editingFeedback === feedback.id;

                    return (
                      <div 
                        key={feedback.id} 
                        className="p-4 border border-border rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(feedback.category)}
                            <div>
                              <p className="font-medium text-sm">
                                {feedback.type === 'ai' ? 'AI Analysis' : 'Coach Feedback'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user?.username} • {session?.fileName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getPriorityColor(feedback.priority)}>
                              {feedback.priority}
                            </Badge>
                            {feedback.type === 'coach' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingFeedback(isEditing ? null : feedback.id)}
                              >
                                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-3">
                            <Textarea 
                              defaultValue={feedback.content}
                              placeholder="Edit feedback content..."
                            />
                            <div className="flex items-center space-x-2">
                              <Button size="sm" onClick={() => setEditingFeedback(null)}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingFeedback(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{feedback.content}</p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(feedback.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Coach Feedback</CardTitle>
                <CardDescription>
                  Provide personalized feedback for player sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Select value={newFeedback.sessionId} onValueChange={(value) => 
                    setNewFeedback(prev => ({ ...prev, sessionId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a session" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSessions.map(session => {
                        const user = mockUsers.find(u => u.id === session.userId);
                        return (
                          <SelectItem key={session.id} value={session.id}>
                            {user?.username} - {session.fileName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Feedback Content</Label>
                  <Textarea
                    id="content"
                    value={newFeedback.content}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Provide detailed feedback on the player's communication..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newFeedback.category} onValueChange={(value: any) => 
                      setNewFeedback(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="teamwork">Teamwork</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="clarity">Clarity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newFeedback.priority} onValueChange={(value: any) => 
                      setNewFeedback(prev => ({ ...prev, priority: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveFeedback} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
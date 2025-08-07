import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Badge } from './badge';
import { 
  BarChart3, 
  Upload, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Home,
  Shield,
  Gamepad2
} from 'lucide-react';
import { mockAuth } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    try {
      await mockAuth.logout();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/metrics', label: 'Analytics', icon: BarChart3 },
  ];

  if (mockAuth.currentUser.role === 'admin' || mockAuth.currentUser.role === 'coach') {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EsportsCoach AI
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-accent/20">
            {mockAuth.currentUser.role}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mockAuth.currentUser.avatar} alt={mockAuth.currentUser.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {mockAuth.currentUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{mockAuth.currentUser.username}</p>
                <p className="text-xs text-muted-foreground">{mockAuth.currentUser.email}</p>
              </div>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
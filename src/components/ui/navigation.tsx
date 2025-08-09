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
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import logo from '/Logo Esports (1500 x 1440 px).png';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/metrics', label: 'Analytics', icon: BarChart3 },
  ];

  // TODO: Add role to user context to restore this functionality
  // if (mockAuth.currentUser.role === 'admin' || mockAuth.currentUser.role === 'coach') {
  //   navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  // }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img src={logo} alt="Clutch Platform Logo" className="h-12 w-12 rounded-xl" />
              <span className="text-xl font-extrabold text-gradient-primary">
                Clutch Platform
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'gradient-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {user ? (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="soft" className="flex items-center space-x-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.username}</p>
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
          ) : (
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import logo from '/Logo Esports (1500 x 1440 px).png';
import backgroundImage from '/103466_31257134_496181287.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock login logic, replace with your actual authentication
      if (email === 'player@example.com' && password === 'password') {
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        // @ts-ignore
        login({ id: 'demo-user', username: 'DemoPlayer', avatar: '' });
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('player@example.com');
    setPassword('password');
  };

  const handleDiscordLogin = () => {
    const discordClientId = '1373055822896042045';
    const redirectUri = 'http://localhost:8080/auth/discord/callback';
    const scope = 'identify';
    // Forcing prompt=consent to always show the dialog for demo purposes
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=consent`;
    window.location.href = authUrl;
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <img src={logo} alt="Clutch Platform Logo" className="w-24 h-24 mx-auto mb-4 rounded-3xl shadow-lg" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome to Clutch
          </h1>
          <p className="text-white/70 mt-2">
            The ultimate platform for competitive communication analysis.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="player@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/20 placeholder:text-white/40 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/20 placeholder:text-white/40 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="link" 
                className="p-0 text-white/60 hover:text-white"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Use Demo Credentials
              </Button>
              <Link to="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit"
              className="w-full gradient-primary text-lg font-semibold py-6"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 px-2 text-white/60 backdrop-blur-sm">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="soft" className="w-full py-6 text-lg" onClick={handleDiscordLogin}>
            <svg className="mr-3 h-6 w-6" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="discord" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M524.531,69.836a1.5,1.5,0,0,0-2.121.121L460.488,160.619c-18.448-9.728-38.24-16.608-59.232-20.832a1.5,1.5,0,0,0-1.6-1.44l-20.736,3.456a1.5,1.5,0,0,0-1.2,1.44,104.65,104.65,0,0,0-2.4,12.96,1.5,1.5,0,0,0,1.008,1.632l19.2,5.28A1.5,1.5,0,0,0,400.8,163.2a100.864,100.864,0,0,1,21.6,11.52,1.5,1.5,0,0,0,1.824-.24l60.48-72.672A1.5,1.5,0,0,0,524.531,69.836ZM222.491,143.208c-18.448-9.728-38.24-16.608-59.232-20.832a1.5,1.5,0,0,0-1.6-1.44l-20.736,3.456a1.5,1.5,0,0,0-1.2,1.44,104.65,104.65,0,0,0-2.4,12.96,1.5,1.5,0,0,0,1.008,1.632l19.2,5.28A1.5,1.5,0,0,0,160.8,163.2a100.864,100.864,0,0,1,21.6,11.52,1.5,1.5,0,0,0,1.824-.24l60.48-72.672A1.5,1.5,0,0,0,222.491,143.208Z M320,256a64,64,0,1,0-64-64A64,64,0,0,0,320,256Z M499.2,432H140.8a16,16,0,0,1-16-16V176a16,16,0,0,1,16-16H499.2a16,16,0,0,1,16,16V416A16,16,0,0,1,499.2,432Z"></path></svg>
            Discord
          </Button>
        </div>
        
        <p className="text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="#" className="font-medium text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
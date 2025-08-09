import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/ui/navigation';
import { 
  Upload as UploadIcon, 
  FileVideo, 
  FileAudio, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [gameMode, setGameMode] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [user, isAuthenticated, navigate, isLoading]);

  // Show a centered loader while auth initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparing your upload...</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (100MB limit for demo)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 100MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'audio/wav', 'audio/mp3', 'audio/ogg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a video (MP4, AVI, MOV) or audio (WAV, MP3, OGG) file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !gameMode || !teamSize) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          toast({
            title: "Upload successful!",
            description: "Your session is being analyzed. You'll receive feedback shortly.",
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const resetForm = () => {
    setFile(null);
    setGameMode('');
    setTeamSize('');
    setUploadProgress(0);
    setUploadComplete(false);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Create a synthetic event to reuse the existing handler
      const event = {
        target: {
          files: e.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-6 pt-24 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload a New Session
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Upload your gameplay recordings for AI-powered communication analysis. Get insights into your team's performance and improve your strategy.
          </p>
        </div>

        {/* Upload Form */}
        <Card className="glass">
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Side: File Upload */}
            <div className="space-y-4">
              <Label htmlFor="file-upload" className="text-lg font-semibold">Session Recording</Label>
              <div
                onClick={() => document.getElementById('file-upload')?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                  ${isDragging ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50 hover:bg-muted/50'}
                  ${file ? 'border-primary' : ''}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  {file ? (
                    <>
                      {file.type.startsWith('video') ? (
                        <FileVideo className="w-12 h-12 mb-4 text-primary" />
                      ) : (
                        <FileAudio className="w-12 h-12 mb-4 text-primary" />
                      )}
                      <p className="mb-2 text-sm font-semibold text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button variant="link" size="sm" className="mt-2 text-primary" onClick={(e) => { e.stopPropagation(); resetForm(); }}>
                        Choose a different file
                      </Button>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-10 h-10 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">MP4, AVI, MOV, WAV, MP3 (MAX. 100MB)</p>
                    </>
                  )}
                </div>
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="video/mp4,video/avi,video/mov,audio/wav,audio/mp3,audio/ogg"
                />
              </div>
            </div>

            {/* Right Side: Metadata & Upload */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="game-mode" className="text-lg font-semibold">Game Details</Label>
                <p className="text-sm text-muted-foreground mb-4">Provide context for the analysis.</p>
                <div className="space-y-4">
                  <Select onValueChange={setGameMode} value={gameMode}>
                    <SelectTrigger id="game-mode" className="w-full">
                      <SelectValue placeholder="Select Game Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="search-and-destroy">Search and Destroy</SelectItem>
                      <SelectItem value="hardpoint">Hardpoint</SelectItem>
                      <SelectItem value="control">Control</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setTeamSize} value={teamSize}>
                    <SelectTrigger id="team-size" className="w-full">
                      <SelectValue placeholder="Select Team Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5v5">5v5</SelectItem>
                      <SelectItem value="4v4">4v4</SelectItem>
                      <SelectItem value="6v6">6v6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload Button and Progress */}
              <div className="space-y-4 pt-4">
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
                      <p className="text-sm font-bold text-primary">{Math.round(uploadProgress)}%</p>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {uploadComplete && (
                  <Alert className="border-green-500/50 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Upload complete! Your analysis is in progress.
                    </AlertDescription>
                  </Alert>
                )}

                {!isUploading && !uploadComplete && (
                  <Button onClick={handleUpload} className="w-full" size="lg" disabled={!file || !gameMode || !teamSize}>
                    <UploadIcon className="mr-2 h-5 w-5" />
                    Upload and Analyze
                  </Button>
                )}

                {(isUploading || uploadComplete) && (
                  <Button onClick={resetForm} variant="soft" className="w-full">
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isUploading ? 'Cancel' : 'Upload Another File'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Alert className="glass">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your privacy is important. Uploaded files are used solely for analysis and are automatically deleted after 24 hours. Ensure your recordings have clear audio for the best results.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default Upload;
import { useState } from 'react';
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

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [gameMode, setGameMode] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload Session
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload your gameplay recordings for AI-powered communication analysis
          </p>
        </div>

        {/* Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Select your gameplay session recording (video or audio)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Session Recording</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="file-upload"
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading || uploadComplete}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? (
                      <div className="space-y-2">
                        {file.type.startsWith('video/') ? (
                          <FileVideo className="h-12 w-12 text-primary mx-auto" />
                        ) : (
                          <FileAudio className="h-12 w-12 text-primary mx-auto" />
                        )}
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="font-medium">Click to upload file</p>
                        <p className="text-sm text-muted-foreground">
                          Video: MP4, AVI, MOV • Audio: WAV, MP3, OGG
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Max file size: 100MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="game-mode">Game Mode</Label>
                  <Select value={gameMode} onValueChange={setGameMode} disabled={isUploading || uploadComplete}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="competitive">Competitive/Ranked</SelectItem>
                      <SelectItem value="scrimmage">Scrimmage</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="training">Training/Practice</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-size">Team Size</Label>
                  <Select value={teamSize} onValueChange={setTeamSize} disabled={isUploading || uploadComplete}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2v2</SelectItem>
                      <SelectItem value="3">3v3</SelectItem>
                      <SelectItem value="5">5v5</SelectItem>
                      <SelectItem value="6">6v6</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Upload Progress</Label>
                    <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Success Message */}
              {uploadComplete && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload complete! Your session is being analyzed. Results will be available in your dashboard shortly.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!uploadComplete ? (
                  <Button 
                    onClick={handleUpload}
                    disabled={!file || !gameMode || !teamSize || isUploading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={resetForm} className="flex-1" variant="outline">
                    Upload Another Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span>What We Analyze</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Communication Frequency</p>
                      <p className="text-sm text-muted-foreground">
                        Number of words spoken and speaking time ratio
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Voice Quality</p>
                      <p className="text-sm text-muted-foreground">
                        Average volume and clarity of communication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Strategic Communication</p>
                      <p className="text-sm text-muted-foreground">
                        Commands given and strategic vocabulary usage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Team Coordination</p>
                      <p className="text-sm text-muted-foreground">
                        Speech overlap patterns and turn-taking analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Communication Gaps</p>
                      <p className="text-sm text-muted-foreground">
                        Silence periods and missed callout opportunities
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm">
                    Ensure clear audio quality for accurate voice analysis
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm">
                    Include pre-round and post-round communication
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm">
                    Upload full rounds for comprehensive team dynamics analysis
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                  <p className="text-sm">
                    Analysis typically takes 5-15 minutes depending on file size
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
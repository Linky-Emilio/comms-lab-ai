// Mock data service for the esports coaching platform

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'player' | 'coach' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'audio' | 'video';
  uploadDate: string;
  duration: number; // in seconds
  status: 'processing' | 'completed' | 'failed';
  gameMode: string;
  teamSize: number;
}

export interface Metrics {
  sessionId: string;
  wordsSpoken: number;
  averageVolume: number; // 0-100
  commandsGiven: number;
  strategicVocabUsed: number;
  silenceDuration: number; // in seconds
  teamCoordination: number; // 0-100 score
  communicationGaps: number;
  speakingTime: number; // in seconds
  analysisDate: string;
  playerMetrics?: { playerId: string; wordsSpoken: number }[];
  volumeBreakdown?: { high: number; medium: number; low: number }; // percentages
  toxicityScore?: number; // 0-100
}

export interface Feedback {
  id: string;
  sessionId: string;
  type: 'ai' | 'coach';
  content: string;
  category: 'communication' | 'teamwork' | 'strategy' | 'clarity';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy?: string; // coach user id
}

// Mock current user
export const mockCurrentUser: User = {
  id: '1',
  username: 'ProGamer2024',
  email: 'player@example.com',
  role: 'player',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  createdAt: '2024-01-15T10:00:00Z'
};

// Mock users for admin dashboard
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: '2',
    username: 'StrategyMaster',
    email: 'strategy@example.com',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-10T08:30:00Z'
  },
  {
    id: '3',
    username: 'TeamLeader',
    email: 'leader@example.com',
    role: 'player',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '4',
    username: 'CoachMike',
    email: 'coach@example.com',
    role: 'coach',
    createdAt: '2024-01-05T09:00:00Z'
  }
];

// Mock sessions
export const mockSessions: Session[] = [
  {
    id: 's1',
    userId: '1',
    fileName: 'ranked_match_valorant_01.mp4',
    fileType: 'video',
    uploadDate: '2024-02-01T16:30:00Z',
    duration: 2340, // 39 minutes
    status: 'completed',
    gameMode: 'Competitive',
    teamSize: 5
  },
  {
    id: 's2',
    userId: '1',
    fileName: 'scrim_practice_audio.wav',
    fileType: 'audio',
    uploadDate: '2024-01-28T19:45:00Z',
    duration: 1800, // 30 minutes
    status: 'completed',
    gameMode: 'Scrimmage',
    teamSize: 5
  },
  {
    id: 's3',
    userId: '1',
    fileName: 'team_callouts_training.mp4',
    fileType: 'video',
    uploadDate: '2024-01-25T20:15:00Z',
    duration: 900, // 15 minutes
    status: 'completed',
    gameMode: 'Training',
    teamSize: 5
  },
  {
    id: 's4',
    userId: '2',
    fileName: 'cs2_competitive_match.mp4',
    fileType: 'video',
    uploadDate: '2024-02-02T21:00:00Z',
    duration: 2700, // 45 minutes
    status: 'completed',
    gameMode: 'Competitive',
    teamSize: 5
  }
];

// Mock metrics
export const mockMetrics: Metrics[] = [
  {
    sessionId: 's1',
    wordsSpoken: 1250,
    averageVolume: 75,
    commandsGiven: 45,
    strategicVocabUsed: 28,
    silenceDuration: 420,
    teamCoordination: 78,
    communicationGaps: 12,
    speakingTime: 840,
    analysisDate: '2024-02-01T17:00:00Z',
    playerMetrics: [
      { playerId: '1', wordsSpoken: 450 },
      { playerId: '2', wordsSpoken: 500 },
      { playerId: '3', wordsSpoken: 300 },
    ],
    volumeBreakdown: { high: 40, medium: 50, low: 10 },
    toxicityScore: 15,
  },
  {
    sessionId: 's2',
    wordsSpoken: 890,
    averageVolume: 68,
    commandsGiven: 32,
    strategicVocabUsed: 19,
    silenceDuration: 380,
    teamCoordination: 65,
    communicationGaps: 18,
    speakingTime: 620,
    analysisDate: '2024-01-28T20:15:00Z',
    playerMetrics: [
      { playerId: '1', wordsSpoken: 300 },
      { playerId: '2', wordsSpoken: 290 },
      { playerId: '3', wordsSpoken: 300 },
    ],
    volumeBreakdown: { high: 20, medium: 70, low: 10 },
    toxicityScore: 25,
  },
  {
    sessionId: 's3',
    wordsSpoken: 445,
    averageVolume: 72,
    commandsGiven: 18,
    strategicVocabUsed: 15,
    silenceDuration: 120,
    teamCoordination: 82,
    communicationGaps: 5,
    speakingTime: 380,
    analysisDate: '2024-01-25T20:45:00Z',
    playerMetrics: [
      { playerId: '1', wordsSpoken: 150 },
      { playerId: '2', wordsSpoken: 145 },
      { playerId: '3', wordsSpoken: 150 },
    ],
    volumeBreakdown: { high: 30, medium: 60, low: 10 },
    toxicityScore: 10,
  },
  {
    sessionId: 's4',
    wordsSpoken: 1450,
    averageVolume: 82,
    commandsGiven: 52,
    strategicVocabUsed: 34,
    silenceDuration: 290,
    teamCoordination: 88,
    communicationGaps: 8,
    speakingTime: 980,
    analysisDate: '2024-02-02T21:30:00Z',
    playerMetrics: [
      { playerId: '1', wordsSpoken: 500 },
      { playerId: '2', wordsSpoken: 600 },
      { playerId: '3', wordsSpoken: 350 },
    ],
    volumeBreakdown: { high: 35, medium: 55, low: 10 },
    toxicityScore: 18,
  }
];

// Mock feedback
export const mockFeedback: Feedback[] = [
  {
    id: 'f1',
    sessionId: 's1',
    type: 'ai',
    content: 'Your communication frequency was 15% below average this session. Consider providing more tactical callouts during rounds.',
    category: 'communication',
    priority: 'medium',
    createdAt: '2024-02-01T17:05:00Z'
  },
  {
    id: 'f2',
    sessionId: 's1',
    type: 'ai',
    content: 'Excellent team coordination score of 78%! Your timing with callouts improved significantly.',
    category: 'teamwork',
    priority: 'low',
    createdAt: '2024-02-01T17:05:00Z'
  },
  {
    id: 'f3',
    sessionId: 's2',
    type: 'coach',
    content: 'Work on reducing communication gaps during clutch situations. Practice calling out enemy positions earlier.',
    category: 'strategy',
    priority: 'high',
    createdAt: '2024-01-29T10:30:00Z',
    createdBy: '4'
  },
  {
    id: 'f4',
    sessionId: 's3',
    type: 'ai',
    content: 'Great improvement in using strategic vocabulary! 25% increase from previous sessions.',
    category: 'communication',
    priority: 'low',
    createdAt: '2024-01-25T21:00:00Z'
  },
  {
    id: 'f5',
    sessionId: 's2',
    type: 'coach',
    content: 'Consider watching professional matches to understand better positioning and utility usage.',
    category: 'strategy',
    priority: 'medium',
    createdAt: '2024-01-28T20:30:00Z',
    createdBy: '4'
  }
];

export const tasksToDo = [
  {
    id: 1,
    name: 'Review callouts for "Mid"',
    players: [
      { id: 1, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
      { id: 2, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    ],
    urgency: 'High',
    completion: 60,
    icon: 'volume-2'
  },
  {
    id: 2,
    name: 'Improve economy management',
    players: [
      { id: 3, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ],
    urgency: 'Medium',
    completion: 10,
    icon: 'bar-chart-2'
  },
  {
    id: 3,
    name: 'Practice post-plant positions',
    players: [
      { id: 1, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
      { id: 4, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
      { id: 5, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
    ],
    urgency: 'Low',
    completion: 100,
    icon: 'target'
  },
  {
    id: 4,
    name: 'Work on utility usage for "A site"',
    players: [
      { id: 2, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: 3, avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ],
    urgency: 'High',
    completion: 25,
    icon: 'git-commit'
  },
];

// Helper functions to get data
export const getUserSessions = (userId: string) => {
  return mockSessions.filter(session => session.userId === userId);
};

export const getSessionMetrics = (sessionId: string): Metrics | undefined => {
  return mockMetrics.find(metrics => metrics.sessionId === sessionId);
};

export const getUserMetrics = (userId: string) => {
  const sessionIds = mockSessions.filter(s => s.userId === userId).map(s => s.id);
  return mockMetrics.filter(m => sessionIds.includes(m.sessionId));
};

export const getSessionFeedback = (sessionId: string) => {
  return mockFeedback.filter(f => f.sessionId === sessionId);
};

// Mock authentication service
export const mockAuth = {
  currentUser: mockCurrentUser,
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'player@example.com' && password === 'password') {
      return { success: true, user: mockCurrentUser };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  register: async (username: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, user: { ...mockCurrentUser, username, email } };
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};
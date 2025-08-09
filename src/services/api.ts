// src/services/api.ts

export interface DynamoDBString {
  S: string;
}

export interface UserPreferences {
  M: {
    coach_type: DynamoDBString;
    elevenlabs_voice: DynamoDBString;
    game: DynamoDBString;
    personality: DynamoDBString;
    tts_speed: DynamoDBString;
    userId: DynamoDBString;
  };
}

export interface AnalysisData {
  id?: string;
  analysis_id?: string;
  analysis_text?: string;
  audio_url?: string;
  coach_type?: string;
  game?: string;
  timestamp?: string;
  transcription?: string;
  user_id?: string;
  user_preferences?: any; // El backend tiene estructura diferente
  player_audio_url?: string | DynamoDBString;
  coach_audio_url?: string | DynamoDBString;
  wpm?: number;
}

export const getAnalysisData = async (userId: string): Promise<AnalysisData[]> => {
  console.log('🔍 Making API call for user ID:', userId);
  
  // Usar proxy en desarrollo, URL directa en producción
  const baseUrl = import.meta.env.DEV 
    ? '/api' 
    : 'http://clutch-backend-env.eba-7z3q9wis.us-east-2.elasticbeanstalk.com';
  
  const apiUrl = `${baseUrl}/analisis/${userId}`;
  console.log('🌐 API URL:', apiUrl);
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  
  console.log('📡 Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    console.error('❌ API call failed with status:', response.status);
    const errorText = await response.text();
    console.error('❌ Error response:', errorText);
    throw new Error(`Failed to fetch analysis data: ${response.status} - ${errorText}`);
  }
  
  const apiResponse = await response.json();
  console.log('✅ API response data:', JSON.stringify(apiResponse, null, 2));
  
  // El API devuelve { success: true, data: [array] }
  // Retornamos todos los análisis ordenados por timestamp (más reciente primero)
  if (apiResponse.success && apiResponse.data && apiResponse.data.length > 0) {
    return apiResponse.data.sort((a: AnalysisData, b: AnalysisData) => {
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });
  } else {
    throw new Error('No analysis data found for this user');
  }
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DiscordCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');
    const error = fragment.get('error');

    // Si hay un error (por ejemplo, cuando prompt=none falla), redirigir a autorización completa
    if (error === 'interaction_required' || error === 'consent_required') {
      const discordClientId = '1373055822896042045';
      const redirectUri = 'http://localhost:8080/auth/discord/callback';
      const scope = 'identify';
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
      window.location.href = authUrl;
      return;
    }

    if (accessToken) {
      // Store the access token for future API calls
      localStorage.setItem('discord_token', accessToken);
      
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => res.json())
        .then(response => {
          const { id, username, avatar } = response;
          const user = {
            id,
            username,
            avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
          };
          login(user);
          navigate('/dashboard');
        })
        .catch(console.error);
    } else {
      navigate('/login');
    }
  }, [login, navigate]);

  return <div>Loading...</div>;
};

export default DiscordCallback;

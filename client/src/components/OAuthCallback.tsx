import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface OAuthCallbackProps {
  onOAuthLogin: (token: string, userData: User) => void;
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({ onOAuthLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const userParam = params.get('user'); // Get user data from URL
      const error = params.get('error');

      if (token && userParam) {
        try {
          // Parse the user data that was sent from the backend
          const userData: User = JSON.parse(decodeURIComponent(userParam));
          
          // Save token to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Call the login callback with real data
          onOAuthLogin(token, userData);
          navigate('/dashboard');
        } catch (err) {
          console.error('Failed to parse user data:', err);
          navigate('/login', { state: { error: 'Failed to complete authentication' } });
        }
      } else if (error) {
        navigate('/login', { state: { error: `Authentication failed: ${error}` } });
      } else {
        navigate('/login', { state: { error: 'Authentication failed: Missing token or user data' } });
      }
    };

    handleOAuthCallback();
  }, [location, navigate, onOAuthLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Completing authentication...</h2>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
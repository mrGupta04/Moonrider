import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  activeTab: string;
  onLogout: () => void;
  onProfileUpdate: (updatedUser: User) => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeTab, onLogout, onProfileUpdate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize editedUser when user changes
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  // Reset editedUser when dropdown opens
  useEffect(() => {
    if (isProfileOpen && user) {
      setEditedUser({ ...user });
      setError(null);
      setIsEditing(false);
    }
  }, [isProfileOpen, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsEditing(false);
        setError(null);
        if (user) setEditedUser({ ...user });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  const handleProfileClick = () => {
    if (!user) return;
    setIsProfileOpen((prev) => !prev);
    setIsEditing(false);
    setError(null);
    setEditedUser({ ...user });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!editedUser) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', editedUser.name || '');
      formData.append('phone', editedUser.phone || '');
      formData.append('instagram', editedUser.instagram || '');
      formData.append('leetcode', editedUser.leetcode || '');
      formData.append('youtube', editedUser.youtube || '');

      if (editedUser.avatar instanceof File) {
        formData.append('avatar', editedUser.avatar);
      }

      const response = await axios.put("http://localhost:5000/api/user", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.user) {
        console.log('Profile update successful:', response.data.user);
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Call the parent callback to update the state in the parent component
        onProfileUpdate(response.data.user);
        
        setIsEditing(false);
        setIsProfileOpen(false);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      const errorMessage =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Failed to update profile. Please check your connection.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (user) setEditedUser({ ...user });
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedUser) {
      setEditedUser((prev) => prev ? { ...prev, avatar: file } : null);
    }
  };

  const getAvatarUrl = (avatar: string | File | null | undefined): string | null => {
    if (!avatar) return null;
    if (typeof avatar === 'string') {
      if (avatar.startsWith('data:')) return avatar;
      if (avatar.startsWith('http')) return avatar;
      if (avatar.includes('avatar-')) {
        const filename = avatar.split(/[\\/]/).pop();
        return `http://localhost:5000/uploads/avatars/${filename}`;
      }
      return avatar;
    }
    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }
    return null;
  };

  const renderAvatar = (userData: User | null, size: 'small' | 'large' = 'small') => {
    const avatarSize = size === 'small' ? 'w-8 h-8' : 'w-16 h-16';
    const fontSize = size === 'small' ? 'text-sm' : 'text-2xl';

    if (userData?.avatar) {
      const avatarUrl = getAvatarUrl(userData.avatar);
      if (avatarUrl) {
        return (
          <img
            src={avatarUrl}
            alt={userData.name || 'User'}
            className={`${avatarSize} rounded-full object-cover`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      }
    }
    
    return (
      <div
        className={`${avatarSize} bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium ${fontSize}`}
      >
        {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  };

  if (!user) {
    return (
      <header className="bg-white shadow-sm relative">
        <div className="flex justify-between items-center py-4 px-8">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          <div className="text-gray-500">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm relative">
      <div className="flex justify-between items-center py-4 px-8">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 bg-gray-100 rounded-full py-2 px-4 hover:bg-gray-200 transition-colors"
              onClick={handleProfileClick}
            >
              {renderAvatar(user, 'small')}
              <span className="font-medium">{user.name || 'User'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                    {!isEditing && (
                      <button
                        onClick={handleEditClick}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
                  )}

                  <div className="flex items-center space-x-4">
                    {isEditing ? (
                      <div className="relative">
                        {renderAvatar(editedUser, 'large')}
                        <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer text-xs">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536M4 20h4l12-12a2.5 2.5 0 10-3.536-3.536L4 16v4z"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                      </div>
                    ) : (
                      renderAvatar(user, 'large')
                    )}
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedUser?.name || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-gray-800">{user.name || 'User'}</h4>
                      )}
                      <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {['phone', 'instagram', 'leetcode', 'youtube'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                          {field}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name={field}
                            value={(editedUser as any)?.[field] || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder={`Enter your ${field}`}
                          />
                        ) : (
                          <p className="text-gray-800">{(user as any)[field] || 'Not provided'}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSaveClick}
                        disabled={isLoading}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelClick}
                        disabled={isLoading}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button
                        onClick={onLogout}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
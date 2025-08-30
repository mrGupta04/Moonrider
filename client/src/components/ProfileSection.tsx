// src/components/ProfileSection.tsx
import React from 'react';
import type  { User } from '../types';

interface ProfileSectionProps {
  user: User;
  onAddProfile: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onAddProfile }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Current User</h3>
        <button 
          onClick={onAddProfile}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Add New Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Basic Info</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Name:</span> {user.name}</p>
            <p><span className="text-gray-500">Email:</span> {user.email}</p>
            <p><span className="text-gray-500">Phone:</span> +1 (972) 345-6789</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Social Links</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Instagram:</span> instagram.com/johndoe</p>
            <p><span className="text-gray-500">YouTube:</span> youtube.com/johndoe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
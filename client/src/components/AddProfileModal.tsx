// src/components/AddProfileModal.tsx
import React, { useState } from 'react';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewProfile {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose }) => {
  const [newProfile, setNewProfile] = useState<NewProfile>({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    youtube: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    onClose();
    setNewProfile({ name: '', email: '', phone: '', instagram: '', youtube: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Profile</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-4">Basic</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newProfile.name}
                    onChange={handleInputChange}
                    placeholder="Eg. John Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={newProfile.email}
                    onChange={handleInputChange}
                    placeholder="Eg. John@yyz.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newProfile.phone}
                    onChange={handleInputChange}
                    placeholder="Eg. 9723456789"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-4">Social Links (Optional)</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
                  <input
                    type="url"
                    name="instagram"
                    value={newProfile.instagram}
                    onChange={handleInputChange}
                    placeholder="Eg. instagram.com/username"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Youtube Link</label>
                  <input
                    type="url"
                    name="youtube"
                    value={newProfile.youtube}
                    onChange={handleInputChange}
                    placeholder="Eg. youtube.com/username"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProfileModal;
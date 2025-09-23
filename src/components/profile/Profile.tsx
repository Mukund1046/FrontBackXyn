import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/useAppStore';
import {
  User,
  Mail,
  Calendar,
  Heart,
  Pill,
  Shield,
  Edit,
  Plus,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, setCurrentView } = useAppStore();

  if (!user.profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600">
            Please complete onboarding to set up your profile.
          </p>
        </Card>
      </div>
    );
  }

  const { profile } = user;

  const profileSections = [
    {
      title: 'Basic Information',
      icon: User,
      items: [
        { label: 'Name', value: `${profile.firstName} ${profile.lastName}` },
        { label: 'Email', value: profile.email },
        { label: 'Date of Birth', value: profile.dateOfBirth ? profile.dateOfBirth.toLocaleDateString() : 'Not provided' },
        { label: 'Medicare ID', value: profile.medicareId || 'Not provided' },
      ],
    },
    {
      title: 'Health Conditions',
      icon: Heart,
      items: profile.healthConditions.length > 0
        ? profile.healthConditions.map(condition => ({ label: '', value: condition }))
        : [{ label: '', value: 'No conditions added yet' }],
    },
    {
      title: 'Current Medications',
      icon: Pill,
      items: profile.medications.length > 0
        ? profile.medications.map(medication => ({ label: '', value: medication }))
        : [{ label: '', value: 'No medications added yet' }],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card padding="lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {profile.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Completeness */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completeness
              </span>
              <span className="text-sm font-medium text-gray-900">
                {profile.profileCompleteness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profile.profileCompleteness}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Complete your profile to get better AI recommendations
            </p>
          </div>
        </Card>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profileSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    {section.title}
                  </h2>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start">
                      {item.label && (
                        <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">
                          {item.label}:
                        </span>
                      )}
                      <span className={`text-sm text-gray-900 ${item.label ? 'text-right' : ''} ${!item.label && item.value.includes('No ') ? 'text-gray-500 italic' : ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Preferences */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            Privacy Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about your health plan</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile.preferences.notifications}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Sharing</p>
                <p className="text-sm text-gray-600">Share anonymized data to improve AI recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile.preferences.dataSharing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setCurrentView('chat')}
            className="flex-1 max-w-xs"
          >
            Continue Chatting to Build Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentView('settings')}
            className="flex-1 max-w-xs"
          >
            Account Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
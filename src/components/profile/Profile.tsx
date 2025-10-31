import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner, SkeletonCard, SkeletonText } from '../ui/LoadingSpinner';
import { useAppStore } from '../../stores/useAppStore';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import {
  User,
  Mail,
  Calendar,
  Heart,
  Pill,
  Shield,
  Edit,
  Plus,
  X,
} from 'lucide-react';

const ProfileContent: React.FC = () => {
  const { user, setCurrentView, updateProfile } = useAppStore();
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [newMedication, setNewMedication] = useState('');
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(user.profile?.firstName || '');
  const [editedLastName, setEditedLastName] = useState(user.profile?.lastName || '');
  const [editedMedicareId, setEditedMedicareId] = useState(user.profile?.medicareId || '');
  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const handleSaveCondition = async () => {
    if (!newCondition.trim()) return;

    const updatedConditions = [...profile.healthConditions, newCondition.trim()];
    await updateProfile({ healthConditions: updatedConditions });
    setNewCondition('');
    setIsAddingCondition(false);
  };

  const handleSaveMedication = async () => {
    if (!newMedication.trim()) return;

    const updatedMedications = [...profile.medications, newMedication.trim()];
    await updateProfile({ medications: updatedMedications });
    setNewMedication('');
    setIsAddingMedication(false);
  };

  const handleSaveBasicInfo = async () => {
    await updateProfile({
      firstName: editedFirstName,
      lastName: editedLastName,
      medicareId: editedMedicareId,
    });
    setIsEditingBasicInfo(false);
  };

  const handleDeleteCondition = async (condition: string) => {
    const updatedConditions = profile.healthConditions.filter(c => c !== condition);
    await updateProfile({ healthConditions: updatedConditions });
  };

  const handleDeleteMedication = async (medication: string) => {
    const updatedMedications = profile.medications.filter(m => m !== medication);
    await updateProfile({ medications: updatedMedications });
  };

  const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateProfile({ preferences: { ...user.profile.preferences, notifications: e.target.checked } });
  };

  const handleDataSharingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateProfile({ preferences: { ...user.profile.preferences, dataSharing: e.target.checked } });
  };

  if (!user.profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-h2 font-semibold text-gray-900 mb-2">
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
      content: isEditingBasicInfo ? (
        <div className="space-y-3">
          <Input
            label="First Name"
            value={editedFirstName}
            onChange={(e) => setEditedFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            value={editedLastName}
            onChange={(e) => setEditedLastName(e.target.value)}
          />
          <Input
            label="Medicare ID"
            value={editedMedicareId}
            onChange={(e) => setEditedMedicareId(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveBasicInfo}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditingBasicInfo(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">Name:</span>
            <span className="text-sm text-gray-900 text-right">{`${profile.firstName} ${profile.lastName}`}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">Email:</span>
            <span className="text-sm text-gray-900 text-right">{profile.email}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">Date of Birth:</span>
            <span className="text-sm text-gray-900 text-right">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">Medicare ID:</span>
            <span className="text-sm text-gray-900 text-right">{profile.medicareId || 'Not provided'}</span>
          </div>
        </div>
      ),
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
                <h1 className="text-h1 font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditingBasicInfo(true)}>
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
                  <h2 className="text-h2 font-semibold text-gray-900 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    {section.title}
                  </h2>
                  {section.title === 'Basic Information' && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingBasicInfo(true)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {section.title === 'Health Conditions' && (
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingCondition(true)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {section.title === 'Current Medications' && (
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingMedication(true)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {section.content ? (
                  section.content
                ) : (
                  <div className="space-y-3">
                    {section.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start">
                        {item.label && (
                          <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">
                            {item.label}:
                          </span>
                        )}
                        <span className={`text-sm text-gray-900 ${item.label ? 'text-right' : ''} ${!item.label && item.value.includes('No ') ? 'text-gray-500 italic' : ''}`}>
                          {item.value}
                        </span>
                        {(section.title === 'Health Conditions' || section.title === 'Current Medications') && item.value !== 'No conditions added yet' && item.value !== 'No medications added yet' && (
                          <Button variant="ghost" size="sm" onClick={() => {
                            if (section.title === 'Health Conditions') {
                              handleDeleteCondition(item.value);
                            } else if (section.title === 'Current Medications') {
                              handleDeleteMedication(item.value);
                            }
                          }}>
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {section.title === 'Health Conditions' && isAddingCondition && (
                      <div className="flex gap-2 mt-4">
                        <Input
                          placeholder="New condition"
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                        />
                        <Button onClick={handleSaveCondition}>Add</Button>
                        <Button variant="outline" onClick={() => setIsAddingCondition(false)}>Cancel</Button>
                      </div>
                    )}
                    {section.title === 'Current Medications' && isAddingMedication && (
                      <div className="flex gap-2 mt-4">
                        <Input
                          placeholder="New medication"
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                        />
                        <Button onClick={handleSaveMedication}>Add</Button>
                        <Button variant="outline" onClick={() => setIsAddingMedication(false)}>Cancel</Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Preferences */}
        <Card padding="md">
          <h2 className="text-h2 font-semibold text-gray-900 flex items-center gap-2 mb-4">
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
                  onChange={handleNotificationChange}
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
                  onChange={handleDataSharingChange}
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

export const Profile: React.FC = () => {
  const { setCurrentView } = useAppStore();
  return (
    <FeatureErrorBoundary feature="profile" navigate={() => setCurrentView('dashboard')}>
      <ProfileContent />
    </FeatureErrorBoundary>
  );
};
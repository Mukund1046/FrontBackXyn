import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../stores/useAppStore';
import {
  Shield,
  Bell,
  Palette,
  Download,
  Trash,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, ui, showNotification, updateProfile } = useAppStore();

  const handleExportData = () => {
    const data = {
      profile: user.profile,
      preferences: user.profile?.preferences,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xynai-profile-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const settingSections = [
    {
      title: 'Privacy & Security',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
            </div>
            <label htmlFor="session-timeout" className="sr-only">
              Session timeout
            </label>
            <select
              id="session-timeout"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select session timeout duration"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>Never</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Encryption</p>
              <p className="text-sm text-gray-600">All health data is encrypted at rest</p>
            </div>
            <span className="text-sm text-green-600 font-medium">Enabled</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Health tips and plan updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user.profile?.preferences.notifications}
                onChange={(e) => {
                  if (user.profile) {
                    updateProfile({
                      preferences: {
                        ...user.profile.preferences,
                        notifications: e.target.checked,
                      },
                    });
                  }
                }}
                aria-label="Enable email notifications"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" aria-hidden="true"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">Browser notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
                aria-label="Enable push notifications"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" aria-hidden="true"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Chat Notifications</p>
              <p className="text-sm text-gray-600">Alerts for new AI responses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
                aria-label="Enable chat notifications"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" aria-hidden="true"></div>
            </label>
          </div>
        </div>
      ),
    },
    {
      title: 'Data Management',
      icon: Download,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Export My Data</p>
              <p className="text-sm text-gray-600">Download your profile and chat history</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Clear Chat History</p>
              <p className="text-sm text-gray-600">Remove all conversation history</p>
            </div>
            <Button variant="outline" size="sm">
              Clear History
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-red-600">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and data</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="space-y-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <Card padding="md" className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              Help Center
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

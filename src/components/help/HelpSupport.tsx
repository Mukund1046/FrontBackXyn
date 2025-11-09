import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../stores/useAppStore';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import { FAQ } from './FAQ';
import { ContactForm } from './ContactForm';
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Book,
  Video,
  ChevronRight,
} from 'lucide-react';

const helpSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using Xyn.ai',
    icon: Book,
    topics: [
      'Setting up your account',
      'Configuring AI assistant',
      'Understanding your profile',
      'First chat conversation',
    ],
  },
  {
    id: 'medicare-plans',
    title: 'Medicare Plans',
    description: 'Everything about Medicare plan selection',
    icon: MessageSquare,
    topics: [
      'Types of Medicare plans',
      'Comparing plan benefits',
      'Understanding costs',
      'Enrollment periods',
    ],
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Using your AI health assistant',
    icon: MessageSquare,
    topics: [
      'Chat best practices',
      'Privacy and security',
      'Getting personalized advice',
      'Troubleshooting chat issues',
    ],
  },
  {
    id: 'account-settings',
    title: 'Account & Settings',
    description: 'Manage your account and preferences',
    icon: HelpCircle,
    topics: [
      'Profile management',
      'Privacy settings',
      'API key configuration',
      'Data export',
    ],
  },
];

const quickActions = [
  {
    title: 'Chat with AI',
    description: 'Get instant help from your AI assistant',
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-600',
    action: 'chat',
  },
  {
    title: 'Contact Support',
    description: 'Send us a message for personalized help',
    icon: Mail,
    color: 'bg-green-100 text-green-600',
    action: 'contact',
  },
  {
    title: 'View Documentation',
    description: 'Browse our comprehensive guides',
    icon: Book,
    color: 'bg-purple-100 text-purple-600',
    action: 'docs',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Video,
    color: 'bg-orange-100 text-orange-600',
    action: 'videos',
  },
];

const HelpSupportContent: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [activeTab, setActiveTab] = useState<'help' | 'faq' | 'contact'>('help');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'chat':
        setCurrentView('chat');
        break;
      case 'contact':
        setActiveTab('contact');
        break;
      case 'docs':

        break;
    }
  };

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Help & Support
                </h1>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Get help with Xyn.ai and find answers to your questions
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'help' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('help')}
              size="sm"
            >
              Help Center
            </Button>
            <Button
              variant={activeTab === 'faq' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('faq')}
              size="sm"
            >
              FAQ
            </Button>
            <Button
              variant={activeTab === 'contact' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('contact')}
              size="sm"
            >
              Contact
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card padding="lg">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search help articles, FAQs, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'help' && (
          <div className="space-y-12">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={index}
                      padding="lg"
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className="text-center space-y-4">
                        <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto transition-transform hover:scale-110`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Help Sections */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Help Topics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Card key={section.id} padding="lg" className="hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-gray-600" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {section.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {section.description}
                            </p>
                          </div>
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            {section.topics.map((topic, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Support Options */}
            <Card padding="lg" className="bg-blue-50 border-blue-200">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-blue-900">
                  Still need help?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Live Chat</h4>
                      <p className="text-sm text-blue-700">Available 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Email Support</h4>
                      <p className="text-sm text-blue-700">Response in 24h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Phone Support</h4>
                      <p className="text-sm text-blue-700">Mon-Fri 9AM-5PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button size="sm" onClick={() => setActiveTab('contact')}>
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentView('chat')}>
                    Chat with AI
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeTab === 'faq' && (
          <FAQ
            searchTerm={searchTerm}
            onSearchClear={() => setSearchTerm('')}
            onSearchChange={handleSearchChange}
          />
        )}
        {activeTab === 'contact' && <ContactForm onBack={() => setActiveTab('help')} />}
      </div>
    </div>
  );
};

export const HelpSupport: React.FC = () => {
  const { setCurrentView } = useAppStore();
  return (
    <FeatureErrorBoundary feature="dashboard" navigate={() => setCurrentView('dashboard')}>
      <HelpSupportContent />
    </FeatureErrorBoundary>
  );
};

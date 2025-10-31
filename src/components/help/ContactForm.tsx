import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../stores/useAppStore';
import {
  Send,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  includeSystemInfo: boolean;
}

const contactCategories = [
  { value: 'general', label: 'General Question' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'account', label: 'Account Issue' },
  { value: 'medicare', label: 'Medicare Plans' },
  { value: 'privacy', label: 'Privacy & Security' },
];

const priorityLevels = [
  { value: 'low', label: 'Low - General inquiry', icon: Clock, color: 'text-green-600' },
  { value: 'medium', label: 'Medium - Issue affecting usage', icon: AlertCircle, color: 'text-yellow-600' },
  { value: 'high', label: 'High - Critical issue', icon: AlertCircle, color: 'text-red-600' },
];

export const ContactForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAppStore();
  const [formData, setFormData] = useState<ContactFormData>({
    name: user.profile?.firstName && user.profile?.lastName 
      ? `${user.profile.firstName} ${user.profile.lastName}` 
      : '',
    email: user.profile?.email || '',
    category: 'general',
    priority: 'medium',
    subject: '',
    message: '',
    includeSystemInfo: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real application, this would send the data to your backend
      console.log('Contact form submission:', {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        systemInfo: formData.includeSystemInfo ? {
          platform: navigator.platform,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`,
        } : null,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <Card padding="lg" className="text-center max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900">
            Message Sent Successfully!
          </h2>
          
          <p className="text-gray-600">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email at {formData.email}</li>
              <li>• Our support team will review your message</li>
              <li>• We'll respond within 24 hours (or sooner for high-priority issues)</li>
              <li>• You can also chat with our AI assistant for immediate help</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
            <Button onClick={onBack}>
              Back to Help Center
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card padding="lg">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contact Support
            </h2>
            <p className="text-gray-600">
              Send us a message and we'll get back to you as soon as possible
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {contactCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your question or issue"
              error={errors.subject}
              required
            />

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please provide as much detail as possible about your question or issue..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length} characters (minimum 10)
              </p>
            </div>

            {/* System Information */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="includeSystemInfo"
                checked={formData.includeSystemInfo}
                onChange={(e) => handleInputChange('includeSystemInfo', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label htmlFor="includeSystemInfo" className="text-sm font-medium text-gray-700">
                  Include system information
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  This helps us troubleshoot technical issues faster. Includes browser, OS, and screen resolution.
                </p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Alternative Contact Methods */}
      <Card padding="md" className="bg-blue-50 border-blue-200">
        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900">
            Need immediate help?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">AI Chat</h4>
                <p className="text-sm text-blue-700">Available 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Email</h4>
                <p className="text-sm text-blue-700">support@xynai.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Response Time</h4>
                <p className="text-sm text-blue-700">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FAQProps {
  searchTerm: string;
  onSearchClear?: () => void;
  onSearchChange?: (term: string) => void;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I set up my Gemini API key?',
    answer: 'To set up your Gemini API key, go to Settings > AI Assistant Configuration. Click "Get API Key" to visit Google AI Studio, create a new API key, and paste it in the configuration field. The system will validate the key automatically.',
    category: 'Setup',
    tags: ['api', 'gemini', 'configuration'],
  },
  {
    id: '2',
    question: 'What types of Medicare plans are available?',
    answer: 'Xyn.ai helps you compare three main types of Medicare plans: Medicare Advantage (Part C), Medicare Supplement (Medigap), and Medicare Part D (Prescription Drug Plans). Each has different benefits, costs, and coverage options.',
    category: 'Medicare Plans',
    tags: ['medicare', 'plans', 'coverage'],
  },
  {
    id: '3',
    question: 'How does the AI health assistant work?',
    answer: 'The AI assistant uses advanced language models to provide personalized Medicare guidance. It analyzes your health profile, answers questions about coverage, helps compare plans, and provides recommendations based on your specific needs and budget.',
    category: 'AI Assistant',
    tags: ['ai', 'assistant', 'guidance'],
  },
  {
    id: '4',
    question: 'Is my health information secure?',
    answer: 'Yes, your health information is encrypted and stored securely. We follow HIPAA-compliant practices and never share your data with third parties. All data is stored locally in your browser and can be exported or deleted at any time.',
    category: 'Privacy & Security',
    tags: ['privacy', 'security', 'hipaa'],
  },
  {
    id: '5',
    question: 'How do I update my health profile?',
    answer: 'Go to your Profile page and click "Edit Profile". You can add health conditions, medications, allergies, and other relevant information. The more complete your profile, the better the AI recommendations will be.',
    category: 'Profile',
    tags: ['profile', 'health', 'update'],
  },
  {
    id: '6',
    question: 'Can I compare multiple Medicare plans?',
    answer: 'Yes! In the Medicare Plans section, you can select up to 3 plans to compare side-by-side. The comparison shows premiums, deductibles, coverage details, ratings, and provider networks to help you make an informed decision.',
    category: 'Medicare Plans',
    tags: ['comparison', 'plans', 'features'],
  },
  {
    id: '7',
    question: 'What if I encounter an error or bug?',
    answer: 'If you encounter any issues, try refreshing the page first. If the problem persists, use the "Contact Support" feature in Help & Support. You can also check our error logs in the browser console (F12) for more details.',
    category: 'Troubleshooting',
    tags: ['error', 'bug', 'support'],
  },
  {
    id: '8',
    question: 'How accurate are the Medicare plan recommendations?',
    answer: 'Our recommendations are based on current Medicare plan data and your personal health profile. However, Medicare plans change annually, so we recommend verifying details directly with insurance providers before enrollment.',
    category: 'Medicare Plans',
    tags: ['accuracy', 'recommendations', 'disclaimer'],
  },
  {
    id: '9',
    question: 'Can I export my data?',
    answer: 'Yes, you can export all your data including your health profile, chat history, and preferences. Go to Settings > Data Management > Export My Data to download a JSON file with all your information.',
    category: 'Data Management',
    tags: ['export', 'data', 'backup'],
  },
  {
    id: '10',
    question: 'How do I reset my API key?',
    answer: 'To reset your API key, go to Settings > AI Assistant Configuration, clear the current API key field, and enter a new one. The system will validate the new key before saving it.',
    category: 'Setup',
    tags: ['api', 'reset', 'configuration'],
  },
];

const categories = ['All', 'Setup', 'Medicare Plans', 'AI Assistant', 'Privacy & Security', 'Profile', 'Troubleshooting', 'Data Management'];

export const FAQ: React.FC<FAQProps> = ({ searchTerm, onSearchClear, onSearchChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const searchQuery = searchTerm;

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* FAQ Results */}
      <div className="space-y-6">
        {filteredFAQs.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Frequently Asked Questions
              </h2>
              <span className="text-sm text-gray-600 font-medium">
                {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {filteredFAQs.map((item) => {
              const isExpanded = expandedItems.includes(item.id);
              
              return (
                <Card key={item.id} padding="lg" className="hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpanded(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExpanded(item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${item.id}`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {item.question}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                              {item.category}
                            </span>
                            <div className="flex gap-2">
                              {item.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        id={`faq-answer-${item.id}`}
                        className="pl-14 pt-4 border-t border-gray-100"
                      >
                        <p className="text-gray-700 leading-relaxed text-base">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </>
        ) : (
          <Card padding="lg" className="text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No FAQs found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse different categories.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  onSearchChange?.('');
                  onSearchClear?.();
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Clear Filters
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Help Section */}
      <Card padding="lg" className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-900 text-lg">
              Didn't find what you're looking for?
            </h3>
            <p className="text-blue-800 leading-relaxed">
              Our AI assistant can help answer specific questions about Medicare, your health profile, or using Xyn.ai features.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                Chat with AI Assistant
              </button>
              <button className="px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

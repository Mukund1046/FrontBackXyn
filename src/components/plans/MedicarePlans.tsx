import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../stores/useAppStore';
import { FeatureErrorBoundary } from '../error/FeatureErrorBoundary';
import { PlanCard } from './PlanCard';
import { PlanComparison } from './PlanComparison';
import { MedicarePlan } from '../../types';
import {
  Shield,
  SortAsc,
  SortDesc,
  Grid,
  List,
} from 'lucide-react';

// Mock Medicare plans data
const mockPlans: MedicarePlan[] = [
  {
    id: '1',
    name: 'Blue Cross Medicare Advantage Plus',
    type: 'advantage',
    monthlyPremium: 0,
    deductible: 200,
    coverage: {
      medical: true,
      prescription: true,
      dental: true,
      vision: true,
      hearing: true,
    },
    rating: 4.8,
    network: ['Blue Cross Network', 'Preferred Providers'],
  },
  {
    id: '2',
    name: 'Aetna Medicare Advantage',
    type: 'advantage',
    monthlyPremium: 45,
    deductible: 150,
    coverage: {
      medical: true,
      prescription: true,
      dental: false,
      vision: true,
      hearing: false,
    },
    rating: 4.6,
    network: ['Aetna Network', 'CVS Pharmacy'],
  },
  {
    id: '3',
    name: 'Humana Medicare Supplement Plan G',
    type: 'supplement',
    monthlyPremium: 120,
    deductible: 233,
    coverage: {
      medical: true,
      prescription: false,
      dental: false,
      vision: false,
      hearing: false,
    },
    rating: 4.7,
    network: ['Nationwide Network'],
  },
  {
    id: '4',
    name: 'UnitedHealthcare Medicare Advantage',
    type: 'advantage',
    monthlyPremium: 25,
    deductible: 300,
    coverage: {
      medical: true,
      prescription: true,
      dental: true,
      vision: true,
      hearing: true,
    },
    rating: 4.5,
    network: ['UnitedHealthcare Network', 'OptumRx'],
  },
  {
    id: '5',
    name: 'Cigna Medicare Part D',
    type: 'prescription',
    monthlyPremium: 35,
    deductible: 480,
    coverage: {
      medical: false,
      prescription: true,
      dental: false,
      vision: false,
      hearing: false,
    },
    rating: 4.4,
    network: ['Cigna Pharmacy Network'],
  },
];

const MedicarePlansContent: React.FC = () => {
  const { medicare, user } = useAppStore();
  const initialPlans = Array.isArray(medicare) && medicare.length > 0 ? medicare : mockPlans;
  const [plans, setPlans] = useState<MedicarePlan[]>(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState<MedicarePlan[]>(initialPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'premium' | 'name'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (Array.isArray(medicare) && medicare.length > 0) {
      setPlans(medicare);
    } else {
      setPlans(mockPlans);
    }
  }, [medicare]);

  // Filter and sort plans
  useEffect(() => {
    const filtered = plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || plan.type === selectedType;
      return matchesSearch && matchesType;
    });

    // Sort plans
    filtered.sort((a, b) => {
      let aValue: number | string, bValue: number | string;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'premium':
          aValue = a.monthlyPremium;
          bValue = b.monthlyPremium;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPlans(filtered);
  }, [plans, searchTerm, selectedType, sortBy, sortOrder, medicare]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else if (prev.length < 3) {
        return [...prev, planId];
      }
      return prev;
    });
  };

  const handleComparePlans = () => {
    setShowComparison(true);
  };

  const planTypes = [
    { value: 'all', label: 'All Plans' },
    { value: 'advantage', label: 'Medicare Advantage' },
    { value: 'supplement', label: 'Medicare Supplement' },
    { value: 'prescription', label: 'Part D (Prescription)' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'premium', label: 'Monthly Premium' },
    { value: 'name', label: 'Plan Name' },
  ];

  if (showComparison && selectedPlans.length > 0) {
    const comparisonPlans = plans.filter(plan => selectedPlans.includes(plan.id));
    return (
      <PlanComparison
        plans={comparisonPlans}
        onBack={() => setShowComparison(false)}
        onSelectPlan={(planId) => {
          // Handle plan selection logic
          console.log('Selected plan:', planId);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-h1 font-semibold text-gray-900 mb-2">
              Medicare Plans
            </h1>
            <p className="text-gray-600">
              Compare and choose the best Medicare plan for your needs
            </p>
          </div>
          
          {selectedPlans.length > 0 && (
            <Button onClick={handleComparePlans} disabled={selectedPlans.length < 2}>
              Compare {selectedPlans.length} Plan{selectedPlans.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <Card padding="md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Removed the invalid "icon" prop which Input does not support
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {planTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'premium' | 'name')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredPlans.length} of {plans.length} plans
            </p>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Plans Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              viewMode={viewMode}
              isSelected={selectedPlans.includes(plan.id)}
              onSelect={() => handlePlanSelect(plan.id)}
              userProfile={user.profile}
              onViewDetails={(planId) => console.log('View details for plan:', planId)}
            />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card padding="lg" className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-h3 font-semibold text-gray-900 mb-2">
              No plans found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Help Section */}
        <Card padding="md" className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-blue-900 mb-2">
                Need Help Choosing a Plan?
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Our AI assistant can help you find the perfect Medicare plan based on your health needs and budget.
              </p>
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const MedicarePlans: React.FC = () => {
  const { setCurrentView } = useAppStore();
  return (
    <FeatureErrorBoundary feature="dashboard" navigate={() => setCurrentView('dashboard')}>
      <MedicarePlansContent />
    </FeatureErrorBoundary>
  );
};

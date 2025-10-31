import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MedicarePlan, UserProfile } from '../../types';
import {
  Star,
  Check,
  X,
  DollarSign,
  Calendar,
  MapPin,
  Heart,
} from 'lucide-react';

interface PlanCardProps {
  plan: MedicarePlan;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
  userProfile?: UserProfile | null;
  onViewDetails?: (planId: string) => void;
}


const planTypeColors = {
  advantage: 'bg-blue-100 text-blue-800',
  supplement: 'bg-green-100 text-green-800',
  prescription: 'bg-purple-100 text-purple-800',
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  viewMode,
  isSelected,
  onSelect,
  userProfile,
  onViewDetails,
}) => {
  const typeLabels = {
    advantage: 'Medicare Advantage',
    supplement: 'Medicare Supplement',
    prescription: 'Part D (Prescription)',
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'No premium' : `$${price}/month`;
  };

  const getPlanMatchScore = () => {
    if (!userProfile) return 0;
    
    let score = 0;
    let total = 0;
    
    // Check if plan covers user's health conditions
    if (userProfile.healthConditions.length > 0) {
      total += 1;
      if (plan.coverage.medical) {
        score += 1;
      }
    }
    
    // Check if plan covers user's medications
    if (userProfile.medications.length > 0) {
      total += 1;
      if (plan.coverage.prescription) {
        score += 1;
      }
    }
    
    // Check if plan has dental coverage (common need)
    total += 1;
    if (plan.coverage.dental) {
      score += 1;
    }
    
    // Check if plan has vision coverage (common need)
    total += 1;
    if (plan.coverage.vision) {
      score += 1;
    }
    
    if (total === 0) {
      return 0;
    }
    
    return Math.round((score / total) * 100);
  };

  const matchScore = getPlanMatchScore();

  if (viewMode === 'list') {
    return (
      <Card 
        padding="md" 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}
      >
        <div
          className="flex items-center justify-between"
          onClick={onSelect}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${planTypeColors[plan.type]}`}>
                  {typeLabels[plan.type]}
                </span>
                {matchScore > 70 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-medium">{matchScore}% match</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(plan.monthlyPremium)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  ${plan.deductible} deductible
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {plan.rating}/5.0
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(plan.id);
            }}>
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      padding="md" 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={onSelect as React.MouseEventHandler<HTMLDivElement>}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${planTypeColors[plan.type]}`}>
              {typeLabels[plan.type]}
            </span>
          </div>
          
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Match Score */}
        {matchScore > 70 && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{matchScore}% match with your profile</span>
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Premium</span>
            <span className="font-semibold text-gray-900">{formatPrice(plan.monthlyPremium)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Annual Deductible</span>
            <span className="font-semibold text-gray-900">${plan.deductible}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(plan.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{plan.rating}/5.0</span>
        </div>

        {/* Coverage */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Coverage Includes:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(plan.coverage).map(([key, value]) => {
              return (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 capitalize">{key}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Network</span>
          </div>
          <div className="space-y-1">
            {plan.network.map((network, index) => (
              <span key={index} className="block text-xs text-gray-600">
                • {network}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-gray-200">
          <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(plan.id);
          }}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

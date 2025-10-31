import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MedicarePlan } from '../../types';
import {
  ArrowLeft,
  Star,
  DollarSign,
  Calendar,
  Shield,
  Check,
  X,
  Pill,
  Eye,
  Ear,
  Smile,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface PlanComparisonProps {
  plans: MedicarePlan[];
  onBack: () => void;
  onSelectPlan: (planId: string) => void;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  plans,
  onBack,
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}/month`;
  };

  const getBestValue = (field: keyof MedicarePlan) => {
    if (field === 'monthlyPremium') {
      // Lower is better
      const minValue = Math.min(...plans.map(p => p.monthlyPremium));
      return plans.find(p => p.monthlyPremium === minValue)?.id;
    } else if (field === 'rating') {
      // Higher is better
      const maxValue = Math.max(...plans.map(p => p.rating));
      return plans.find(p => p.rating === maxValue)?.id;
    } else if (field === 'deductible') {
      // Lower is better
      const minValue = Math.min(...plans.map(p => p.deductible));
      return plans.find(p => p.deductible === minValue)?.id;
    }
    return null;
  };

  const getComparisonIcon = (planId: string, field: keyof MedicarePlan) => {
    const bestValue = getBestValue(field);
    if (bestValue === planId) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (field === 'monthlyPremium' || field === 'deductible') {
      const currentValue = plans.find(p => p.id === planId)?.[field];
      const bestValueAmount = plans.find(p => p.id === bestValue)?.[field];
      if (typeof currentValue === 'number' && typeof bestValueAmount === 'number' && currentValue > bestValueAmount) {
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      }
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

const coverageFields = [
  { key: 'medical', label: 'Medical', icon: Shield },
  { key: 'prescription', label: 'Prescription', icon: Pill },
  { key: 'dental', label: 'Dental', icon: Smile },
  { key: 'vision', label: 'Vision', icon: Eye },
  { key: 'hearing', label: 'Hearing', icon: Ear },
];

  if (plans.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No plans to compare
          </h3>
          <p className="text-gray-600 mb-4">
            Please select at least two plans to compare.
          </p>
          <Button onClick={onBack}>
            Back to Plans
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Compare Plans
              </h1>
              <p className="text-gray-600">
                Side-by-side comparison of {plans.length} Medicare plans
              </p>
            </div>
          </div>
          
          {selectedPlan && (
            <Button onClick={() => onSelectPlan(selectedPlan)}>
              Select This Plan
            </Button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">
                  Plan Details
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center p-4 min-w-[200px]">
                    <Card 
                      padding="md" 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedPlan === plan.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {plan.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{plan.rating}/5</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(plan.monthlyPremium)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Monthly Premium */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Monthly Premium
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{formatPrice(plan.monthlyPremium)}</span>
                      {getComparisonIcon(plan.id, 'monthlyPremium')}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Annual Deductible */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Annual Deductible
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">${plan.deductible}</span>
                      {getComparisonIcon(plan.id, 'deductible')}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Customer Rating
                  </div>
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{plan.rating}/5.0</span>
                      {getComparisonIcon(plan.id, 'rating')}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Coverage */}
              {coverageFields.map((field) => {
                const Icon = field.icon;
                return (
                  <tr key={field.key} className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {field.label} Coverage
                      </div>
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {plan.coverage[field.key as keyof typeof plan.coverage] ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Network */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">
                  Provider Network
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="p-4">
                    <div className="space-y-1">
                      {plan.network.map((network, index) => (
                        <span key={index} className="block text-sm text-gray-600">
                          • {network}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <Card padding="md" className="bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-900">
              Comparison Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Lowest Premium</h4>
                {(() => {
                  const bestPremium = getBestValue('monthlyPremium');
                  const plan = plans.find(p => p.id === bestPremium);
                  return (
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {plan ? formatPrice(plan.monthlyPremium) : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{plan?.name}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Highest Rated</h4>
                {(() => {
                  const bestRating = getBestValue('rating');
                  const plan = plans.find(p => p.id === bestRating);
                  return (
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {plan ? `${plan.rating}/5.0` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{plan?.name}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Lowest Deductible</h4>
                {(() => {
                  const bestDeductible = getBestValue('deductible');
                  const plan = plans.find(p => p.id === bestDeductible);
                  return (
                    <div>
                      <p className="text-lg font-bold text-purple-600">
                        {plan ? `$${plan.deductible}` : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">{plan?.name}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="text-sm text-blue-800">
              <p>
                💡 <strong>Tip:</strong> Consider your expected healthcare usage when choosing between 
                low premiums with high deductibles vs. higher premiums with lower deductibles.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

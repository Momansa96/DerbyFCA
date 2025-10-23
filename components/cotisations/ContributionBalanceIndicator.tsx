import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

interface ContributionBalanceIndicatorProps {
  balance: number;
  status: 'up_to_date' | 'late' | 'very_late' | 'ahead';
  size?: 'sm' | 'md' | 'lg';
}

export default function ContributionBalanceIndicator({
  balance,
  status,
  size = 'md'
}: ContributionBalanceIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ahead':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          icon: TrendingUp,
          label: 'En avance',
        };
      case 'up_to_date':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          label: 'À jour',
        };
      case 'late':
        return {
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          icon: AlertTriangle,
          label: 'En retard',
        };
      case 'very_late':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          icon: XCircle,
          label: 'Très en retard',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${config.bgColor} ${config.borderColor} border rounded-lg font-semibold ${config.color}`}>
      <Icon size={iconSizes[size]} />
      <span>{balance >= 0 ? '+' : ''}{balance} FCFA</span>
      <span className="opacity-75">• {config.label}</span>
    </div>
  );
}
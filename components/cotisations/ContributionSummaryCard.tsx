import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContributionSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'cyan' | 'green' | 'indigo' | 'orange' | 'red';
  delay?: number;
}

export default function ContributionSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  delay = 0
}: ContributionSummaryCardProps) {
  const colorClasses = {
    cyan: {
      from: 'from-cyan-500/10',
      to: 'to-cyan-600/5',
      border: 'border-cyan-500/20',
      icon: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      value: 'text-cyan-400'
    },
    green: {
      from: 'from-green-500/10',
      to: 'to-green-600/5',
      border: 'border-green-500/20',
      icon: 'text-green-400',
      bg: 'bg-green-500/20',
      value: 'text-green-400'
    },
    indigo: {
      from: 'from-indigo-500/10',
      to: 'to-indigo-600/5',
      border: 'border-indigo-500/20',
      icon: 'text-indigo-400',
      bg: 'bg-indigo-500/20',
      value: 'text-indigo-400'
    },
    orange: {
      from: 'from-orange-500/10',
      to: 'to-orange-600/5',
      border: 'border-orange-500/20',
      icon: 'text-orange-400',
      bg: 'bg-orange-500/20',
      value: 'text-orange-400'
    },
    red: {
      from: 'from-red-500/10',
      to: 'to-red-600/5',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      bg: 'bg-red-500/20',
      value: 'text-red-400'
    }
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${classes.from} ${classes.to} border ${classes.border} rounded-xl p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${classes.value}`}>{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${classes.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
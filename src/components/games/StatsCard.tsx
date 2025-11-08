import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from '../../icons/lucide-adapter';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient?: string;
}

export const StatsCard: React.FC<Props> = ({ 
  icon: Icon, 
  label, 
  value,
  gradient = 'from-primary-500 to-blue-500'
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg border border-white/20`}
  >
    <Icon className="w-8 h-8 text-white/90 mb-3" />
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-white/80 font-medium">{label}</p>
  </motion.div>
);

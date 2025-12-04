import React from 'react';
import { Recommendation } from '../types';
import { CheckCircle, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggle: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onToggle }) => {
  return (
    <div className={`
      relative p-5 rounded-xl border transition-all duration-300
      ${recommendation.implemented 
        ? 'bg-emerald-900/20 border-emerald-500/50' 
        : 'bg-slate-800 border-slate-700 hover:border-blue-500/50'}
    `}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {recommendation.implemented ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <h4 className="font-semibold text-slate-100">{recommendation.title}</h4>
        </div>
        <button
          onClick={() => onToggle(recommendation.id)}
          className={`
            text-xs font-medium px-3 py-1.5 rounded-full transition-colors flex items-center gap-1
            ${recommendation.implemented 
              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' 
              : 'bg-blue-600 text-white hover:bg-blue-500'}
          `}
        >
          {recommendation.implemented ? 'Applied' : 'Apply Fix'}
          {!recommendation.implemented && <ArrowRight className="w-3 h-3" />}
        </button>
      </div>
      
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        {recommendation.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg">
        <Zap className="w-3.5 h-3.5 text-yellow-400" />
        <span className="font-medium text-slate-400">Impact:</span>
        <span>{recommendation.impact}</span>
      </div>
    </div>
  );
};

export default RecommendationCard;
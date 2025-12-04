import React, { useState, useEffect } from 'react';
import { ScenarioData, Recommendation } from '../types';
import MetricChart from './MetricChart';
import RecommendationCard from './RecommendationCard';
import { Server, Activity, AlertOctagon, Layers } from 'lucide-react';

interface ScenarioViewProps {
  scenario: ScenarioData;
}

const ScenarioView: React.FC<ScenarioViewProps> = ({ scenario }) => {
  const [activeRecs, setActiveRecs] = useState<Set<string>>(new Set());
  
  // Reset state when scenario changes
  useEffect(() => {
    setActiveRecs(new Set());
  }, [scenario.id]);

  const toggleRecommendation = (id: string) => {
    const newRecs = new Set(activeRecs);
    if (newRecs.has(id)) {
      newRecs.delete(id);
    } else {
      newRecs.add(id);
    }
    setActiveRecs(newRecs);
  };

  const isOptimized = activeRecs.size > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            {scenario.id === 'serverless' ? <Server className="text-orange-500" /> : <Layers className="text-blue-500" />}
            {scenario.title}
          </h2>
          <p className="text-slate-400 max-w-2xl">{scenario.description}</p>
        </div>
        <div className="flex gap-2">
           {scenario.techStack.map(tech => (
             <span key={tech} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-mono">
               {tech}
             </span>
           ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(scenario.metrics).map(([key, metric]) => {
          // Explicitly type metric to avoid 'unknown' type error in strict mode
          const m = metric as ScenarioData['metrics'][string];
          return (
            <MetricChart
              key={key}
              title={m.label}
              data={m.data}
              dataKey="value"
              unit={m.unit}
              showOptimized={isOptimized}
              color={key === 'latency' || key === 'dnsErrors' ? '#ef4444' : '#3b82f6'} // Red for bad stuff
              type={key === 'memory' ? 'area' : 'line'}
            />
          );
        })}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Observations Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-semibold text-white">Observations</h3>
          </div>
          {scenario.observations.map(obs => (
            <div key={obs.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-medium text-slate-200">{obs.title}</h4>
                 <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider
                   ${obs.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                 `}>
                   {obs.severity}
                 </span>
               </div>
               <p className="text-sm text-slate-400">{obs.description}</p>
            </div>
          ))}
        </div>

        {/* Recommendations Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Mitigation Strategies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.recommendations.map(rec => (
              <RecommendationCard 
                key={rec.id} 
                recommendation={{...rec, implemented: activeRecs.has(rec.id)}} 
                onToggle={toggleRecommendation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioView;
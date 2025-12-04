import React, { useState } from 'react';
import { SCENARIOS } from './constants';
import { ScenarioType } from './types';
import ScenarioView from './components/ScenarioView';
import ChatAssistant from './components/ChatAssistant';
import { LayoutDashboard, Server, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>(ScenarioType.SERVERLESS);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex-shrink-0 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            InfraInsight
          </h1>
          <p className="text-xs text-slate-500 mt-1">Architecture Optimization</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Scenarios
          </div>
          
          <button
            onClick={() => setActiveScenario(ScenarioType.SERVERLESS)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
              ${activeScenario === ScenarioType.SERVERLESS 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
            `}
          >
            <Server className="w-4 h-4" />
            Student Management
          </button>

          <button
            onClick={() => setActiveScenario(ScenarioType.KUBERNETES)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
              ${activeScenario === ScenarioType.KUBERNETES 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
            `}
          >
            <Layers className="w-4 h-4" />
            Voting Application
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500" />
            <div>
              <div className="text-sm font-medium text-white">DevOps Team</div>
              <div className="text-xs text-slate-500">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-950 border-b border-slate-800 z-20 p-4 flex justify-between items-center">
        <h1 className="font-bold text-blue-400">InfraInsight</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveScenario(ScenarioType.SERVERLESS)}
            className={`p-2 rounded ${activeScenario === ScenarioType.SERVERLESS ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
          >
            <Server className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveScenario(ScenarioType.KUBERNETES)}
            className={`p-2 rounded ${activeScenario === ScenarioType.KUBERNETES ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pt-20 md:pt-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8 flex items-center gap-2 text-slate-400 text-sm">
             <LayoutDashboard className="w-4 h-4" />
             <span>Dashboard</span>
             <span>/</span>
             <span className="text-white capitalize">{activeScenario}</span>
          </div>

          <ScenarioView scenario={SCENARIOS[activeScenario]} />
        </div>
      </main>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};

export default App;
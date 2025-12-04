import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { MetricPoint } from '../types';

interface MetricChartProps {
  title: string;
  data: MetricPoint[];
  dataKey: string;
  unit: string;
  showOptimized: boolean;
  color?: string;
  type?: 'line' | 'area';
}

const MetricChart: React.FC<MetricChartProps> = ({ 
  title, 
  data, 
  dataKey, 
  unit, 
  showOptimized,
  color = "#3b82f6",
  type = 'line'
}) => {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
      <h3 className="text-slate-200 font-medium mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickFormatter={(value) => `${value}${unit}`}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <DataComponent
              type="monotone"
              dataKey="value"
              name="Current State"
              stroke={color}
              fill={type === 'area' ? `${color}40` : undefined}
              strokeWidth={2}
              dot={false}
            />
            {showOptimized && (
              <DataComponent
                type="monotone"
                dataKey="optimizedValue"
                name="Optimized"
                stroke="#10b981"
                fill={type === 'area' ? "#10b98140" : undefined}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricChart;
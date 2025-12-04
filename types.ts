export enum ScenarioType {
  SERVERLESS = 'serverless',
  KUBERNETES = 'kubernetes',
}

export interface MetricPoint {
  time: string;
  value: number;
  optimizedValue?: number;
}

export interface Observation {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  metricKey: string;
}

export interface Recommendation {
  id: string;
  observationId: string;
  title: string;
  description: string;
  impact: string;
  implemented: boolean;
}

export interface ScenarioData {
  id: ScenarioType;
  title: string;
  description: string;
  techStack: string[];
  metrics: {
    [key: string]: {
      label: string;
      unit: string;
      data: MetricPoint[];
    };
  };
  observations: Observation[];
  recommendations: Recommendation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
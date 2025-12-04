import { MetricPoint, Observation, Recommendation, ScenarioData, ScenarioType } from './types';

// Helper to generate mock time series data
const generateTimeSeries = (
  points: number, 
  base: number, 
  variance: number, 
  trend: number = 0, 
  spikeIndex: number = -1,
  timeUnit: string = 's'
): MetricPoint[] => {
  return Array.from({ length: points }, (_, i) => {
    let val = base + Math.random() * variance + (i * trend);
    // Simulate a spike
    if (i === spikeIndex) val += base * 2;
    // Cap at reasonable limits
    val = Math.max(0, val);
    
    // Optimized value usually lower and smoother
    const optVal = Math.max(0, val * 0.4 + (Math.random() * variance * 0.2));

    return {
      time: `${i}${timeUnit}`,
      value: Number(val.toFixed(1)),
      optimizedValue: Number(optVal.toFixed(1)),
    };
  });
};

const serverlessMetrics = {
  latency: {
    label: 'Cold Start Latency',
    unit: 'ms',
    data: generateTimeSeries(20, 100, 50, 0, 0, 's').map((d, i) => {
        // Cold start spike at beginning
        if(i === 0) return { ...d, value: 980, optimizedValue: 150 }; 
        // Subsequent calls lower but still fluctuating
        return { ...d, value: 200 + Math.random() * 50, optimizedValue: 50 + Math.random() * 10 };
    })
  },
  memory: {
    label: 'Memory Utilization',
    unit: '%',
    data: generateTimeSeries(20, 95, 5, 0, -1, 'h').map(d => ({ ...d, value: Math.min(100, d.value), optimizedValue: 40 }))
  },
  errors: {
    label: 'Error Rate (5XX)',
    unit: ' count',
    data: generateTimeSeries(20, 0, 0, 0, -1, 'h').map((d, i) => {
        // Errors during bulk insert simulation
        if (i > 10 && i < 15) return { ...d, value: 3, optimizedValue: 0 };
        return { ...d, value: 0, optimizedValue: 0 };
    })
  }
};

const k8sMetrics = {
  dnsErrors: {
    label: 'NXDOMAIN Errors',
    unit: '%',
    data: generateTimeSeries(20, 75, 10, 0, -1, 'h').map(d => ({ ...d, value: Math.min(100, d.value), optimizedValue: 2 }))
  },
  memory: {
    label: 'Memory Usage',
    unit: 'MB',
    data: generateTimeSeries(20, 2048, 100, 0, -1, 'h').map(d => ({ ...d, value: 500, optimizedValue: 2048 })) // Underutilization: Used 500, Provisioned 2048. Opt: Used 500, Provisioned ~600
  }
};

export const SCENARIOS: Record<ScenarioType, ScenarioData> = {
  [ScenarioType.SERVERLESS]: {
    id: ScenarioType.SERVERLESS,
    title: 'Student Management App',
    description: 'Serverless architecture on AWS handling student records and bulk operations.',
    techStack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'n8n'],
    metrics: serverlessMetrics,
    observations: [
      {
        id: 'obs-1',
        title: 'High Cold Start Latency',
        description: '980ms latency observed on first invocation due to initialization overhead.',
        severity: 'high',
        metricKey: 'latency'
      },
      {
        id: 'obs-2',
        title: 'Memory Saturation',
        description: 'Lambda functions consistently hitting 100% memory utilization during load.',
        severity: 'high',
        metricKey: 'memory'
      },
      {
        id: 'obs-3',
        title: 'Integration Timeouts',
        description: 'API Gateway 5XX errors during bulk data insertion of 1000 records.',
        severity: 'medium',
        metricKey: 'errors'
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        observationId: 'obs-1',
        title: 'Enable SnapStart',
        description: 'Implement Lambda SnapStart to cache initialized execution environments, drastically reducing cold start latency.',
        impact: 'Reduces latency by ~90%',
        implemented: false
      },
      {
        id: 'rec-2',
        observationId: 'obs-2',
        title: 'Scale Lambda Memory',
        description: 'Increase memory allocation. In Lambda, this proportionally increases CPU power, resolving bottlenecks.',
        impact: 'Eliminates OOM errors',
        implemented: false
      },
      {
        id: 'rec-3',
        observationId: 'obs-3',
        title: 'Async Processing',
        description: 'Decouple bulk inserts using SQS/EventBridge to prevent API Gateway timeouts.',
        impact: '100% Reliability on Bulk Ops',
        implemented: false
      }
    ]
  },
  [ScenarioType.KUBERNETES]: {
    id: ScenarioType.KUBERNETES,
    title: 'Voting Application',
    description: 'Microservices deployed on Kubernetes (EKS/EC2) with Prometheus monitoring.',
    techStack: ['Kubernetes', 'EC2', 'Prometheus', 'Grafana', 'CoreDNS'],
    metrics: k8sMetrics,
    observations: [
      {
        id: 'obs-k1',
        title: 'High DNS Failure Rate',
        description: '79% of internal requests failing with NXDOMAIN due to CoreDNS congestion.',
        severity: 'high',
        metricKey: 'dnsErrors'
      },
      {
        id: 'obs-k2',
        title: 'Resource Waste',
        description: 'Memory allocation is significantly higher than actual usage patterns.',
        severity: 'low',
        metricKey: 'memory'
      }
    ],
    recommendations: [
      {
        id: 'rec-k1',
        observationId: 'obs-k1',
        title: 'Scale CoreDNS',
        description: 'Increase the replica count of CoreDNS pods and enable autoscale to handle internal service discovery traffic.',
        impact: 'Reduces NXDOMAIN to <1%',
        implemented: false
      },
      {
        id: 'rec-k2',
        observationId: 'obs-k2',
        title: 'Right-Size Nodes',
        description: 'Reduce requested resources for pods and switch to smaller EC2 instance types to save costs.',
        impact: 'Reduces Cost by 40%',
        implemented: false
      }
    ]
  }
};

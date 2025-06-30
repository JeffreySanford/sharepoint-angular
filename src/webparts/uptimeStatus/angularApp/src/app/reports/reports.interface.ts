export interface SystemHealth {
  serverUptime: number;
  serverStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastServerUpdate: Date;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage: {
    current: number;
    average: number;
    peak: number;
  };
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  networkStats: {
    incoming: number;
    outgoing: number;
    totalRequests: number;
    activeConnections: number;
  };
  serviceStatus: {
    database: 'healthy' | 'warning' | 'critical';
    cache: 'healthy' | 'warning' | 'critical';
    messaging: 'healthy' | 'warning' | 'critical';
    storage: 'healthy' | 'warning' | 'critical';
    authentication: 'healthy' | 'warning' | 'critical';
  };
}

export interface SafeMetrics {
  sprintData: {
    currentSprint: number;
    totalSprints: number;
    sprintGoal: string;
    sprintProgress: number;
  };
  velocityData: {
    labels: string[];
    completed: number[];
    planned: number[];
  };
  burndownData: {
    labels: string[];
    ideal: number[];
    actual: number[];
  };
  defectData: {
    labels: string[];
    found: number[];
    resolved: number[];
  };
  testData: {
    labels: string[];
    passed: number[];
    failed: number[];
    coverage: number[];
  };
  cumulativeFlowData: {
    labels: string[];
    backlog: number[];
    inProgress: number[];
    done: number[];
  };
  leadTimeData: {
    labels: string[];
    leadTime: number[];
    cycleTime: number[];
  };
}

export interface ChartDataPoint {
  labels: string[];
  datasets: {
    data: number[];
    label: string;
    borderColor?: string | string[];
    backgroundColor?: string | string[];
    fill?: boolean;
    tension?: number;
    borderDash?: number[];
  }[];
}

export interface ReportsData {
  systemHealth: SystemHealth;
  safeMetrics: SafeMetrics;
  chartConfigurations: {
    serverUptime: ChartDataPoint;
    memoryUsage: ChartDataPoint;
    cpuUsage: ChartDataPoint;
    networkTraffic: ChartDataPoint;
    velocity: ChartDataPoint;
    burndown: ChartDataPoint;
    defects: ChartDataPoint;
    testing: ChartDataPoint;
    cumulativeFlow: ChartDataPoint;
    leadTime: ChartDataPoint;
  };
  lastUpdated: Date;
}

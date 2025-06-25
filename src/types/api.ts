
export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  gas: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  message: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  type: 'temperature' | 'humidity' | 'soil' | 'gas';
  timestamp: string;
  location: string;
  resolved: boolean;
}

export interface HistoryData {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  gas: number;
  location: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

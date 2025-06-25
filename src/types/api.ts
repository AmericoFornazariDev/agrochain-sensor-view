
export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  gas: number;
  smoke: number;
  luminosity: number;
  atmosphericPressure: number;
  co2: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  message: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  type: 'temperature' | 'humidity' | 'soil' | 'gas' | 'smoke' | 'luminosity' | 'pressure' | 'co2';
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
  smoke: number;
  luminosity: number;
  atmosphericPressure: number;
  co2: number;
  location: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

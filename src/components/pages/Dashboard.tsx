
import { useEffect, useState } from 'react';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { SensorChart } from '@/components/dashboard/SensorChart';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplet, Wind, AlertTriangle } from 'lucide-react';

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  gas: number;
  timestamp: string;
}

interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartData, setChartData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated API calls - replace with actual API endpoints
        const dataResponse = await fetch('/api/data');
        const alertsResponse = await fetch('/api/alerts');
        
        // For demo purposes, using mock data
        const mockData: SensorData = {
          temperature: 24.5,
          humidity: 65,
          soilMoisture: 78,
          gas: 342,
          timestamp: new Date().toISOString(),
        };
        
        const mockAlerts: Alert[] = [
          {
            id: '1',
            message: 'Temperatura acima do limite recomendado',
            severity: 'high',
            timestamp: new Date().toISOString(),
          },
        ];
        
        setSensorData(mockData);
        setAlerts(mockAlerts);
        setChartData(Array.from({ length: 10 }, (_, i) => ({
          ...mockData,
          temperature: mockData.temperature + Math.random() * 5 - 2.5,
          humidity: mockData.humidity + Math.random() * 10 - 5,
          timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
        })));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'high');

  return (
    <div className="space-y-6 animate-fade-in">
      {criticalAlerts.length > 0 && (
        <AlertBanner alerts={criticalAlerts} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard
          title="Temperatura"
          value={sensorData?.temperature || 0}
          unit="°C"
          icon={Thermometer}
          trend="up"
          className="hover:scale-105 transition-transform duration-200"
        />
        <SensorCard
          title="Humidade do Ar"
          value={sensorData?.humidity || 0}
          unit="%"
          icon={Droplet}
          trend="stable"
          className="hover:scale-105 transition-transform duration-200"
        />
        <SensorCard
          title="Humidade do Solo"
          value={sensorData?.soilMoisture || 0}
          unit="%"
          icon={Wind}
          trend="down"
          className="hover:scale-105 transition-transform duration-200"
        />
        <SensorCard
          title="Gás"
          value={sensorData?.gas || 0}
          unit="ppm"
          icon={AlertTriangle}
          trend="up"
          className="hover:scale-105 transition-transform duration-200"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorChart
          title="Temperatura"
          data={chartData}
          dataKey="temperature"
          color="#10b981"
          unit="°C"
        />
        <SensorChart
          title="Humidade"
          data={chartData}
          dataKey="humidity"
          color="#3b82f6"
          unit="%"
        />
      </div>
    </div>
  );
}

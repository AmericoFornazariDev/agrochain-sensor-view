
import { useEffect, useState } from 'react';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { SensorChart } from '@/components/dashboard/SensorChart';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplet, Wind, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/utils/api';
import { SensorData, Alert, ApiResponse } from '@/types/api';

export function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartData, setChartData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current sensor data
        const sensorResponse = await apiClient.get<ApiResponse<SensorData>>('/sensors/current');
        if (sensorResponse.success) {
          setSensorData(sensorResponse.data);
        }

        // Fetch alerts
        const alertsResponse = await apiClient.get<ApiResponse<Alert[]>>('/alerts');
        if (alertsResponse.success) {
          setAlerts(alertsResponse.data);
        }

        // Fetch historical data for charts (last 10 readings)
        const historyResponse = await apiClient.get<ApiResponse<SensorData[]>>('/sensors/history?limit=10');
        if (historyResponse.success) {
          setChartData(historyResponse.data);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erro ao carregar dados do dashboard. Verifique a conexão com a API.');
      } finally {
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

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'high' && !alert.resolved);

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

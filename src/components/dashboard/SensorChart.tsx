
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  unit: string;
}

export function SensorChart({ title, data, dataKey, color, unit }: SensorChartProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription>
          Dados dos últimos 10 minutos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              className="text-xs"
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number) => [`${value} ${unit}`, title]}
              labelFormatter={(value) => new Date(value).toLocaleString('pt-BR')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

export function SensorCard({ title, value, unit, icon: Icon, trend, className }: SensorCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {unit}
            </p>
          </div>
          
          <Badge variant="secondary" className={cn("flex items-center gap-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-xs font-medium">
              {trend === 'stable' ? 'Estável' : trend === 'up' ? 'Subindo' : 'Descendo'}
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

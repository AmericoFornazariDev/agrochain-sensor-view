
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface AlertData {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface AlertBannerProps {
  alerts: AlertData[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert) => (
        <Alert key={alert.id} className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-800 dark:text-red-200 font-medium">
              {alert.message}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed([...dismissed, alert.id])}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, AlertCircle, Info, Eye, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  message: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  type: 'temperature' | 'humidity' | 'soil' | 'gas';
  timestamp: string;
  location: string;
  resolved: boolean;
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all',
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Mock data for demonstration
        const mockAlerts: Alert[] = [
          {
            id: '1',
            message: 'Temperatura crítica detectada',
            description: 'A temperatura no Campo A atingiu 35°C, ultrapassando o limite máximo recomendado de 30°C. Recomenda-se verificar o sistema de irrigação e ventilação.',
            severity: 'high',
            type: 'temperature',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            location: 'Campo A',
            resolved: false,
          },
          {
            id: '2',
            message: 'Humidade do solo baixa',
            description: 'A humidade do solo no Campo B está em 25%, abaixo do recomendado (40-60%). Sistema de irrigação deve ser ativado.',
            severity: 'medium',
            type: 'soil',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            location: 'Campo B',
            resolved: false,
          },
          {
            id: '3',
            message: 'Nível de gás elevado',
            description: 'Detectados 450ppm de gases no Campo C. Verificar possível vazamento ou fermentação excessiva.',
            severity: 'high',
            type: 'gas',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            location: 'Campo C',
            resolved: true,
          },
          {
            id: '4',
            message: 'Humidade relativa alta',
            description: 'Humidade do ar em 85% no Campo A. Risco de desenvolvimento de fungos.',
            severity: 'medium',
            type: 'humidity',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            location: 'Campo A',
            resolved: false,
          },
        ];
        
        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const applyFilters = () => {
    let filtered = alerts;

    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }

    if (filters.status !== 'all') {
      const resolved = filters.status === 'resolved';
      filtered = filtered.filter(alert => alert.resolved === resolved);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Crítico';
      case 'medium':
        return 'Médio';
      default:
        return 'Baixo';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Alertas
          </CardTitle>
          <CardDescription>
            Filtre os alertas por gravidade, tipo ou status
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gravidade</label>
              <Select
                value={filters.severity}
                onValueChange={(value) => setFilters({ ...filters, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="high">Crítico</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="temperature">Temperatura</SelectItem>
                  <SelectItem value="humidity">Humidade</SelectItem>
                  <SelectItem value="soil">Solo</SelectItem>
                  <SelectItem value="gas">Gás</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={cn(
              "border-0 shadow-lg transition-all duration-200 hover:shadow-xl",
              alert.resolved 
                ? "bg-gray-50 dark:bg-gray-800/50 opacity-75" 
                : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{alert.message}</h3>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            Resolvido
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground user>
                        <span>{new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                        <span>•</span>
                        <span>{alert.location}</span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {alert.description.substring(0, 120)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {getSeverityLabel(alert.severity)}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          Ver detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getSeverityIcon(alert.severity)}
                            {alert.message}
                          </DialogTitle>
                          <DialogDescription>
                            <div className="space-y-2 mt-4">
                              <div className="flex items-center gap-4 text-sm">
                                <span><strong>Data:</strong> {new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                                <span><strong>Local:</strong> {alert.location}</span>
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {getSeverityLabel(alert.severity)}
                                </Badge>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Descrição detalhada:</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-6">
                          {!alert.resolved && (
                            <Button className="bg-green-600 hover:bg-green-700">
                              Marcar como Resolvido
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {filteredAlerts.length === 0 && !loading && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum alerta encontrado</h3>
            <p className="text-muted-foreground">
              Não há alertas que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

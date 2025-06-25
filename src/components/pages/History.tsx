import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { apiClient } from '@/utils/api';
import { HistoryData, ApiResponse } from '@/types/api';

export function History() {
  const [data, setData] = useState<HistoryData[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    sensor: 'all',
    location: 'all',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<ApiResponse<HistoryData[]>>('/sensors/history');
        if (response.success) {
          setData(response.data);
          setFilteredData(response.data);
        } else {
          setError(response.message || 'Erro ao carregar histórico');
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
        setError('Erro ao conectar com a API. Verifique a conexão.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (filters.location !== 'all') {
        params.append('location', filters.location);
      }
      
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom.toISOString());
      }
      
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo.toISOString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/sensors/history?${queryString}` : '/sensors/history';
      
      const response = await apiClient.get<ApiResponse<HistoryData[]>>(endpoint);
      if (response.success) {
        setFilteredData(response.data);
      } else {
        setError(response.message || 'Erro ao filtrar dados');
      }
    } catch (error) {
      console.error('Error filtering history data:', error);
      setError('Erro ao aplicar filtros.');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await apiClient.get<ApiResponse<HistoryData[]>>('/sensors/history/export');
      if (response.success) {
        // Convert data to CSV
        const csvContent = [
          ['Data/Hora', 'Localização', 'Temperatura (°C)', 'Humidade (%)', 'Solo (%)', 'Gás (ppm)', 'Fumaça (ppm)', 'Luminosidade (lx)', 'Pressão (hPa)', 'CO₂ (ppm)'],
          ...response.data.map(item => [
            new Date(item.timestamp).toLocaleString('pt-BR'),
            item.location,
            item.temperature.toFixed(1),
            item.humidity.toFixed(1),
            item.soilMoisture.toFixed(1),
            item.gas.toFixed(0),
            item.smoke.toFixed(0),
            item.luminosity.toFixed(0),
            item.atmosphericPressure.toFixed(1),
            item.co2.toFixed(0)
          ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico-sensores-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtre os dados históricos por período, sensor ou localização
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Campo A">Campo A</SelectItem>
                  <SelectItem value="Campo B">Campo B</SelectItem>
                  <SelectItem value="Campo C">Campo C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Histórico de Dados</CardTitle>
              <CardDescription>
                {filteredData.length} registros encontrados
              </CardDescription>
            </div>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold">Data/Hora</th>
                  <th className="text-left p-3 font-semibold">Localização</th>
                  <th className="text-left p-3 font-semibold">Temperatura (°C)</th>
                  <th className="text-left p-3 font-semibold">Humidade (%)</th>
                  <th className="text-left p-3 font-semibold">Solo (%)</th>
                  <th className="text-left p-3 font-semibold">Gás (ppm)</th>
                  <th className="text-left p-3 font-semibold">Fumaça (ppm)</th>
                  <th className="text-left p-3 font-semibold">Luminosidade (lx)</th>
                  <th className="text-left p-3 font-semibold">Pressão (hPa)</th>
                  <th className="text-left p-3 font-semibold">CO₂ (ppm)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-3 text-sm">
                        {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                          {item.location}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{item.temperature.toFixed(1)}</td>
                      <td className="p-3 font-mono">{item.humidity.toFixed(1)}</td>
                      <td className="p-3 font-mono">{item.soilMoisture.toFixed(1)}</td>
                      <td className="p-3 font-mono">{item.gas.toFixed(0)}</td>
                      <td className="p-3 font-mono">{item.smoke.toFixed(0)}</td>
                      <td className="p-3 font-mono">{item.luminosity.toFixed(0)}</td>
                      <td className="p-3 font-mono">{item.atmosphericPressure.toFixed(1)}</td>
                      <td className="p-3 font-mono">{item.co2.toFixed(0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, Globe, Database, Shield } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerir as configurações do sistema AgroChain
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalizar a aparência da aplicação
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Tema</Label>
                <div className="text-sm text-muted-foreground">
                  Escolher entre modo claro, escuro ou automático
                </div>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Idioma</Label>
                <div className="text-sm text-muted-foreground">
                  Selecionar o idioma da interface
                </div>
              </div>
              <Select defaultValue="pt">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configurar alertas e notificações do sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alertas de Temperatura</Label>
                <div className="text-sm text-muted-foreground">
                  Receber alertas quando a temperatura ultrapassar os limites
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alertas de Humidade</Label>
                <div className="text-sm text-muted-foreground">
                  Notificações para níveis críticos de humidade
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">E-mail de Alertas</Label>
                <div className="text-sm text-muted-foreground">
                  Enviar alertas críticos por e-mail
                </div>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail para Alertas</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configurações de sistema e conectividade
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL da API</Label>
              <Input
                id="api-url"
                placeholder="https://api.agrochain.com"
                className="max-w-sm"
              />
              <div className="text-sm text-muted-foreground">
                Endereço base da API para comunicação com os sensores
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="refresh-rate">Taxa de Atualização (segundos)</Label>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="300">5 minutos</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Frequência de atualização dos dados dos sensores
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo de Desenvolvimento</Label>
                <div className="text-sm text-muted-foreground">
                  Ativar logs detalhados e dados de teste
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e acesso
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Autenticação de Dois Fatores</Label>
                <div className="text-sm text-muted-foreground">
                  Adicionar uma camada extra de segurança
                </div>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
              <Select defaultValue="60">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button variant="outline">
                Alterar Palavra-passe
              </Button>
              <Button variant="outline">
                Logs de Acesso
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">
            Restaurar Padrões
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            Guardar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}

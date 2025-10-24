import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  BarChart3, 
  Building, 
  Package, 
  Monitor,
  Bell,
  Wifi,
  Webhook
} from 'lucide-react';

const Settings = () => {
  const settingsSections = [
    {
      title: 'Configurações Gerais',
      icon: SettingsIcon,
      items: [
        { name: 'Serviços', description: 'Gerencie os serviços oferecidos' },
        { name: 'Cargos', description: 'Configure os cargos da equipe' },
        { name: 'Equipe', description: 'Gerencie membros da equipe' },
        { name: 'Cronograma', description: 'Configure horários de funcionamento' },
        { name: 'Recursos', description: 'Gerencie recursos disponíveis' },
        { name: 'Calendário de agendamentos', description: 'Configurações do calendário' },
      ]
    },
    {
      title: 'Financeiro',
      icon: DollarSign,
      items: [
        { name: 'Pagamento online', description: 'Configure métodos de pagamento' },
        { name: 'Checkout', description: 'Configurações do processo de pagamento' },
        { name: 'Recibos', description: 'Configurações de recibos e faturas' },
      ]
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      items: [
        { name: 'Retenção', description: 'Relatórios de retenção de clientes' },
      ]
    },
    {
      title: 'Meu negócio',
      icon: Building,
      items: [
        { name: 'Configurações', description: 'Informações básicas do negócio' },
        { name: 'Informações', description: 'Dados de contato e localização' },
      ]
    },
    {
      title: 'Categorias',
      icon: Package,
      items: [
        { name: 'Agendamento', description: 'Categorias de agendamentos' },
        { name: 'Eventos', description: 'Tipos de eventos' },
        { name: 'Categorias de Clientes', description: 'Segmentação de clientes' },
      ]
    },
    {
      title: 'Inventário',
      icon: Package,
      items: [
        { name: 'Configurações', description: 'Configurações do inventário' },
      ]
    },
    {
      title: 'Configurações do sistema',
      icon: Monitor,
      items: [
        { name: 'Notificações', description: 'Configurações de notificações' },
        { name: 'Redes', description: 'Integrações com redes sociais' },
        { name: 'Webhook', description: 'Configurações de webhooks' },
      ]
    }
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie as configurações do seu sistema
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <section.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {section.items.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 text-xs sm:text-sm">
                    Configurar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Configurações Rápidas
          </CardTitle>
          <CardDescription>
            Configurações mais utilizadas para acesso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificações por email</Label>
                  <div className="text-sm text-muted-foreground">
                    Receba notificações de novos agendamentos
                  </div>
                </div>
                <Switch id="notifications" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-confirm">Confirmação automática</Label>
                  <div className="text-sm text-muted-foreground">
                    Confirmar agendamentos automaticamente
                  </div>
                </div>
                <Switch id="auto-confirm" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders">Lembretes</Label>
                  <div className="text-sm text-muted-foreground">
                    Enviar lembretes aos clientes
                  </div>
                </div>
                <Switch id="reminders" defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome do negócio</Label>
                <Input 
                  id="business-name" 
                  placeholder="Seu negócio"
                  defaultValue="Consultório Médico" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-email">Email de contato</Label>
                <Input 
                  id="business-email" 
                  type="email"
                  placeholder="contato@seunegocio.com"
                  defaultValue="contato@consultorio.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-phone">Telefone</Label>
                <Input 
                  id="business-phone" 
                  placeholder="(11) 99999-9999"
                  defaultValue="(11) 99999-9999" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  UserX,
  Activity,
  Server,
  Database,
  Shield,
  Settings,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { FormTemplateBuilder } from '@/components/FormTemplateBuilder';

const Admin = () => {
  // Mock data
  const systemStats = {
    totalUsers: 156,
    activeUsers: 134,
    totalAppointments: 2847,
    systemUptime: '99.9%',
    dbSize: '2.3 GB',
    avgResponseTime: '120ms'
  };

  const recentActivities = [
    { id: 1, user: 'João Silva', action: 'Criou agendamento', time: '2 min atrás', type: 'create' },
    { id: 2, user: 'Maria Santos', action: 'Cancelou agendamento', time: '5 min atrás', type: 'cancel' },
    { id: 3, user: 'Pedro Costa', action: 'Atualizou perfil', time: '10 min atrás', type: 'update' },
    { id: 4, user: 'Ana Silva', action: 'Fez login', time: '15 min atrás', type: 'login' },
  ];

  const professionals = [
    { id: 1, name: 'Dr. João Silva', specialization: 'Cardiologia', status: 'ativo', appointments: 45 },
    { id: 2, name: 'Dra. Maria Santos', specialization: 'Dermatologia', status: 'ativo', appointments: 38 },
    { id: 3, name: 'Dr. Pedro Costa', specialization: 'Ortopedia', status: 'inativo', appointments: 0 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'cancel': return <UserX className="h-4 w-4 text-red-500" />;
      case 'update': return <Settings className="h-4 w-4 text-blue-500" />;
      case 'login': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie todo o sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Sistema Online
          </Badge>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Logs de Segurança
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((systemStats.activeUsers / systemStats.totalUsers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Total histórico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Fichas</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Últimas ações realizadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.user}</div>
                        <div className="text-xs text-muted-foreground">{activity.action}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance do Sistema
                </CardTitle>
                <CardDescription>
                  Métricas de performance em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uso de CPU</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uso de Memória</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Armazenamento</span>
                    <span>38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">{systemStats.dbSize}</div>
                    <div className="text-xs text-muted-foreground">Tamanho do BD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{systemStats.avgResponseTime}</div>
                    <div className="text-xs text-muted-foreground">Tempo médio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Profissionais Cadastrados
              </CardTitle>
              <CardDescription>
                Gerencie os profissionais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {professionals.map((professional) => (
                  <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{professional.name}</div>
                        <div className="text-sm text-muted-foreground">{professional.specialization}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{professional.appointments} agendamentos</div>
                        <Badge 
                          variant={professional.status === 'ativo' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {professional.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        Gerenciar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <FormTemplateBuilder />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Banco de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Tamanho total</span>
                  <span className="text-sm font-medium">{systemStats.dbSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conexões ativas</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Último backup</span>
                  <span className="text-sm font-medium">Hoje às 03:00</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Gerenciar Banco
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Servidor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="default" className="text-green-600 bg-green-100">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">{systemStats.systemUptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Região</span>
                  <span className="text-sm font-medium">São Paulo, BR</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Server className="h-4 w-4 mr-2" />
                  Monitorar Servidor
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alertas de Segurança
              </CardTitle>
              <CardDescription>
                Monitore atividades suspeitas e alertas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Tentativa de login suspeita</div>
                    <div className="text-xs text-muted-foreground">IP: 192.168.1.100 - há 2 horas</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigar
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Sistema atualizado</div>
                    <div className="text-xs text-muted-foreground">Patch de segurança aplicado - hoje</div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Resolvido
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
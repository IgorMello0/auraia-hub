import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, DollarSign, Phone, MessageSquare } from 'lucide-react';

// Mock data - será substituído por dados reais do backend
const mockAppointments = [
  {
    id: '1',
    clientName: 'Maria Silva',
    service: 'Consulta Psicológica',
    date: '2024-01-20',
    time: '14:00',
    status: 'confirmado',
    phone: '+55 11 99999-9999'
  },
  {
    id: '2',
    clientName: 'João Santos',
    service: 'Terapia de Casal',
    date: '2024-01-20',
    time: '16:00',
    status: 'pendente',
    phone: '+55 11 88888-8888'
  },
  {
    id: '3',
    clientName: 'Ana Costa',
    service: 'Consulta Psicológica',
    date: '2024-01-21',
    time: '10:00',
    status: 'confirmado',
    phone: '+55 11 77777-7777'
  }
];

const mockStats = {
  totalAppointments: 15,
  totalRevenue: 2500,
  totalClients: 12,
  pendingPayments: 3
};

const Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Visão geral dos seus agendamentos e atividades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Agendamentos
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{mockStats.totalAppointments}</div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Receita Total
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">R$ {mockStats.totalRevenue}</div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Clientes Ativos
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{mockStats.totalClients}</div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              Total de clientes
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Pagamentos Pendentes
            </CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{mockStats.pendingPayments}</div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Section */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Próximos Agendamentos</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Seus compromissos para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-5">
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3"
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium text-sm sm:text-base truncate">{appointment.clientName}</h4>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(appointment.status)} text-[0.65rem] sm:text-xs whitespace-nowrap`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {appointment.service}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[0.65rem] sm:text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {new Date(appointment.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full text-sm">
              Ver todos os agendamentos
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Atividade Recente</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Últimas interações e eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-5">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Novo agendamento confirmado</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground break-words">Maria Silva - Consulta às 14:00</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Pagamento recebido</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground break-words">João Santos - R$ 150,00</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">Há 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Nova conversa iniciada</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground break-words">Cliente interessado em terapia</p>
                  <p className="text-[0.65rem] sm:text-xs text-muted-foreground">Há 6 horas</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full text-sm">
              Ver todas as atividades
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
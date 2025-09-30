import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

// Mock data para pagamentos
const mockPayments = [
  {
    id: '1',
    clientName: 'Maria Silva',
    service: 'Consulta Psicológica',
    amount: 150,
    date: '2024-01-20',
    appointmentDate: '2024-01-20',
    status: 'paid',
    paymentMethod: 'Pix'
  },
  {
    id: '2',
    clientName: 'João Santos',
    service: 'Terapia de Casal',
    amount: 200,
    date: '2024-01-19',
    appointmentDate: '2024-01-19',
    status: 'pending',
    paymentMethod: 'Dinheiro'
  },
  {
    id: '3',
    clientName: 'Ana Costa',
    service: 'Consulta Psicológica',
    amount: 150,
    date: '2024-01-18',
    appointmentDate: '2024-01-18',
    status: 'paid',
    paymentMethod: 'Cartão'
  },
  {
    id: '4',
    clientName: 'Carlos Lima',
    service: 'Terapia Individual',
    amount: 120,
    date: '2024-01-17',
    appointmentDate: '2024-01-17',
    status: 'overdue',
    paymentMethod: 'Transferência'
  }
];

const Payments = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const updatePaymentStatus = (paymentId: string, newStatus: 'paid' | 'pending' | 'overdue') => {
    setPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: newStatus }
          : payment
      )
    );
    
    toast({
      title: 'Status atualizado',
      description: `Pagamento marcado como ${newStatus === 'paid' ? 'pago' : newStatus === 'pending' ? 'pendente' : 'em atraso'}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Em Atraso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Controle de Pagamentos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie os pagamentos dos seus atendimentos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.pendingAmount}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Atraso
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.overdueAmount}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos atrasados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pagamentos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Pagamentos</CardTitle>
          <CardDescription>
            Acompanhe e atualize o status dos pagamentos manualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar cliente ou serviço</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="min-w-[180px]">
              <Label>Filtrar por status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="overdue">Em Atraso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-medium">{payment.clientName}</h4>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {payment.service}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <span>Consulta: {new Date(payment.appointmentDate).toLocaleDateString('pt-BR')}</span>
                    <span>Método: {payment.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg">R$ {payment.amount}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {payment.status !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => updatePaymentStatus(payment.id, 'paid')}
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      >
                        Marcar como Pago
                      </Button>
                    )}
                    
                    {payment.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePaymentStatus(payment.id, 'pending')}
                        className="w-full sm:w-auto"
                      >
                        Marcar como Pendente
                      </Button>
                    )}
                    
                    {payment.status !== 'overdue' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updatePaymentStatus(payment.id, 'overdue')}
                        className="w-full sm:w-auto"
                      >
                        Marcar Atraso
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || filter !== 'all' 
                  ? 'Nenhum pagamento encontrado com os filtros aplicados.' 
                  : 'Nenhum pagamento registrado ainda.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
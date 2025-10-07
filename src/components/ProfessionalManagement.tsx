import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Calendar,
  Mail,
  Phone,
  Search,
  Filter,
  Save,
  CheckCircle,
} from 'lucide-react';
import { ModulesAccessTab } from './ModulesAccessTab';
import { FormModelsTab } from './FormModelsTab';
import { ReportsPermissionsTab } from './ReportsPermissionsTab';
import { useToast } from '@/hooks/use-toast';

// Mock data dos profissionais
const mockProfessionals = [
  {
    id: 1,
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    email: 'joao.silva@clinic.com',
    phone: '(11) 98765-4321',
    status: 'ativo',
    appointments: 45,
  },
  {
    id: 2,
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologia',
    email: 'maria.santos@clinic.com',
    phone: '(11) 97654-3210',
    status: 'ativo',
    appointments: 38,
  },
  {
    id: 3,
    name: 'Dr. Pedro Costa',
    specialty: 'Ortopedia',
    email: 'pedro.costa@clinic.com',
    phone: '(11) 96543-2109',
    status: 'inativo',
    appointments: 0,
  },
];

export const ProfessionalManagement = () => {
  const { toast } = useToast();
  const [professionals] = useState(mockProfessionals);
  const [selectedProfessional, setSelectedProfessional] = useState(mockProfessionals[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveConfiguration = () => {
    // Simula salvamento
    toast({
      title: "Configurações salvas com sucesso!",
      description: `As configurações de ${selectedProfessional.name} foram atualizadas.`,
      duration: 3000,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Profissionais</h2>
          <p className="text-muted-foreground">
            Configure módulos, permissões e fichas para cada profissional
          </p>
        </div>
        <Button onClick={handleSaveConfiguration} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou especialidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Professional Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredProfessionals.map((prof) => (
          <Card
            key={prof.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProfessional.id === prof.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedProfessional(prof)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <Badge variant={prof.status === 'ativo' ? 'default' : 'secondary'}>
                  {prof.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">{prof.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{prof.specialty}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{prof.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{prof.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{prof.appointments} agendamentos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Details and Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{selectedProfessional.name}</CardTitle>
              <CardDescription>{selectedProfessional.specialty}</CardDescription>
            </div>
            {selectedProfessional.status === 'ativo' && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ativo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modules">Módulos e Acessos</TabsTrigger>
              <TabsTrigger value="forms">Modelos de Fichas</TabsTrigger>
              <TabsTrigger value="reports">Relatórios e Permissões</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <ModulesAccessTab professionalId={selectedProfessional.id} />
            </TabsContent>

            <TabsContent value="forms" className="mt-6">
              <FormModelsTab professionalId={selectedProfessional.id} />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <ReportsPermissionsTab professionalId={selectedProfessional.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

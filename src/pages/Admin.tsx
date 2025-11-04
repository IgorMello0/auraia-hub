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
  FileText,
  Tag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { FormTemplateBuilder } from '@/components/FormTemplateBuilder';
import { ProfessionalManagement } from '@/components/ProfessionalManagement';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { professionalsApi, categoriesApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'ativo' | 'inativo';
  itemsCount: number;
  createdAt: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await categoriesApi.getAll({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        const categoriesData = response.data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description || '',
          status: cat.status === 'ativo' ? 'ativo' as const : 'inativo' as const,
          itemsCount: cat.catalogItems?.length || 0,
          createdAt: new Date(cat.createdAt).toISOString().split('T')[0],
        }));
        setCategories(categoriesData);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  const { toast } = useToast();
  const { professional } = useAuth();

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

  const [professionals, setProfessionals] = useState<Array<{ id: number; name: string; specialization: string | null; status: string; appointments: number }>>([]);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    setIsLoadingProfessionals(true);
    try {
      const response = await professionalsApi.getAll({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        const professionalsData = response.data.map((prof: any) => ({
          id: prof.id,
          name: prof.name,
          specialization: prof.specialization || 'Sem especialização',
          status: 'ativo',
          appointments: prof.appointments?.length || 0,
        }));
        setProfessionals(professionalsData);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfessionals(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'cancel': return <UserX className="h-4 w-4 text-red-500" />;
      case 'update': return <Settings className="h-4 w-4 text-blue-500" />;
      case 'login': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Category management functions
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!professional?.id) {
      toast({
        title: "Erro",
        description: "Profissional não identificado",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await categoriesApi.create({
        professionalId: Number(professional.id),
        name: categoryForm.name,
        description: categoryForm.description || undefined,
        status: categoryForm.status,
      });

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso"
        });
        loadCategories();
        setCategoryForm({ name: '', description: '', status: 'ativo' });
        setIsCategoryModalOpen(false);
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao criar categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!editingCategory) return;

    try {
      const response = await categoriesApi.update(Number(editingCategory.id), {
        name: categoryForm.name,
        description: categoryForm.description || undefined,
        status: categoryForm.status,
      });

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso"
        });
        loadCategories();
        setEditingCategory(null);
        setCategoryForm({ name: '', description: '', status: 'ativo' });
        setIsCategoryModalOpen(false);
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao atualizar categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await categoriesApi.delete(Number(categoryId));
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso"
        });
        loadCategories();
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao excluir categoria",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    }
  };

  const handleToggleCategoryStatus = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const newStatus = category.status === 'ativo' ? 'inativo' : 'ativo';
    
    try {
      const response = await categoriesApi.update(Number(categoryId), {
        status: newStatus,
      });

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Status da categoria alterado"
        });
        loadCategories();
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao alterar status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status",
        variant: "destructive"
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', status: 'ativo' });
    setEditingCategory(null);
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
              {isLoadingProfessionals ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Carregando profissionais...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {professionals.map((professional) => {
                    return (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('professionals')}
                          >
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professionals" className="space-y-4">
          <ProfessionalManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Gerenciamento de Categorias
              </CardTitle>
              <CardDescription>
                Gerencie as categorias de catálogo do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="ativo">Ativas</SelectItem>
                    <SelectItem value="inativo">Inativas</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isCategoryModalOpen} onOpenChange={(open) => {
                  setIsCategoryModalOpen(open);
                  if (!open) resetCategoryForm();
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetCategoryForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategory 
                          ? 'Atualize as informações da categoria.' 
                          : 'Crie uma nova categoria para organizar os itens do catálogo.'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome da Categoria *</Label>
                        <Input
                          id="name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          placeholder="Ex: Depilação a Laser"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                          placeholder="Descrição opcional da categoria"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={categoryForm.status} 
                          onValueChange={(value) => setCategoryForm({...categoryForm, status: value as 'ativo' | 'inativo'})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativa</SelectItem>
                            <SelectItem value="inativo">Inativa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsCategoryModalOpen(false);
                        resetCategoryForm();
                      }}>
                        Cancelar
                      </Button>
                      <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                        {editingCategory ? 'Atualizar' : 'Criar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              
              <div className="space-y-4">
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Carregando categorias...</span>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma categoria encontrada</p>
                    <p className="text-sm">Crie uma nova categoria para começar</p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground">{category.description}</div>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <Badge 
                              variant={category.status === 'ativo' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {category.status === 'ativo' ? 'Ativa' : 'Inativa'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {category.itemsCount} itens
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Criada em {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCategoryStatus(category.id)}
                          className="h-8 w-8 p-0"
                        >
                          {category.status === 'ativo' ? (
                            <X className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
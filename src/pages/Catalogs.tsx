import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { catalogsApi, categoriesApi } from '@/lib/api';

interface Catalog {
  id: number;
  professionalId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  price: number | string;
  status: 'ativo' | 'inativo' | 'rascunho';
  imageUrl: string | null;
  durationMinutes: number | null;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

const Catalogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    status: 'ativo' as const,
    durationMinutes: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { professional } = useAuth();
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
    { value: 'inativo', label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
    { value: 'rascunho', label: 'Rascunho', color: 'bg-yellow-100 text-yellow-800' }
  ];

  useEffect(() => {
    loadCatalogs();
    loadCategories();
  }, []);

  const loadCatalogs = async () => {
    setIsLoading(true);
    try {
      const response = await catalogsApi.getAll({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        setCatalogs(response.data);
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao carregar catálogos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (catalog.description && catalog.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || catalog.categoryId?.toString() === categoryFilter;
    const matchesStatus = statusFilter === 'all' || catalog.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenDialog = (catalog?: Catalog) => {
    if (catalog) {
      setEditingCatalog(catalog);
      setFormData({
        name: catalog.name,
        description: catalog.description || '',
        categoryId: catalog.categoryId?.toString() || '',
        price: catalog.price.toString(),
        status: catalog.status,
        durationMinutes: catalog.durationMinutes?.toString() || '',
        imageUrl: catalog.imageUrl || ''
      });
      setImageFile(null);
      setImagePreview(catalog.imageUrl || null);
    } else {
      setEditingCatalog(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        status: 'ativo',
        durationMinutes: '',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      setFormData({ ...formData, imageUrl: '' }); // Limpar URL se houver arquivo
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!professional?.id) {
      toast({
        title: "Erro",
        description: "Profissional não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Se houver arquivo de imagem, fazer upload primeiro
      let imageUrl = formData.imageUrl || null;
      
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
        const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (uploadData.success && uploadData.data) {
            // Construir URL completa da imagem
            const baseUrl = API_BASE_URL.replace('/api', '')
            imageUrl = uploadData.data.url.startsWith('http') 
              ? uploadData.data.url 
              : `${baseUrl}${uploadData.data.url}`
          } else {
            imageUrl = uploadData.data?.url || uploadData.url || null
          }
        } else {
          // Se o upload falhar, tentar usar base64 como fallback
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile);
          });
          imageUrl = await base64Promise;
        }
      }

      const catalogData = {
        professionalId: parseInt(professional.id),
        categoryId: formData.categoryId && formData.categoryId !== '' ? parseInt(formData.categoryId) : null,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        imageUrl: imageUrl,
        status: formData.status,
        durationMinutes: formData.durationMinutes && formData.durationMinutes !== '' ? parseInt(formData.durationMinutes) : null
      };

      if (editingCatalog) {
        const response = await catalogsApi.update(editingCatalog.id, catalogData);
        if (response.success) {
          toast({
            title: "Catálogo atualizado",
            description: "As informações do catálogo foram atualizadas com sucesso.",
          });
          loadCatalogs();
        } else {
          toast({
            title: "Erro",
            description: response.error?.message || "Erro ao atualizar catálogo",
            variant: "destructive",
          });
          return;
        }
      } else {
        const response = await catalogsApi.create(catalogData);
        if (response.success) {
          toast({
            title: "Catálogo criado",
            description: "Novo item foi adicionado ao catálogo com sucesso.",
          });
          loadCatalogs();
        } else {
          toast({
            title: "Erro",
            description: response.error?.message || "Erro ao criar catálogo",
            variant: "destructive",
          });
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingCatalog(null);
      setFormData({ name: '', description: '', categoryId: '', price: '', status: 'ativo', durationMinutes: '', imageUrl: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar catálogo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (catalogId: number) => {
    if (!confirm('Tem certeza que deseja remover este item do catálogo?')) {
      return;
    }

    try {
      const response = await catalogsApi.delete(catalogId);
      if (response.success) {
        toast({
          title: "Catálogo removido",
          description: "Item foi removido do catálogo com sucesso.",
        });
        loadCatalogs();
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao remover catálogo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover catálogo",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge variant="outline" className={statusOption?.color || 'bg-gray-100 text-gray-800'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Catálogos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie seus serviços e tratamentos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingCatalog ? 'Editar Catálogo' : 'Novo Item no Catálogo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do serviço ou tratamento"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do serviço"
                  className="text-sm min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-sm">Categoria</Label>
                  <Select 
                    value={formData.categoryId ? formData.categoryId : undefined} 
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationMinutes" className="text-sm">Duração (minutos)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="Ex: 60"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm">Imagem</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                  {imagePreview && (
                    <div className="relative mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {!imagePreview && !imageFile && (
                    <div className="mt-2">
                      <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Ou informe uma URL:</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="text-sm mt-1"
                      />
                      {formData.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto text-sm">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="w-full sm:w-auto text-sm">
                {editingCatalog ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Total de Itens
            </CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{catalogs.length}</div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              no catálogo
            </p>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Ativos
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              {catalogs.filter(c => c.status === 'ativo').length}
            </div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Categorias
            </CardTitle>
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
              {new Set(catalogs.map(c => c.categoryId).filter(id => id !== null)).size}
            </div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              diferentes
            </p>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-[0.65rem] sm:text-xs md:text-sm font-medium leading-tight">
              Valor Médio
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
              R$ {catalogs.length > 0 ? Math.round(catalogs.reduce((acc, c) => acc + Number(c.price), 0) / catalogs.length) : 0}
            </div>
            <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-muted-foreground mt-0.5">
              por item
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg md:text-xl">Catálogo de Serviços</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviços..."
                  className="pl-8 text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {/* Catalog Grid */}
          {isLoading ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-muted-foreground">Carregando catálogos...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
                {filteredCatalogs.map((catalog) => (
                  <Card key={catalog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      {catalog.imageUrl ? (
                        <img
                          src={catalog.imageUrl}
                          alt={catalog.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(catalog.status)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{catalog.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{catalog.description || 'Sem descrição'}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {catalog.category?.name || 'Sem categoria'}
                          </Badge>
                          <span className="font-bold text-sm sm:text-base text-primary">
                            R$ {Number(catalog.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(catalog)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(catalog.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => navigate(`/catalogs/${catalog.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredCatalogs.length === 0 && (
                <div className="text-center py-8 px-4">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                      ? 'Nenhum item encontrado com os filtros aplicados.'
                      : 'Nenhum item no catálogo. Clique em "Novo Item" para começar.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Catalogs;

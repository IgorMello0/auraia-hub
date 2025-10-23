import { useState } from 'react';
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

interface Catalog {
  id: string;
  professional_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: 'ativo' | 'inativo' | 'rascunho';
  image_urls: string[];
  created_at: string;
}

const Catalogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    status: 'ativo' as const,
    images: [] as File[]
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { professional } = useAuth();
  const navigate = useNavigate();

  // Mock data for catalogs
  const [catalogs, setCatalogs] = useState<Catalog[]>([
    {
      id: '1',
      professional_id: '1',
      title: 'Pacote Depilação Laser - Axilas',
      description: 'Tratamento completo de depilação a laser para axilas. Inclui 6 sessões com intervalo de 30 dias.',
      category: 'Depilação',
      price: 450,
      status: 'ativo',
      image_urls: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
      created_at: '2024-01-15'
    },
    {
      id: '2',
      professional_id: '1',
      title: 'Pacote Depilação Laser - Pernas Completas',
      description: 'Tratamento completo de depilação a laser para pernas. Inclui 8 sessões com intervalo de 30 dias.',
      category: 'Depilação',
      price: 1200,
      status: 'ativo',
      image_urls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
      created_at: '2024-01-10'
    },
    {
      id: '3',
      professional_id: '1',
      title: 'Pacote Depilação Laser - Virilha',
      description: 'Tratamento completo de depilação a laser para virilha. Inclui 6 sessões com intervalo de 30 dias.',
      category: 'Depilação',
      price: 600,
      status: 'rascunho',
      image_urls: ['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400'],
      created_at: '2024-01-20'
    },
    {
      id: '4',
      professional_id: '1',
      title: 'Consulta Estética Facial',
      description: 'Consulta completa para avaliação e tratamento estético facial personalizado.',
      category: 'Estética',
      price: 150,
      status: 'ativo',
      image_urls: ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400'],
      created_at: '2024-01-18'
    },
    {
      id: '5',
      professional_id: '1',
      title: 'Pacote Limpeza de Pele',
      description: 'Tratamento completo de limpeza de pele com extração e hidratação. Inclui 4 sessões.',
      category: 'Estética',
      price: 320,
      status: 'inativo',
      image_urls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
      created_at: '2024-01-05'
    }
  ]);

  const categories = ['Depilação', 'Estética', 'Massagem', 'Tratamentos'];
  const statusOptions = [
    { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
    { value: 'inativo', label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
    { value: 'rascunho', label: 'Rascunho', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = catalog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         catalog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || catalog.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || catalog.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenDialog = (catalog?: Catalog) => {
    if (catalog) {
      setEditingCatalog(catalog);
      setFormData({
        title: catalog.title,
        description: catalog.description,
        category: catalog.category,
        price: catalog.price.toString(),
        status: catalog.status,
        images: []
      });
      setImagePreviews(catalog.image_urls);
    } else {
      setEditingCatalog(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        status: 'ativo',
        images: []
      });
      setImagePreviews([]);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData({ ...formData, images: [...formData.images, ...files] });
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingCatalog) {
      // Edit existing catalog
      setCatalogs(catalogs.map(catalog =>
        catalog.id === editingCatalog.id
          ? { 
              ...catalog, 
              ...formData, 
              price: parseFloat(formData.price),
              image_urls: imagePreviews
            }
          : catalog
      ));
      toast({
        title: "Catálogo atualizado",
        description: "As informações do catálogo foram atualizadas com sucesso.",
      });
    } else {
      // Add new catalog
      const newCatalog: Catalog = {
        id: Date.now().toString(),
        professional_id: professional?.id || '1',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        status: formData.status,
        image_urls: imagePreviews,
        created_at: new Date().toISOString().split('T')[0]
      };
      setCatalogs([...catalogs, newCatalog]);
      toast({
        title: "Catálogo criado",
        description: "Novo item foi adicionado ao catálogo com sucesso.",
      });
    }

    setIsDialogOpen(false);
    setEditingCatalog(null);
    setFormData({ title: '', description: '', category: '', price: '', status: 'ativo', images: [] });
    setImagePreviews([]);
  };

  const handleDelete = (catalogId: string) => {
    setCatalogs(catalogs.filter(catalog => catalog.id !== catalogId));
    toast({
      title: "Catálogo removido",
      description: "Item foi removido do catálogo com sucesso.",
    });
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
                <Label htmlFor="title" className="text-sm">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome do serviço ou tratamento"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Descrição *</Label>
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
                  <Label htmlFor="category" className="text-sm">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="text-sm"
                  />
                </div>
              </div>

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
                <Label htmlFor="images" className="text-sm">Imagens</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="text-sm"
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
              {new Set(catalogs.map(c => c.category)).size}
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
              R$ {catalogs.length > 0 ? Math.round(catalogs.reduce((acc, c) => acc + c.price, 0) / catalogs.length) : 0}
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
                    <SelectItem key={category} value={category}>
                      {category}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
            {filteredCatalogs.map((catalog) => (
              <Card key={catalog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  {catalog.image_urls.length > 0 ? (
                    <img
                      src={catalog.image_urls[0]}
                      alt={catalog.title}
                      className="w-full h-full object-cover"
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
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{catalog.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{catalog.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {catalog.category}
                      </Badge>
                      <span className="font-bold text-sm sm:text-base text-primary">
                        R$ {catalog.price.toFixed(2)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Catalogs;

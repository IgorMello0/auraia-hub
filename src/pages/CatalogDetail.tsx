import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2, 
  Heart, 
  Star,
  Package,
  DollarSign,
  Tag,
  Calendar,
  User,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { catalogsApi } from '@/lib/api';

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
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  professional?: {
    id: number;
    name: string;
    email: string;
  };
  appointments?: any[];
}

const CatalogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadCatalog();
  }, [id]);

  const loadCatalog = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await catalogsApi.getById(parseInt(id));
      if (response.success && response.data) {
        setCatalog(response.data);
      } else {
        toast({
          title: "Erro",
          description: response.error?.message || "Erro ao carregar catálogo",
          variant: "destructive",
        });
        navigate('/catalogs');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogo",
        variant: "destructive",
      });
      navigate('/catalogs');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOptions = {
      'ativo': { label: 'Ativo', color: 'bg-green-100 text-green-800' },
      'inativo': { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
      'rascunho': { label: 'Rascunho', color: 'bg-yellow-100 text-yellow-800' }
    };
    const option = statusOptions[status as keyof typeof statusOptions] || statusOptions.inativo;
    
    return (
      <Badge variant="outline" className={option.color}>
        {option.label}
      </Badge>
    );
  };

  const handleEdit = () => {
    if (!catalog) return;
    // Navegar para a página de catálogos e abrir o diálogo de edição
    navigate('/catalogs', { state: { editCatalogId: catalog.id } });
  };

  const handleDelete = async () => {
    if (!catalog) return;
    
    if (!confirm('Tem certeza que deseja excluir este item do catálogo?')) {
      return;
    }

    try {
      const response = await catalogsApi.delete(catalog.id);
      if (response.success) {
        toast({
          title: "Catálogo removido",
          description: "Item foi removido do catálogo com sucesso.",
        });
        navigate('/catalogs');
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

  const handleShare = () => {
    if (!catalog) return;
    
    if (navigator.share) {
      navigator.share({
        title: catalog.name,
        text: catalog.description || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "Link do catálogo foi copiado para a área de transferência.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Catálogo não encontrado.</p>
          <Button onClick={() => navigate('/catalogs')} className="mt-4">
            Voltar para Catálogos
          </Button>
        </div>
      </div>
    );
  }

  // Preparar imagens para exibição
  const images = catalog.imageUrl ? [catalog.imageUrl] : [];
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const baseUrl = API_BASE_URL.replace('/api', '');
  
  // Garantir que URLs de imagens sejam completas
  const imageUrls = images.map(img => 
    img.startsWith('http') ? img : `${baseUrl}${img}`
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/catalogs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{catalog.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Detalhes do serviço
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video relative bg-muted">
                {imageUrls.length > 0 ? (
                  <>
                    <img
                      src={imageUrls[selectedImageIndex]}
                      alt={catalog.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                    {imageUrls.length > 1 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex gap-2">
                          {imageUrls.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {imageUrls.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
                          index === selectedImageIndex 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-muted-foreground'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Descrição do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {catalog.description || 'Sem descrição disponível.'}
              </p>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Categoria</p>
                    <p className="text-sm text-muted-foreground">
                      {catalog.category?.name || 'Sem categoria'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Criado em</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(catalog.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Profissional</p>
                    <p className="text-sm text-muted-foreground">
                      {catalog.professional?.name || 'Não informado'}
                    </p>
                  </div>
                </div>
                {catalog.durationMinutes && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Duração</p>
                      <p className="text-sm text-muted-foreground">
                        {catalog.durationMinutes} minutos
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Agendamentos</p>
                    <p className="text-sm text-muted-foreground">
                      {catalog.appointments?.length || 0} agendamento(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Última atualização</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(catalog.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Preço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">
                  R$ {Number(catalog.price).toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {getStatusBadge(catalog.status)}
                </div>
                <Button className="w-full" size="lg" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Catálogo
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Agendamentos</span>
                <span className="font-medium">{catalog.appointments?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium">{getStatusBadge(catalog.status)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Criado em</span>
                <span className="font-medium">{new Date(catalog.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Última atualização</span>
                <span className="font-medium">{new Date(catalog.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CatalogDetail;


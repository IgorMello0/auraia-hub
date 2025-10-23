import { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const CatalogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock data - em produção viria de uma API
  const catalog: Catalog = {
    id: id || '1',
    professional_id: '1',
    title: 'Pacote Depilação Laser - Axilas',
    description: 'Tratamento completo de depilação a laser para axilas. Inclui 6 sessões com intervalo de 30 dias entre cada sessão. Utilizamos tecnologia de ponta com laser de diodo, garantindo resultados eficazes e seguros. O tratamento é indicado para todos os tipos de pele e pelos, proporcionando redução significativa e permanente dos pelos.',
    category: 'Depilação',
    price: 450,
    status: 'ativo',
    image_urls: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800'
    ],
    created_at: '2024-01-15'
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
    toast({
      title: "Editar catálogo",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Excluir catálogo",
      description: "Funcionalidade de exclusão será implementada em breve.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: catalog.title,
        text: catalog.description,
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{catalog.title}</h1>
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
                {catalog.image_urls.length > 0 ? (
                  <>
                    <img
                      src={catalog.image_urls[selectedImageIndex]}
                      alt={catalog.title}
                      className="w-full h-full object-cover"
                    />
                    {catalog.image_urls.length > 1 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex gap-2">
                          {catalog.image_urls.map((_, index) => (
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
              {catalog.image_urls.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {catalog.image_urls.map((url, index) => (
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
                {catalog.description}
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
                    <p className="text-sm text-muted-foreground">{catalog.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Criado em</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(catalog.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Profissional</p>
                    <p className="text-sm text-muted-foreground">Dr. João Silva</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Avaliação</p>
                    <p className="text-sm text-muted-foreground">4.8 (127 avaliações)</p>
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
                  R$ {catalog.price.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {getStatusBadge(catalog.status)}
                </div>
                <Button className="w-full" size="lg">
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
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Editar Catálogo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
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
                <span className="text-sm text-muted-foreground">Visualizações</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Favoritos</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Compartilhamentos</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Última atualização</span>
                <span className="font-medium">2 dias atrás</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CatalogDetail;

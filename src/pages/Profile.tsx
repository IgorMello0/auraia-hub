import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Clock, 
  Save,
  Edit2,
  Shield,
  Bell,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { professional } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: professional?.name || 'Dr. João Silva',
    email: professional?.email || 'joao.silva@clinica.com',
    phone: '(11) 99999-9999',
    specialization: professional?.specialization || 'Cardiologista',
    crm: 'CRM-SP 123456',
    clinicName: 'Clínica Saúde & Vida',
    clinicAddress: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    clinicPhone: '(11) 3333-4444',
    bio: 'Especialista em cardiologia com mais de 15 anos de experiência. Formado pela USP, com pós-graduação em cardiologia intervencionista.',
    workingHours: '08:00 - 18:00',
    consultationDuration: '30',
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureImage(e.target?.result as string);
        toast({
          title: "Assinatura carregada",
          description: "Imagem da assinatura digital atualizada com sucesso!",
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos PNG.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    // Here you would typically save to your backend/database
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e profissionais
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Foto do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </Label>
                )}
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <Badge variant="secondary" className="mb-2">
                  {formData.specialization}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {formData.crm}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <Badge variant="default" className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  Plano Premium
                </Badge>
                <p className="text-sm text-muted-foreground">Ativo desde Jan 2024</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Próxima cobrança</span>
                  <span className="text-sm font-medium">15 Fev 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor mensal</span>
                  <span className="text-sm font-medium">R$ 149,90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pacientes</span>
                  <span className="text-sm font-medium">Ilimitados</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Gerenciar Plano
              </Button>
            </CardContent>
          </Card>

          {/* Digital Signature Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assinatura Digital</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {signatureImage ? (
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-4 inline-block">
                      <img 
                        src={signatureImage} 
                        alt="Assinatura digital" 
                        className="max-h-16 max-w-32 object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Assinatura configurada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-8 text-center">
                      <Edit2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Nenhuma assinatura configurada</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label htmlFor="signature-upload" className="text-sm font-medium">
                  Upload da Assinatura (PNG transparente)
                </Label>
                <div className="flex flex-col gap-2">
                  <input
                    id="signature-upload"
                    type="file"
                    accept=".png"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('signature-upload')?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {signatureImage ? 'Alterar Assinatura' : 'Carregar Assinatura'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recomendado: PNG com fundo transparente, até 2MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pacientes</span>
                <span className="font-medium">248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Consultas</span>
                <span className="font-medium">1,205</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avaliação</span>
                <span className="font-medium">4.9 ⭐</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input
                    id="crm"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia Profissional</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Descreva sua experiência e especialidades..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Clinic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Clínica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Nome da Clínica</Label>
                  <Input
                    id="clinicName"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Telefone da Clínica</Label>
                  <Input
                    id="clinicPhone"
                    value={formData.clinicPhone}
                    onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Endereço</Label>
                <Input
                  id="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horários e Preferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Horário de Funcionamento</Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    disabled={!isEditing}
                    placeholder="08:00 - 18:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationDuration">Duração da Consulta (min)</Label>
                  <Input
                    id="consultationDuration"
                    type="number"
                    value={formData.consultationDuration}
                    onChange={(e) => setFormData({ ...formData, consultationDuration: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Alterar Senha</p>
                    <p className="text-sm text-muted-foreground">
                      Última alteração há 3 meses
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notificações</p>
                    <p className="text-sm text-muted-foreground">
                      Gerenciar preferências de notificação
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
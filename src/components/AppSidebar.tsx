import { Calendar, BarChart3, CreditCard, MessageSquare, Settings, LogOut, User, LayoutDashboard, Shield, FileSignature, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    moduleCode: 'dashboard',
  },
  {
    title: 'Agendamentos',
    url: '/appointments',
    icon: Calendar,
    moduleCode: 'agendamentos',
  },
  {
    title: 'Clientes',
    url: '/clients',
    icon: User,
    moduleCode: 'clientes',
  },
  {
    title: 'Relatórios',
    url: '/reports',
    icon: BarChart3,
    moduleCode: 'relatorios',
  },
  {
    title: 'Pagamentos',
    url: '/payments',
    icon: CreditCard,
    moduleCode: 'pagamentos',
  },
  {
    title: 'Conversas',
    url: '/conversations',
    icon: MessageSquare,
    moduleCode: 'conversas',
  },
  {
    title: 'Catálogos',
    url: '/catalogs',
    icon: Package,
    moduleCode: 'catalogos',
  },
  {
    title: 'Assinatura de Contratos',
    url: '/contracts',
    icon: FileSignature,
    moduleCode: 'contratos',
  },
];

export function AppSidebar() {
  const { professional, logout, hasModuleAccess, permissions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Filtrar itens do menu baseado nas permissões
  const filteredMenuItems = menuItems.filter((item) => {
    // Se não há permissões carregadas ainda, não mostrar nada por segurança
    if (permissions.length === 0) return false;
    
    return hasModuleAccess(item.moduleCode);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {professional ? getInitials(professional.name) : 'PR'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{professional?.name}</span>
            <span className="text-xs text-muted-foreground">{professional?.specialization}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={location.pathname === '/profile'}
            >
              <a href="/profile">
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin">
                <Shield className="h-4 w-4" />
                <span>Administração</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto font-normal"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
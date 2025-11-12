-- ============================================
-- SETUP COMPLETO DO SISTEMA DE PERMISSÕES
-- Execute este arquivo no seu banco PostgreSQL
-- ============================================

-- 1. Criar tabelas de permissões (se não existirem)
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professional_permissions (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    has_access BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(professional_id, module_id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    has_access BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- 2. Popular módulos do sistema
INSERT INTO modules (code, name, description, icon) VALUES
('dashboard', 'Dashboard', 'Visão geral e métricas do sistema', 'LayoutDashboard'),
('agendamentos', 'Agendamentos', 'Gerenciamento de agendamentos', 'Calendar'),
('clientes', 'Clientes', 'Cadastro e gestão de clientes', 'Users'),
('relatorios', 'Relatórios', 'Visualização de relatórios e análises', 'BarChart3'),
('pagamentos', 'Pagamentos', 'Gestão financeira e pagamentos', 'DollarSign'),
('conversas', 'Conversas', 'Chat e mensagens com clientes', 'MessageCircle'),
('catalogos', 'Catálogos', 'Gerenciamento de serviços e produtos', 'Package'),
('contratos', 'Assinatura de Contratos', 'Contratos e documentos', 'FileText')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    updated_at = NOW();

-- 3. Verificar módulos criados
SELECT id, code, name FROM modules ORDER BY id;

-- ============================================
-- TORNAR USUÁRIO EXISTENTE ADMIN
-- ============================================

-- 3.1. Ver todos os usuários
SELECT id, name, email, role, is_active FROM usuarios;

-- 3.2. Tornar um usuário admin (SUBSTITUA o email pelo seu)
-- UPDATE usuarios SET role = 'admin' WHERE email = 'seu-email@empresa.com';

-- 3.3. Verificar
-- SELECT id, name, email, role FROM usuarios WHERE role = 'admin';

-- ============================================
-- OU CRIAR UM NOVO USUÁRIO ADMIN
-- ============================================

-- 4.1. Ver empresas disponíveis
SELECT id, name FROM empresas;

-- 4.2. Criar usuário admin (AJUSTE os valores)
-- NOTA: Você precisa gerar um hash bcrypt para a senha primeiro
-- No Node.js: require('bcryptjs').hashSync('sua-senha', 10)
/*
INSERT INTO usuarios (company_id, name, email, password_hash, role, is_active, created_at, updated_at)
VALUES (
    1,  -- ID da empresa
    'Administrador Sistema',
    'admin@empresa.com',
    '$2a$10$SEU_HASH_BCRYPT_AQUI',
    'admin',
    true,
    NOW(),
    NOW()
);
*/

-- ============================================
-- VERIFICAÇÕES FINAIS
-- ============================================

-- Ver todos os módulos
SELECT * FROM modules ORDER BY id;

-- Ver usuários admin
SELECT id, name, email, role FROM usuarios WHERE role = 'admin';

-- Ver todos os profissionais
SELECT id, name, email, specialization FROM professionals;

-- Contar registros
SELECT 
    (SELECT COUNT(*) FROM modules) as total_modules,
    (SELECT COUNT(*) FROM usuarios WHERE role = 'admin') as total_admins,
    (SELECT COUNT(*) FROM professionals) as total_professionals;


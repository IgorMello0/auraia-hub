const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: number
  }
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    console.log('[API] Request:', { url, method: options.method || 'GET', body: options.body })
    
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log('[API] Response:', { status: response.status, statusText: response.statusText, url })

    let data
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      data = text ? { message: text } : { message: 'Erro na requisição' }
    }
    
    console.log('[API] Response data:', data)
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || { message: data.message || 'Erro na requisição', code: response.status },
      }
    }

    return data
  } catch (error) {
    console.error('[API] Error:', error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro de conexão. Verifique se o servidor está rodando.',
        code: 0,
      },
    }
  }
}

// Clientes
export const clientsApi = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())
    if (params?.search) query.append('search', params.search)
    
    return apiRequest<Array<any>>(`/clientes?${query.toString()}`)
  },
  getById: async (id: number) => apiRequest<any>(`/clientes/${id}`),
  create: async (data: any) => apiRequest<any>('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: any) => apiRequest<any>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => apiRequest<{ id: number }>(`/clientes/${id}`, { method: 'DELETE' }),
}

// Profissionais
export const professionalsApi = {
  login: async (email: string, password: string) => 
    apiRequest<{ token: string; professional: any }>('/profissionais/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: async (data: { name: string; email: string; password: string; phone?: string; specialization?: string }) => 
    apiRequest<{ token: string; professional: any }>('/profissionais', { method: 'POST', body: JSON.stringify(data) }),
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())
    if (params?.search) query.append('search', params.search)
    
    return apiRequest<Array<any>>(`/profissionais?${query.toString()}`)
  },
  getById: async (id: number) => apiRequest<any>(`/profissionais/${id}`),
  getClients: async (id: number, params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())
    
    return apiRequest<Array<any>>(`/profissionais/${id}/clientes?${query.toString()}`)
  },
  create: async (data: any) => apiRequest<any>('/profissionais', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: any) => apiRequest<any>(`/profissionais/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => apiRequest<{ id: number }>(`/profissionais/${id}`, { method: 'DELETE' }),
}

// Categorias
export const categoriesApi = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())
    if (params?.search) query.append('search', params.search)
    
    return apiRequest<Array<any>>(`/categorias?${query.toString()}`)
  },
  getById: async (id: number) => apiRequest<any>(`/categorias/${id}`),
  create: async (data: any) => apiRequest<any>('/categorias', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: any) => apiRequest<any>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => apiRequest<{ id: number }>(`/categorias/${id}`, { method: 'DELETE' }),
}

// Usuários
export const usuariosApi = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.pageSize) query.append('pageSize', params.pageSize.toString())
    if (params?.search) query.append('search', params.search)
    
    return apiRequest<Array<any>>(`/usuarios?${query.toString()}`)
  },
  getById: async (id: number) => apiRequest<any>(`/usuarios/${id}`),
  login: async (email: string, password: string) => 
    apiRequest<{ token: string }>('/usuarios/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  create: async (data: any) => apiRequest<any>('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: any) => apiRequest<any>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => apiRequest<{ id: number }>(`/usuarios/${id}`, { method: 'DELETE' }),
}



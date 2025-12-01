import axios from 'axios';

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            const base = import.meta.env.BASE_URL || '/';
            window.location.href = `${base}#/login`;
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH ====================
export const authAPI = {
    login: async (email, senha) => {
        const response = await api.post('/auth/login', { email, senha });
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateMe: async (userData) => {
        const response = await api.put('/auth/me', userData);
        return response.data;
    },

    updatePassword: async (senhaAtual, novaSenha) => {
        const response = await api.put('/auth/password', { senhaAtual, novaSenha });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// ==================== USERS ====================
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    updateRole: async (id, role) => {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    }
};

// ==================== CLIENTES ====================
export const clientesAPI = {
    getAll: async (filters = {}) => {
        const response = await api.get('/clientes', { params: filters });
        return response.data;
    },

    getAtivos: async () => {
        const response = await api.get('/clientes/ativos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },

    create: async (clienteData) => {
        const response = await api.post('/clientes', clienteData);
        return response.data;
    },

    update: async (id, clienteData) => {
        const response = await api.put(`/clientes/${id}`, clienteData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    }
};

// ==================== TAREFAS ====================
export const tarefasAPI = {
    getAll: async (filters = {}) => {
        const response = await api.get('/tarefas', { params: filters });
        return response.data;
    },

    getByCliente: async (clienteId) => {
        const response = await api.get(`/tarefas/cliente/${clienteId}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/tarefas/${id}`);
        return response.data;
    },

    create: async (tarefaData) => {
        const response = await api.post('/tarefas', tarefaData);
        return response.data;
    },

    update: async (id, tarefaData) => {
        const response = await api.put(`/tarefas/${id}`, tarefaData);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/tarefas/${id}/status`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/tarefas/${id}`);
        return response.data;
    }
};

// ==================== STRIPE (preparado) ====================
export const stripeAPI = {
    getCustomer: async (clienteId) => {
        const response = await api.get(`/stripe/customer/${clienteId}`);
        return response.data;
    },

    getTransactions: async (clienteId) => {
        const response = await api.get(`/stripe/transactions/${clienteId}`);
        return response.data;
    },

    createCustomer: async (clienteId) => {
        const response = await api.post('/stripe/create-customer', { clienteId });
        return response.data;
    },

    createPaymentIntent: async (paymentData) => {
        const response = await api.post('/stripe/create-payment-intent', paymentData);
        return response.data;
    }
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getLeadsRecentes: async (limit = 10) => {
        const response = await api.get('/dashboard/leads-recentes', { params: { limit } });
        return response.data;
    },

    getAtividades: async (limit = 20) => {
        const response = await api.get('/dashboard/atividades', { params: { limit } });
        return response.data;
    },

    getConversoes: async () => {
        const response = await api.get('/dashboard/conversoes');
        return response.data;
    }
};

// ==================== WEBHOOKS (público) ====================
export const webhookAPI = {
    sendLead: async (leadData) => {
        // Não usa autenticação - endpoint público
        const response = await axios.post(
            `${API_URL}/webhooks/lead`,
            leadData,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    }
};

// Helper para verificar se usuário está autenticado
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Helper para obter usuário atual
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper para verificar role
export const hasRole = (...roles) => {
    const user = getCurrentUser();
    return user && roles.includes(user.role);
};

export default api;

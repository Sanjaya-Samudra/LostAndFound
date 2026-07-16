const TOKEN_KEY = 'lf_token';
const USER_KEY = 'lf_current_user';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

const removeToken = () => { localStorage.removeItem(TOKEN_KEY); };

const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const CATEGORY_TO_BACKEND = {
  Electronics: 'electronics',
  Clothing: 'clothing',
  Documents: 'documents',
  Other: 'other',
};

const CATEGORY_TO_FRONTEND = {
  electronics: 'Electronics',
  clothing: 'Clothing',
  documents: 'Documents',
  other: 'Other',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500&auto=format&fit=crop&q=60';

const toFrontendItem = (item) => {
  const postedByUser = item.postedBy || {};
  const fullName = postedByUser.firstName
    ? `${postedByUser.firstName} ${postedByUser.lastName || ''}`.trim()
    : 'Unknown';

  let status;
  if (item.status === 'resolved') {
    status = 'claimed';
  } else if (item.type === 'found') {
    status = 'found';
  } else {
    status = 'lost';
  }

  const images = item.images && item.images.length > 0 ? item.images : [];

  return {
    id: item._id,
    title: item.title,
    description: item.description,
    category: CATEGORY_TO_FRONTEND[item.category] || item.category || 'Other',
    status,
    location: item.location || '',
    date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
    postedBy: fullName,
    userId: postedByUser._id || '',
    images,
    image: images[0] || FALLBACK_IMAGE,
  };
};

const toBackendItem = (data, type) => ({
  title: data.title,
  description: data.description,
  category: CATEGORY_TO_BACKEND[data.category] || 'other',
  type,
  location: data.location,
  images: data.images && data.images.length > 0 ? data.images : [],
});

const toFrontendUser = (user) => ({
  id: user._id,
  name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email,
  role: user.role === 'admin' ? 'Admin' : 'User',
  joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
});

export const api = {
  login: async (email, password) => {
    const data = await handleResponse(
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    );
    setToken(data.token);
    const user = toFrontendUser(data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  register: async (firstName, lastName, email, password) => {
    const data = await handleResponse(
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
    );
    return { success: true, message: data.message };
  },

  verifyEmail: async (email) => {
    await handleResponse(
      await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    );
  },

  logout: () => {
    removeToken();
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser: () => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isTokenExpired: () => {
    const token = getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  updateProfile: async (firstName, lastName, email) => {
    const data = await handleResponse(
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ firstName, lastName, email }),
      })
    );
    const user = toFrontendUser(data);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  changePassword: async (currentPassword, newPassword) => {
    await handleResponse(
      await fetch('/api/auth/password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      })
    );
    return { success: true };
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const data = await handleResponse(
      await fetch('/api/upload/image', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
    );
    return data.url;
  },

  uploadImages: async (files) => {
    if (!files || files.length === 0) return [];
    const promises = Array.from(files).map(file => api.uploadImage(file));
    return Promise.all(promises);
  },

  getItems: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') {
      params.append('category', CATEGORY_TO_BACKEND[filters.category] || filters.category.toLowerCase());
    }
    if (filters.status && filters.status !== 'All') {
      if (filters.status === 'lost') params.append('type', 'lost');
      else if (filters.status === 'found') params.append('type', 'found');
    }
    if (filters.location) params.append('location', filters.location);
    const query = params.toString();
    const data = await handleResponse(
      await fetch(`/api/items${query ? `?${query}` : ''}`)
    );
    return data.map(toFrontendItem);
  },

  getItemById: async (id) => {
    const data = await handleResponse(
      await fetch(`/api/items/${id}`)
    );
    return toFrontendItem(data);
  },

  createItem: async (itemData) => {
    const data = await handleResponse(
      await fetch('/api/items', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(toBackendItem(itemData, itemData.type || itemData.status)),
      })
    );
    return toFrontendItem(data);
  },

  updateItem: async (id, itemData) => {
    const body = { ...itemData };
    if (body.status === 'claimed') {
      body.status = 'resolved';
    }
    const data = await handleResponse(
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })
    );
    return toFrontendItem(data);
  },

  deleteItem: async (id) => {
    await handleResponse(
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    );
  },

  getMyItems: async () => {
    const data = await handleResponse(
      await fetch('/api/items/my', { headers: getAuthHeaders() })
    );
    return data.map(toFrontendItem);
  },

  getStats: async () => {
    const data = await handleResponse(
      await fetch('/api/admin/stats', { headers: getAuthHeaders() })
    );
    const total = data.totalItems;
    const lostPct = total ? Math.round((data.lostCount / total) * 100) : 0;
    const foundPct = total ? Math.round((data.foundCount / total) * 100) : 0;
    return {
      totalItems: data.totalItems,
      totalUsers: data.totalUsers,
      lostCount: data.lostCount,
      foundCount: data.foundCount,
      claimedCount: data.resolvedCount,
      successRate: total ? Math.round((data.resolvedCount / total) * 100) : 0,
    };
  },

  getUsers: async (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await handleResponse(
      await fetch(`/api/admin/users${params}`, { headers: getAuthHeaders() })
    );
    return data.map(toFrontendUser);
  },

  updateUserRole: async (id, role) => {
    const data = await handleResponse(
      await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: role === 'Admin' ? 'admin' : 'student' }),
      })
    );
    return toFrontendUser(data);
  },

  deleteUser: async (id) => {
    await handleResponse(
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    );
  },

  deleteItemAdmin: async (id) => {
    await handleResponse(
      await fetch(`/api/admin/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
    );
  },

  getNotifications: async () => {
    const data = await handleResponse(
      await fetch('/api/notifications', { headers: getAuthHeaders() })
    );
    return data.map(n => ({
      id: n._id,
      type: n.type,
      message: n.message,
      itemId: n.itemId,
      read: n.read,
      time: n.createdAt ? new Date(n.createdAt).toISOString().split('T')[0] : '',
    }));
  },

  markNotificationRead: async (id) => {
    await handleResponse(
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      })
    );
  },

  markAllNotificationsRead: async () => {
    await handleResponse(
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: getAuthHeaders(),
      })
    );
  },
};

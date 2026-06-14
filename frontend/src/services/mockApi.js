// Mock Database for LostFound application

const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'iPhone 14 Pro Max (Space Black)',
    description: 'Lost near the Central Park benches near the lake. It has a transparent case with a small scratch on the bottom right. Lock screen has a picture of a husky.',
    category: 'Electronics',
    status: 'lost',
    location: 'Central Park, NY',
    date: '2026-06-10',
    postedBy: 'Alice Johnson',
    userId: 'user-1',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'item-2',
    title: 'Golden Retriever (Max)',
    description: 'Found a very friendly golden retriever running around without a collar near Broadway St. He knows basic commands and is currently safe with us.',
    category: 'Pets',
    status: 'found',
    location: 'Broadway & 42nd St, NY',
    date: '2026-06-12',
    postedBy: 'Bob Smith',
    userId: 'user-2',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'item-3',
    title: 'Brown Leather Coach Wallet',
    description: 'Found a brown leather wallet on the seat of the uptown N train. Contains some cash and a subway metrocard but no ID.',
    category: 'Wallets',
    status: 'found',
    location: 'Subway N Train, NY',
    date: '2026-06-13',
    postedBy: 'Charlie Brown',
    userId: 'user-3',
    image: 'https://images.unsplash.com/photo-1627124118123-e4d31aaee970?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'item-4',
    title: 'Toyota Car Keys',
    description: 'Lost my car keys with a black fob and a metal carabiner. Probably dropped them while walking between the Library and the parking lot.',
    category: 'Keys',
    status: 'lost',
    location: 'Public Library Parking, NY',
    date: '2026-06-08',
    postedBy: 'Alice Johnson',
    userId: 'user-1',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'item-5',
    title: 'NYU Student ID Card',
    description: 'Found a student ID card for Jane Doe on the grass in Washington Square Park.',
    category: 'Documents',
    status: 'found',
    location: 'Washington Square Park, NY',
    date: '2026-06-14',
    postedBy: 'David Miller',
    userId: 'user-4',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'item-6',
    title: 'North Face Black Backpack',
    description: 'Left my black North Face backpack in the Starbucks on 5th Ave. It contains a gray college notebook and a thermos.',
    category: 'Clothing',
    status: 'lost',
    location: 'Starbucks 5th Ave, NY',
    date: '2026-06-11',
    postedBy: 'Emily Watson',
    userId: 'user-5',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60'
  }
];

const INITIAL_USERS = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'User', joined: '2026-01-15' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', role: 'User', joined: '2026-02-20' },
  { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', joined: '2026-03-05' },
  { id: 'user-4', name: 'David Miller', email: 'david@example.com', role: 'User', joined: '2026-04-12' },
  { id: 'user-5', name: 'Emily Watson', email: 'emily@example.com', role: 'User', joined: '2026-05-18' },
  { id: 'user-admin', name: 'Admin Control', email: 'admin@lostfound.com', role: 'Admin', joined: '2025-12-01' }
];

// Helper to load or initialize local storage
const loadData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockApi = {
  // Items API
  getItems: (filters = {}) => {
    let items = loadData('lf_items', INITIAL_ITEMS);
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category && filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }
    
    if (filters.status && filters.status !== 'All') {
      items = items.filter(item => item.status === filters.status);
    }
    
    return items;
  },

  getItemById: (id) => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    return items.find(item => item.id === id) || null;
  },

  createItem: (itemData) => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    const newItem = {
      id: `item-${Date.now()}`,
      postedBy: 'Alice Johnson', // Default logged-in user
      userId: 'user-1',
      date: new Date().toISOString().split('T')[0],
      image: itemData.image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500&auto=format&fit=crop&q=60', // Placeholder
      ...itemData
    };
    items.unshift(newItem); // Add to top
    saveData('lf_items', items);
    return newItem;
  },

  updateItemStatus: (id, status) => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].status = status;
      saveData('lf_items', items);
      return items[index];
    }
    return null;
  },

  deleteItem: (id) => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    const filtered = items.filter(item => item.id !== id);
    saveData('lf_items', filtered);
    return true;
  },

  // Users API
  getUsers: () => {
    return loadData('lf_users', INITIAL_USERS);
  },

  updateUserRole: (id, role) => {
    const users = loadData('lf_users', INITIAL_USERS);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index].role = role;
      saveData('lf_users', users);
      return users[index];
    }
    return null;
  },

  deleteUser: (id) => {
    const users = loadData('lf_users', INITIAL_USERS);
    const filtered = users.filter(user => user.id !== id);
    saveData('lf_users', filtered);
    return true;
  },

  // Stats Analytics
  getDashboardStats: () => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    const users = loadData('lf_users', INITIAL_USERS);
    
    const lostCount = items.filter(i => i.status === 'lost').length;
    const foundCount = items.filter(i => i.status === 'found').length;
    const claimedCount = items.filter(i => i.status === 'claimed').length;
    
    return {
      totalItems: items.length,
      totalUsers: users.length,
      lostCount,
      foundCount,
      claimedCount,
      successRate: Math.round((claimedCount / (items.length || 1)) * 100)
    };
  },

  getUserStats: (userId) => {
    const items = loadData('lf_items', INITIAL_ITEMS);
    const userItems = items.filter(i => i.userId === userId);
    
    return {
      total: userItems.length,
      lost: userItems.filter(i => i.status === 'lost').length,
      found: userItems.filter(i => i.status === 'found').length,
      claimed: userItems.filter(i => i.status === 'claimed').length,
      items: userItems
    };
  }
};

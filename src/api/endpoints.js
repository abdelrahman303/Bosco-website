export const endpoints = {
  health: '/health',
  login: '/auth/login',
  me: '/auth/me',
  stats: '/admin/stats',
  upload: '/admin/upload',
  categories: '/categories',
  category: (id) => `/categories/${id}`,
  subcategories: '/subcategories',
  subcategory: (id) => `/subcategories/${id}`,
  products: '/products',
  product: (id) => `/products/${id}`,
  inquiries: '/inquiries',
};

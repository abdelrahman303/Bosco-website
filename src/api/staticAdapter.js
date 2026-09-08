const STATIC_API = import.meta.env.VITE_STATIC_API === 'true';
const INQUIRY_EMAIL = 'rana.fathi.rana@gmail.com';

let catalogPromise;

function catalogUrl() {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}static-api/catalog.json`.replace(/([^:]\/)\/+/g, '$1');
}

async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(catalogUrl()).then(async (response) => {
      if (!response.ok) throw new Error('Catalog is unavailable.');
      return response.json();
    });
  }
  return catalogPromise;
}

function filterProducts(products, params = {}) {
  return products.filter((product) => {
    if (params.categoryId && String(product.category_id) !== String(params.categoryId)) return false;
    if (params.subcategoryId && String(product.subcategory_id) !== String(params.subcategoryId)) {
      return false;
    }
    if ((params.featured === '1' || params.featured === true) && !product.featured) return false;
    if (params.q) {
      const q = String(params.q).toLowerCase();
      const hay = [product.name, product.model, product.short_description, product.sku]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function ok(data, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  };
}

async function sendInquiry(payload = {}) {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();
  if (!name || !email || !message) {
    const error = new Error('Name, email, and message are required.');
    error.response = { status: 400, data: { message: error.message } };
    throw error;
  }

  const response = await fetch(`https://formsubmit.co/ajax/${INQUIRY_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      company: payload.company || '',
      phone: payload.phone || '',
      message,
      product_id: payload.product_id || '',
      _subject: 'Bosco website inquiry',
    }),
  });

  if (!response.ok) {
    throw new Error('Could not send the inquiry. Please email us directly.');
  }

  return ok({
    ok: true,
    message: 'Your inquiry has been received. Our team will contact you shortly.',
  }, 201);
}

export async function staticApiAdapter(config) {
  const method = (config.method || 'get').toLowerCase();
  const path = String(config.url || '').split('?')[0].replace(/^\//, '');
  const params = config.params || {};
  const catalog = await loadCatalog();

  if (path === 'health' && method === 'get') return ok(catalog.health);

  if (path === 'products' && method === 'get') {
    return ok({ data: filterProducts(catalog.products, params) });
  }

  if (path.startsWith('products/') && method === 'get') {
    const key = path.slice('products/'.length);
    const item = catalog.productByKey[key];
    if (!item) {
      const error = new Error('Product not found.');
      error.response = { status: 404, data: { message: 'Product not found.' } };
      throw error;
    }
    return ok(item);
  }

  if (path === 'categories' && method === 'get') {
    return ok({ data: catalog.categories });
  }

  if (path.startsWith('categories/') && method === 'get') {
    const key = path.slice('categories/'.length);
    const item = catalog.categoryByKey[key];
    if (!item) {
      const error = new Error('Category not found.');
      error.response = { status: 404, data: { message: 'Category not found.' } };
      throw error;
    }
    return ok(item);
  }

  if (path === 'subcategories' && method === 'get') {
    const rows = params.categoryId
      ? catalog.subcategories.filter((row) => String(row.category_id) === String(params.categoryId))
      : catalog.subcategories;
    return ok({ data: rows });
  }

  if (path.startsWith('subcategories/') && method === 'get') {
    const key = path.slice('subcategories/'.length);
    const item = catalog.subcategoryByKey[key];
    if (!item) {
      const error = new Error('Subcategory not found.');
      error.response = { status: 404, data: { message: 'Subcategory not found.' } };
      throw error;
    }
    return ok(item);
  }

  if (path === 'inquiries' && method === 'post') {
    let payload = config.data || {};
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = {};
      }
    }
    return sendInquiry(payload);
  }

  const error = new Error('This action needs a live admin server. The public catalog is already live on GitHub Pages.');
  error.response = { status: 503, data: { message: error.message } };
  throw error;
}

export { STATIC_API };

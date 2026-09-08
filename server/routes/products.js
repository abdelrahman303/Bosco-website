import { Hono } from 'hono';
import { listProducts, mapProduct, queries, similarProducts, uniqueSlug } from '../db.js';
import { requireAdmin } from '../lib/auth.js';
import { safeJson, toBoolInt, toInt } from '../lib/http.js';

const products = new Hono();

function productPayload(body, existing = {}) {
  const categoryId = toInt(body.category_id, existing.category_id);
  if (!categoryId || !queries.categoryById.get(categoryId)) {
    throw new Error('A valid category is required.');
  }

  const subcategoryId = toInt(body.subcategory_id, existing.subcategory_id);
  if (subcategoryId && !queries.subcategoryById.get(subcategoryId)) {
    throw new Error('Subcategory not found.');
  }

  return {
    category_id: categoryId,
    subcategory_id: subcategoryId,
    name: (body.name || existing.name || '').trim(),
    slug: uniqueSlug('products', body.slug || body.name || existing.name, existing.id),
    model: body.model ?? existing.model ?? '',
    sku: body.sku ?? existing.sku ?? '',
    short_description: body.short_description ?? existing.short_description ?? '',
    description: body.description ?? existing.description ?? '',
    image: body.image ?? existing.image ?? '',
    gallery: safeJson(body.gallery, existing.gallery ? JSON.parse(existing.gallery || '[]') : []),
    specs: safeJson(body.specs, existing.specs ? JSON.parse(existing.specs || '{}') : {}),
    features: safeJson(body.features, existing.features ? JSON.parse(existing.features || '[]') : []),
    price: body.price === '' || body.price == null ? existing.price ?? null : Number(body.price),
    currency: body.currency ?? existing.currency ?? 'USD',
    price_on_request: toBoolInt(body.price_on_request, existing.price_on_request ?? 1),
    brand: body.brand ?? existing.brand ?? 'Bosco',
    origin: body.origin ?? existing.origin ?? '',
    capacity: body.capacity ?? existing.capacity ?? '',
    power: body.power ?? existing.power ?? '',
    dimensions: body.dimensions ?? existing.dimensions ?? '',
    warranty: body.warranty ?? existing.warranty ?? '',
    featured: toBoolInt(body.featured, existing.featured ?? 0),
    in_stock: toBoolInt(body.in_stock, existing.in_stock ?? 1),
    status: body.status || existing.status || 'published',
  };
}

products.get('/', async (c) => {
  const wantsAdmin = c.req.query('admin') === '1';
  let includeDrafts = false;

  if (wantsAdmin) {
    const header = c.req.header('Authorization') || '';
    if (header.startsWith('Bearer ')) {
      try {
        const { verifyToken } = await import('../lib/auth.js');
        verifyToken(header.slice(7));
        includeDrafts = true;
      } catch {
        includeDrafts = false;
      }
    }
  }

  return c.json({
    data: listProducts({
      categoryId: c.req.query('categoryId'),
      subcategoryId: c.req.query('subcategoryId'),
      featured: c.req.query('featured'),
      q: c.req.query('q'),
      status: includeDrafts ? c.req.query('status') : undefined,
      includeDrafts,
    }),
  });
});

products.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const product = queries.productBySlug.get(slug) || queries.productById.get(Number(slug));
  if (!product) return c.json({ message: 'Product not found.' }, 404);
  return c.json({
    data: mapProduct(product),
    similar: similarProducts(product),
  });
});

products.post('/', requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  try {
    const payload = productPayload(body);
    if (!payload.name) return c.json({ message: 'Product name is required.' }, 400);

    const result = queries.insertProduct.run(
      payload.category_id,
      payload.subcategory_id,
      payload.name,
      payload.slug,
      payload.model,
      payload.sku,
      payload.short_description,
      payload.description,
      payload.image,
      payload.gallery,
      payload.specs,
      payload.features,
      payload.price,
      payload.currency,
      payload.price_on_request,
      payload.brand,
      payload.origin,
      payload.capacity,
      payload.power,
      payload.dimensions,
      payload.warranty,
      payload.featured,
      payload.in_stock,
      payload.status
    );

    return c.json({ data: mapProduct(queries.productById.get(Number(result.lastInsertRowid))) }, 201);
  } catch (error) {
    return c.json({ message: error.message }, 400);
  }
});

products.put('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.productById.get(id);
  if (!existing) return c.json({ message: 'Product not found.' }, 404);

  const body = await c.req.json().catch(() => ({}));
  try {
    const payload = productPayload(body, existing);
    queries.updateProduct.run(
      payload.category_id,
      payload.subcategory_id,
      payload.name,
      payload.slug,
      payload.model,
      payload.sku,
      payload.short_description,
      payload.description,
      payload.image,
      payload.gallery,
      payload.specs,
      payload.features,
      payload.price,
      payload.currency,
      payload.price_on_request,
      payload.brand,
      payload.origin,
      payload.capacity,
      payload.power,
      payload.dimensions,
      payload.warranty,
      payload.featured,
      payload.in_stock,
      payload.status,
      id
    );
    return c.json({ data: mapProduct(queries.productById.get(id)) });
  } catch (error) {
    return c.json({ message: error.message }, 400);
  }
});

products.delete('/:id', requireAdmin, (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.productById.get(id);
  if (!existing) return c.json({ message: 'Product not found.' }, 404);
  queries.deleteProduct.run(id);
  return c.json({ ok: true });
});

export default products;

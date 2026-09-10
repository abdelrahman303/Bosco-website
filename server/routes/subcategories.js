import { Hono } from 'hono';
import { mapSubcategory, queries, uniqueSlug } from '../db.js';
import { requireAdmin } from '../lib/auth.js';
import { toInt } from '../lib/http.js';

const subcategories = new Hono();

subcategories.get('/', (c) => {
  const categoryId = c.req.query('categoryId');
  const rows = categoryId
    ? queries.subcategoriesByCategory.all(Number(categoryId))
    : queries.allSubcategories.all();
  return c.json({ data: rows.map(mapSubcategory) });
});

subcategories.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const subcategory = queries.subcategoryBySlug.get(slug) || queries.subcategoryById.get(Number(slug));
  if (!subcategory) return c.json({ message: 'Subcategory not found.' }, 404);
  return c.json({ data: mapSubcategory(subcategory) });
});

subcategories.post('/', requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return c.json({ message: 'Subcategory name is required.' }, 400);
  if (!body.category_id) return c.json({ message: 'Parent category is required.' }, 400);

  const category = queries.categoryById.get(Number(body.category_id));
  if (!category) return c.json({ message: 'Parent category not found.' }, 400);

  const result = queries.insertSubcategory.run(
    Number(body.category_id),
    body.name.trim(),
    (body.name_ar || '').trim(),
    uniqueSlug('subcategories', body.slug || body.name),
    body.description || '',
    body.description_ar || '',
    body.image || '',
    toInt(body.sort_order, 0)
  );

  return c.json({ data: mapSubcategory(queries.subcategoryById.get(Number(result.lastInsertRowid))) }, 201);
});

subcategories.put('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.subcategoryById.get(id);
  if (!existing) return c.json({ message: 'Subcategory not found.' }, 404);

  const body = await c.req.json().catch(() => ({}));
  const categoryId = toInt(body.category_id, existing.category_id);
  if (!queries.categoryById.get(categoryId)) {
    return c.json({ message: 'Parent category not found.' }, 400);
  }

  queries.updateSubcategory.run(
    categoryId,
    body.name?.trim() || existing.name,
    body.name_ar != null ? String(body.name_ar).trim() : existing.name_ar || '',
    uniqueSlug('subcategories', body.slug || body.name || existing.name, id),
    body.description ?? existing.description,
    body.description_ar != null ? body.description_ar : existing.description_ar || '',
    body.image ?? existing.image,
    toInt(body.sort_order, existing.sort_order),
    id
  );

  return c.json({ data: mapSubcategory(queries.subcategoryById.get(id)) });
});

subcategories.delete('/:id', requireAdmin, (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.subcategoryById.get(id);
  if (!existing) return c.json({ message: 'Subcategory not found.' }, 404);
  queries.deleteSubcategory.run(id);
  return c.json({ ok: true });
});

export default subcategories;

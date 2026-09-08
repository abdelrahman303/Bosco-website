import { Hono } from 'hono';
import { mapCategory, queries, uniqueSlug } from '../db.js';
import { requireAdmin } from '../lib/auth.js';
import { toBoolInt, toInt } from '../lib/http.js';

const categories = new Hono();

categories.get('/', (c) => {
  return c.json({ data: queries.allCategories.all().map((row) => mapCategory(row)) });
});

categories.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const category = queries.categoryBySlug.get(slug) || queries.categoryById.get(Number(slug));
  if (!category) return c.json({ message: 'Category not found.' }, 404);

  const subcategories = queries.subcategoriesByCategory.all(category.id);
  return c.json({
    data: {
      ...mapCategory(category),
      subcategories,
    },
  });
});

categories.post('/', requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return c.json({ message: 'Category name is required.' }, 400);

  const result = queries.insertCategory.run(
    body.name.trim(),
    uniqueSlug('categories', body.slug || body.name),
    body.description || '',
    body.image || '',
    body.icon || 'FiBox',
    toInt(body.sort_order, 0),
    toBoolInt(body.featured, 1)
  );

  return c.json({ data: mapCategory(queries.categoryById.get(Number(result.lastInsertRowid))) }, 201);
});

categories.put('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.categoryById.get(id);
  if (!existing) return c.json({ message: 'Category not found.' }, 404);

  const body = await c.req.json().catch(() => ({}));
  queries.updateCategory.run(
    body.name?.trim() || existing.name,
    uniqueSlug('categories', body.slug || body.name || existing.name, id),
    body.description ?? existing.description,
    body.image ?? existing.image,
    body.icon ?? existing.icon,
    toInt(body.sort_order, existing.sort_order),
    toBoolInt(body.featured, existing.featured),
    id
  );

  return c.json({ data: mapCategory(queries.categoryById.get(id)) });
});

categories.delete('/:id', requireAdmin, (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.categoryById.get(id);
  if (!existing) return c.json({ message: 'Category not found.' }, 404);
  queries.deleteCategory.run(id);
  return c.json({ ok: true });
});

export default categories;

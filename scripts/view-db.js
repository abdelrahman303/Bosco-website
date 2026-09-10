/**
 * Print a clean summary of seeded/generated DB tables (no password hashes).
 * Usage: node --experimental-sqlite scripts/view-db.js
 */
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('server/data/bosco.db');

function section(title, rows) {
  console.log(`\n========== ${title} (${rows.length}) ==========`);
  console.table(rows);
}

section(
  'admins',
  db.prepare('SELECT id, email, name, created_at FROM admins ORDER BY id').all()
);

section(
  'categories',
  db
    .prepare(
      `SELECT id, name, name_ar, slug, sort_order, featured,
        (SELECT COUNT(*) FROM subcategories s WHERE s.category_id = c.id) AS subcategories,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS products
       FROM categories c ORDER BY sort_order, id`
    )
    .all()
);

section(
  'subcategories',
  db
    .prepare(
      `SELECT s.id, s.name, s.name_ar, s.slug, c.name AS category, s.sort_order
       FROM subcategories s
       LEFT JOIN categories c ON c.id = s.category_id
       ORDER BY s.sort_order, s.id`
    )
    .all()
);

section(
  'products',
  db
    .prepare(
      `SELECT p.id, p.name, p.model, p.sku, p.status, p.featured, p.price, p.currency,
              c.name AS category, s.name AS subcategory
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN subcategories s ON s.id = p.subcategory_id
       ORDER BY p.id`
    )
    .all()
);

section(
  'inquiries / quotes',
  db
    .prepare(
      `SELECT i.id, i.name, i.email, i.company, i.phone, i.status, i.product_id, i.created_at
       FROM inquiries i ORDER BY i.id`
    )
    .all()
);

section(
  'email_logs',
  db
    .prepare(
      `SELECT id, to_email, subject, status, sent_by, created_at
       FROM email_logs ORDER BY id`
    )
    .all()
);

console.log('\nDatabase file: server/data/bosco.db');
console.log('Create admin: node --experimental-sqlite scripts/create-admin.js email password "Name"');

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isServerless = Boolean(process.env.VERCEL);
const dataDir = isServerless ? path.join('/tmp', 'bosco-data') : path.join(__dirname, 'data');
const uploadDir = isServerless ? path.join('/tmp', 'bosco-uploads') : path.join(__dirname, 'uploads');

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

export const UPLOAD_DIR = uploadDir;

const db = new DatabaseSync(path.join(dataDir, 'bosco.db'));
if (!isServerless) db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    icon TEXT DEFAULT 'FiBox',
    sort_order INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    model TEXT DEFAULT '',
    sku TEXT DEFAULT '',
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    gallery TEXT DEFAULT '[]',
    specs TEXT DEFAULT '{}',
    features TEXT DEFAULT '[]',
    price REAL,
    currency TEXT DEFAULT 'USD',
    price_on_request INTEGER DEFAULT 1,
    brand TEXT DEFAULT 'Bosco',
    origin TEXT DEFAULT '',
    capacity TEXT DEFAULT '',
    power TEXT DEFAULT '',
    dimensions TEXT DEFAULT '',
    warranty TEXT DEFAULT '',
    featured INTEGER DEFAULT 0,
    in_stock INTEGER DEFAULT 1,
    status TEXT DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    message TEXT NOT NULL,
    product_id INTEGER,
    status TEXT DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function ensureColumn(table, column, definition = "TEXT NOT NULL DEFAULT ''") {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((col) => col.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn('categories', 'name_ar');
ensureColumn('categories', 'description_ar');
ensureColumn('subcategories', 'name_ar');
ensureColumn('subcategories', 'description_ar');
ensureColumn('products', 'name_ar');
ensureColumn('products', 'short_description_ar');
ensureColumn('products', 'description_ar');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

export function uniqueSlug(table, name, excludeId = null) {
  const allowed = new Set(['categories', 'subcategories', 'products']);
  if (!allowed.has(table)) throw new Error('Invalid table');

  const base = slugify(name);
  let slug = base;
  let i = 2;

  while (true) {
    const existing = excludeId
      ? db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`).get(slug, excludeId)
      : db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(slug);
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

export function parseJson(value, fallback) {
  try {
    return JSON.parse(value || '') ?? fallback;
  } catch {
    return fallback;
  }
}

export function mapCategory(row, extras = {}) {
  if (!row) return null;
  return {
    ...row,
    featured: Boolean(row.featured),
    ...extras,
  };
}

export function mapSubcategory(row) {
  if (!row) return null;
  return { ...row };
}

export function mapProduct(row) {
  if (!row) return null;
  return {
    ...row,
    gallery: parseJson(row.gallery, []),
    specs: parseJson(row.specs, {}),
    features: parseJson(row.features, []),
    featured: Boolean(row.featured),
    in_stock: Boolean(row.in_stock),
    price_on_request: Boolean(row.price_on_request),
    category: row.category_name
      ? {
          id: row.category_id,
          name: row.category_name,
          name_ar: row.category_name_ar || '',
          slug: row.category_slug,
        }
      : undefined,
    subcategory: row.subcategory_name
      ? {
          id: row.subcategory_id,
          name: row.subcategory_name,
          name_ar: row.subcategory_name_ar || '',
          slug: row.subcategory_slug,
        }
      : undefined,
  };
}

const PRODUCT_SELECT = `
  SELECT
    p.*,
    c.name AS category_name,
    c.name_ar AS category_name_ar,
    c.slug AS category_slug,
    s.name AS subcategory_name,
    s.name_ar AS subcategory_name_ar,
    s.slug AS subcategory_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN subcategories s ON s.id = p.subcategory_id
`;

export const queries = {
  adminByEmail: db.prepare('SELECT * FROM admins WHERE email = ?'),
  adminById: db.prepare('SELECT id, email, name, created_at FROM admins WHERE id = ?'),
  insertAdmin: db.prepare('INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)'),

  allCategories: db.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM subcategories s WHERE s.category_id = c.id) AS subcategory_count,
      (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status = 'published') AS product_count
    FROM categories c
    ORDER BY c.sort_order ASC, c.name ASC
  `),
  categoryById: db.prepare('SELECT * FROM categories WHERE id = ?'),
  categoryBySlug: db.prepare('SELECT * FROM categories WHERE slug = ?'),
  insertCategory: db.prepare(`
    INSERT INTO categories (name, name_ar, slug, description, description_ar, image, icon, sort_order, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateCategory: db.prepare(`
    UPDATE categories
    SET name = ?, name_ar = ?, slug = ?, description = ?, description_ar = ?, image = ?, icon = ?, sort_order = ?, featured = ?, updated_at = datetime('now')
    WHERE id = ?
  `),
  deleteCategory: db.prepare('DELETE FROM categories WHERE id = ?'),

  allSubcategories: db.prepare(`
    SELECT s.*, c.name AS category_name, c.slug AS category_slug
    FROM subcategories s
    LEFT JOIN categories c ON c.id = s.category_id
    ORDER BY s.sort_order ASC, s.name ASC
  `),
  subcategoriesByCategory: db.prepare(`
    SELECT s.*,
      (SELECT COUNT(*) FROM products p WHERE p.subcategory_id = s.id AND p.status = 'published') AS product_count
    FROM subcategories s
    WHERE s.category_id = ?
    ORDER BY s.sort_order ASC, s.name ASC
  `),
  subcategoryById: db.prepare('SELECT * FROM subcategories WHERE id = ?'),
  subcategoryBySlug: db.prepare('SELECT * FROM subcategories WHERE slug = ?'),
  insertSubcategory: db.prepare(`
    INSERT INTO subcategories (category_id, name, name_ar, slug, description, description_ar, image, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateSubcategory: db.prepare(`
    UPDATE subcategories
    SET category_id = ?, name = ?, name_ar = ?, slug = ?, description = ?, description_ar = ?, image = ?, sort_order = ?, updated_at = datetime('now')
    WHERE id = ?
  `),
  deleteSubcategory: db.prepare('DELETE FROM subcategories WHERE id = ?'),

  productById: db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`),
  productBySlug: db.prepare(`${PRODUCT_SELECT} WHERE p.slug = ?`),
  insertProduct: db.prepare(`
    INSERT INTO products (
      category_id, subcategory_id, name, name_ar, slug, model, sku, short_description, short_description_ar, description, description_ar,
      image, gallery, specs, features, price, currency, price_on_request, brand, origin,
      capacity, power, dimensions, warranty, featured, in_stock, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateProduct: db.prepare(`
    UPDATE products SET
      category_id = ?, subcategory_id = ?, name = ?, name_ar = ?, slug = ?, model = ?, sku = ?,
      short_description = ?, short_description_ar = ?, description = ?, description_ar = ?, image = ?, gallery = ?, specs = ?, features = ?,
      price = ?, currency = ?, price_on_request = ?, brand = ?, origin = ?, capacity = ?,
      power = ?, dimensions = ?, warranty = ?, featured = ?, in_stock = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `),
  deleteProduct: db.prepare('DELETE FROM products WHERE id = ?'),

  insertInquiry: db.prepare(`
    INSERT INTO inquiries (name, email, company, phone, message, product_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  inquiryById: db.prepare(`
    SELECT
      i.*,
      p.name AS product_name,
      p.name_ar AS product_name_ar,
      p.slug AS product_slug,
      p.model AS product_model,
      p.sku AS product_sku,
      p.image AS product_image,
      p.short_description AS product_short_description,
      p.short_description_ar AS product_short_description_ar,
      p.description AS product_description,
      p.description_ar AS product_description_ar,
      p.price AS product_price,
      p.currency AS product_currency,
      p.price_on_request AS product_price_on_request,
      p.brand AS product_brand,
      p.origin AS product_origin,
      p.capacity AS product_capacity,
      p.power AS product_power,
      p.dimensions AS product_dimensions,
      p.warranty AS product_warranty,
      p.specs AS product_specs,
      p.features AS product_features,
      c.name AS category_name,
      c.name_ar AS category_name_ar,
      c.slug AS category_slug
    FROM inquiries i
    LEFT JOIN products p ON p.id = i.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE i.id = ?
  `),
  allInquiries: db.prepare(`
    SELECT
      i.*,
      p.name AS product_name,
      p.name_ar AS product_name_ar,
      p.slug AS product_slug,
      p.model AS product_model,
      p.sku AS product_sku,
      p.image AS product_image,
      p.short_description AS product_short_description,
      p.short_description_ar AS product_short_description_ar,
      p.description AS product_description,
      p.description_ar AS product_description_ar,
      p.price AS product_price,
      p.currency AS product_currency,
      p.price_on_request AS product_price_on_request,
      p.brand AS product_brand,
      p.origin AS product_origin,
      p.capacity AS product_capacity,
      p.power AS product_power,
      p.dimensions AS product_dimensions,
      p.warranty AS product_warranty,
      p.specs AS product_specs,
      p.features AS product_features,
      c.name AS category_name,
      c.name_ar AS category_name_ar,
      c.slug AS category_slug
    FROM inquiries i
    LEFT JOIN products p ON p.id = i.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY i.created_at DESC
  `),
  updateInquiryStatus: db.prepare(`
    UPDATE inquiries SET status = ? WHERE id = ?
  `),
  countCategories: db.prepare('SELECT COUNT(*) AS count FROM categories'),
  countSubcategories: db.prepare('SELECT COUNT(*) AS count FROM subcategories'),
  countProducts: db.prepare('SELECT COUNT(*) AS count FROM products'),
  countPublished: db.prepare("SELECT COUNT(*) AS count FROM products WHERE status = 'published'"),
  countFeatured: db.prepare('SELECT COUNT(*) AS count FROM products WHERE featured = 1'),
  countInquiries: db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new'"),
};

export function mapInquiry(row) {
  if (!row) return null;
  const product = row.product_id
    ? {
        id: row.product_id,
        name: row.product_name || '',
        name_ar: row.product_name_ar || '',
        slug: row.product_slug || '',
        model: row.product_model || '',
        sku: row.product_sku || '',
        image: row.product_image || '',
        short_description: row.product_short_description || '',
        short_description_ar: row.product_short_description_ar || '',
        description: row.product_description || '',
        description_ar: row.product_description_ar || '',
        price: row.product_price,
        currency: row.product_currency || 'USD',
        price_on_request: Boolean(row.product_price_on_request),
        brand: row.product_brand || '',
        origin: row.product_origin || '',
        capacity: row.product_capacity || '',
        power: row.product_power || '',
        dimensions: row.product_dimensions || '',
        warranty: row.product_warranty || '',
        specs: parseJson(row.product_specs, {}),
        features: parseJson(row.product_features, []),
        category: row.category_name
          ? {
              name: row.category_name,
              name_ar: row.category_name_ar || '',
              slug: row.category_slug || '',
            }
          : null,
      }
    : null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company || '',
    phone: row.phone || '',
    message: row.message,
    product_id: row.product_id,
    status: row.status || 'new',
    created_at: row.created_at,
    product_name: row.product_name || '',
    product_slug: row.product_slug || '',
    product,
  };
}

export function listProducts({
  categoryId,
  subcategoryId,
  featured,
  q,
  status,
  includeDrafts = false,
} = {}) {
  const clauses = [];
  const params = [];

  if (!includeDrafts) {
    clauses.push("p.status = 'published'");
  } else if (status) {
    clauses.push('p.status = ?');
    params.push(status);
  }

  if (categoryId) {
    clauses.push('p.category_id = ?');
    params.push(Number(categoryId));
  }
  if (subcategoryId) {
    clauses.push('p.subcategory_id = ?');
    params.push(Number(subcategoryId));
  }
  if (featured === '1' || featured === true) {
    clauses.push('p.featured = 1');
  }
  if (q) {
    clauses.push(
      '(p.name LIKE ? OR p.name_ar LIKE ? OR p.model LIKE ? OR p.short_description LIKE ? OR p.short_description_ar LIKE ? OR p.sku LIKE ?)'
    );
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const stmt = db.prepare(`${PRODUCT_SELECT} ${where} ORDER BY p.featured DESC, p.created_at DESC`);
  return stmt.all(...params).map(mapProduct);
}

export function similarProducts(product, limit = 4) {
  return db
    .prepare(
      `${PRODUCT_SELECT}
       WHERE p.status = 'published' AND p.id != ? AND p.category_id = ?
       ORDER BY p.featured DESC, p.created_at DESC
       LIMIT ?`
    )
    .all(product.id, product.category_id, limit)
    .map(mapProduct);
}

function seed() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (email && password) {
    const existingAdmin = queries.adminByEmail.get(email);
    if (!existingAdmin) {
      queries.insertAdmin.run(email, bcrypt.hashSync(password, 12), 'Bosco Admin');
      console.log(`Seeded admin from env: ${email}`);
    }
  } else {
    const adminCount = db.prepare('SELECT COUNT(*) AS count FROM admins').get().count;
    if (!adminCount) {
      console.warn(
        'No admin seeded. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env, or run: npm run create-admin -- <email> <password>'
      );
    }
  }

  if (queries.countCategories.get().count > 0) return;

  const categories = [
    {
      name: 'Packaging Machines',
      name_ar: 'آلات التعبئة والتغليف',
      description: 'High-speed vacuum, wrapping, sealing, and labeling systems for massive throughput.',
      description_ar: 'أنظمة تفريغ وتغليف وختم ولصق عالية السرعة لخطوط الإنتاج الكبيرة.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop',
      icon: 'FiBox',
      sort_order: 1,
    },
    {
      name: 'Filling Lines',
      name_ar: 'خطوط التعبئة',
      description: 'Precision liquid and powder automated filling systems built for regulated factories.',
      description_ar: 'أنظمة تعبئة سوائل ومساحيق آلية دقيقة للمصانع الخاضعة للرقابة.',
      image: 'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1400&auto=format&fit=crop',
      icon: 'FiDroplet',
      sort_order: 2,
    },
    {
      name: 'Raw Materials',
      name_ar: 'المواد الخام',
      description: 'Premium chemicals, food-grade inputs, and pharmaceutical-grade ingredients.',
      description_ar: 'كيماويات ومدخلات غذائية ومكونات صيدلانية عالية الجودة.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1400&auto=format&fit=crop',
      icon: 'FiLayers',
      sort_order: 3,
    },
    {
      name: 'Spare Parts',
      name_ar: 'قطع الغيار',
      description: 'Motors, sensors, belts, and vital maintenance components that keep lines running.',
      description_ar: 'محركات وحساسات وسيور ومكونات صيانة أساسية لاستمرار خطوط الإنتاج.',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1400&auto=format&fit=crop',
      icon: 'FiSettings',
      sort_order: 4,
    },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const slug = uniqueSlug('categories', cat.name);
    const result = queries.insertCategory.run(
      cat.name,
      cat.name_ar,
      slug,
      cat.description,
      cat.description_ar,
      cat.image,
      cat.icon,
      cat.sort_order,
      1
    );
    categoryIds[cat.name] = Number(result.lastInsertRowid);
  }

  const subcategories = [
    { category: 'Packaging Machines', name: 'Vacuum Sealers', name_ar: 'أجهزة اللحام بالتفريغ', description: 'Industrial vacuum and MAP sealing for food and pharma.', description_ar: 'لحام تفريغ وMAP صناعي للأغذية والأدوية.', image: 'https://images.unsplash.com/photo-1580983554972-2438848d5eb2?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Packaging Machines', name: 'Wrapping Systems', name_ar: 'أنظمة التغليف', description: 'Flow wrap, shrink, and stretch wrapping for high volume.', description_ar: 'تغليف تدفق وانكماش وتمدد للإنتاج الكبير.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Packaging Machines', name: 'Labeling Machines', name_ar: 'آلات اللصق', description: 'Rotary and linear labeling for multi-format bottles.', description_ar: 'لصق دوار وخطي لزجاجات متعددة الأشكال.', image: 'https://images.unsplash.com/photo-1611078608889-183424d852a3?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Filling Lines', name: 'Liquid Fillers', name_ar: 'ماكينات تعبئة السوائل', description: 'Volumetric and gravimetric liquid filling at industrial speed.', description_ar: 'تعبئة سوائل حجمية ووزنية بسرعة صناعية.', image: 'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Filling Lines', name: 'Powder Dosing', name_ar: 'تعبئة المساحيق', description: 'Dust-free powder and granule dosing units.', description_ar: 'وحدات جرعات مساحيق وحبيبات بدون غبار.', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Filling Lines', name: 'Complete Lines', name_ar: 'خطوط كاملة', description: 'Turnkey bottling and filling lines from rinse to pack.', description_ar: 'خطوط تعبئة وتغليف متكاملة من الشطف إلى التعبئة.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Raw Materials', name: 'Food-Grade Inputs', name_ar: 'مدخلات غذائية', description: 'Certified resins, additives, and processing ingredients.', description_ar: 'راتنجات وإضافات ومكونات معالجة معتمدة.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Raw Materials', name: 'Pharmaceutical APIs', name_ar: 'مواد فعالة صيدلانية', description: 'GMP-compliant active ingredients and excipients.', description_ar: 'مواد فعالة وسواغات مطابقة لـ GMP.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Spare Parts', name: 'Motors & Drives', name_ar: 'محركات ودوافع', description: 'Servo motors, inverters, and drive assemblies.', description_ar: 'محركات سيرفو ومحولات ومجموعات دفع.', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop' },
    { category: 'Spare Parts', name: 'Sensors & Controls', name_ar: 'حساسات وتحكم', description: 'Photoelectric, proximity, and PLC-ready sensor kits.', description_ar: 'حساسات ضوئية وتقريبية ومجموعات جاهزة لـ PLC.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
  ];

  const subcategoryIds = {};
  subcategories.forEach((sub, index) => {
    const slug = uniqueSlug('subcategories', sub.name);
    const result = queries.insertSubcategory.run(
      categoryIds[sub.category],
      sub.name,
      sub.name_ar,
      slug,
      sub.description,
      sub.description_ar,
      sub.image,
      index + 1
    );
    subcategoryIds[sub.name] = Number(result.lastInsertRowid);
  });

  const products = [
    {
      name: 'Automated Liquid Filler Pro',
      category: 'Filling Lines',
      subcategory: 'Liquid Fillers',
      model: 'ALF-Pro 12K',
      sku: 'BOS-ALF-12K',
      short_description: '12,000 bph liquid filling with 0.1% volume accuracy.',
      description:
        'The Automated Liquid Filler Pro is engineered for beverage, dairy, and personal-care plants that need speed without sacrificing fill accuracy. Servo-controlled nozzles, CIP-ready piping, and a hygienic stainless frame make it a flagship line for regulated production.',
      image: 'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1400&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1400&auto=format&fit=crop',
      ],
      specs: { Speed: '12,000 bph', Accuracy: '±0.1%', Nozzles: '16 servo', Material: 'SS 316L' },
      features: ['CIP / SIP ready', 'Recipe memory', 'HMI touch control', 'Low-foam nozzles'],
      price: 185000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Italy / Egypt assembly',
      capacity: '12,000 bottles per hour',
      power: '12 kW, 380V 50Hz',
      dimensions: '4200 × 1800 × 2200 mm',
      warranty: '24 months',
      featured: 1,
    },
    {
      name: 'Vacuum Sealer X-1000',
      category: 'Packaging Machines',
      subcategory: 'Vacuum Sealers',
      model: 'VS-X1000',
      sku: 'BOS-VS-X1000',
      short_description: 'Industrial-grade continuous vacuum sealing for food and medical packs.',
      description:
        'A heavy-duty chamber sealer designed for continuous shifts. Dual sealing bars, programmable vacuum cycles, and MAP gas flush keep product shelf life consistent across meat, cheese, and sterile medical kits.',
      image: 'https://images.unsplash.com/photo-1580983554972-2438848d5eb2?q=80&w=1400&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop'],
      specs: { Chamber: '1000 mm', Cycle: '3–5 cycles/min', Vacuum: 'Busch pump', Seal: 'Double bar' },
      features: ['MAP gas flush', 'Oil-free option', 'Digital recipes', 'Food-safe chamber'],
      price: 42000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Germany',
      capacity: 'Up to 8 packs / cycle',
      power: '3.5 kW',
      dimensions: '1400 × 900 × 1100 mm',
      warranty: '18 months',
      featured: 1,
    },
    {
      name: 'Rotary Labeling System',
      category: 'Packaging Machines',
      subcategory: 'Labeling Machines',
      model: 'RLS-360',
      sku: 'BOS-RLS-360',
      short_description: 'High-speed multi-format rotary labeling for glass and PET.',
      description:
        'Change formats in minutes. The RLS-360 applies body, neck, and back labels with optical orientation and vision inspection so every bottle leaving the line is retail-ready.',
      image: 'https://images.unsplash.com/photo-1611078608889-183424d852a3?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Speed: '24,000 bph', Stations: '3 labeling', Inspection: 'Vision camera' },
      features: ['Hot-melt or self-adhesive', 'Quick-change starwheels', 'Reject station'],
      price: 96000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Italy',
      capacity: '24,000 bph',
      power: '8 kW',
      dimensions: '3100 × 2100 × 2300 mm',
      warranty: '24 months',
      featured: 1,
    },
    {
      name: 'Flow Wrap System FW-800',
      category: 'Packaging Machines',
      subcategory: 'Wrapping Systems',
      model: 'FW-800',
      sku: 'BOS-FW-800',
      short_description: 'Continuous flow wrapping for bakery, confectionery, and hardware.',
      description:
        'Servo film feed and a sanitary infeed keep packs tight and aligned at high speed. Ideal for factories that need one wrapper to handle multiple SKU lengths.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Speed: '180 packs/min', Film: 'BOPP / PE', Cut: 'Rotary knife' },
      features: ['No-product no-bag', 'Date coder ready', 'Tool-less film change'],
      price: 38000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'China / EU spec',
      capacity: '180 packs per minute',
      power: '4.2 kW',
      dimensions: '4800 × 1100 × 1700 mm',
      warranty: '12 months',
      featured: 0,
    },
    {
      name: 'Powder Dosing Unit PD-50',
      category: 'Filling Lines',
      subcategory: 'Powder Dosing',
      model: 'PD-50',
      sku: 'BOS-PD-50',
      short_description: 'Volumetric, dust-free powder dosing for jars, pouches, and tins.',
      description:
        'Auger dosing with a closed hopper and dust extraction keeps the plant clean while holding tight fill weights on spices, protein, and pharma powders.',
      image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Range: '10–2000 g', Accuracy: '±0.5%', Hopper: '50 L' },
      features: ['Dust extraction port', 'Load-cell option', 'Easy-clean auger'],
      price: 27500,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Turkey',
      capacity: 'Up to 40 fills / min',
      power: '2.2 kW',
      dimensions: '900 × 800 × 2100 mm',
      warranty: '18 months',
      featured: 1,
    },
    {
      name: 'Complete Bottling Line BL-12K',
      category: 'Filling Lines',
      subcategory: 'Complete Lines',
      model: 'BL-12K',
      sku: 'BOS-BL-12K',
      short_description: 'Turnkey rinse-fill-cap-label line for water and juice plants.',
      description:
        'A complete production line covering rinsing, filling, capping, coding, labeling, and shrink wrapping. Bosco project engineers handle layout, installation, and operator training.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1513828646241-13783a48e7ba?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1400&auto=format&fit=crop',
      ],
      specs: { Output: '12,000 bph', Formats: '250 ml–2 L PET', Layout: 'Custom' },
      features: ['Turnkey install', 'Operator training', 'Spare kit included', 'Remote support'],
      price: 620000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'EU + Egypt',
      capacity: '12,000 bph complete line',
      power: '45 kW installed',
      dimensions: 'Site-specific layout',
      warranty: '24 months + service plan',
      featured: 1,
    },
    {
      name: 'Food-Grade HDPE Resin',
      category: 'Raw Materials',
      subcategory: 'Food-Grade Inputs',
      model: 'HDPE-FG',
      sku: 'BOS-HDPE-FG',
      short_description: 'Certified food-contact HDPE for bottles, caps, and containers.',
      description:
        'Consistent melt flow and documented food-contact compliance for converters supplying beverage and dairy plants across Egypt and the GCC.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Grade: 'Food contact', Form: 'Pellets', MFI: '0.35 g/10 min' },
      features: ['Lot traceability', 'COA with every shipment', 'Regional stock'],
      price: 1280,
      price_on_request: 0,
      brand: 'Bosco Supply',
      origin: 'Saudi Arabia',
      capacity: '25 kg bags / 1 MT jumbo',
      power: '—',
      dimensions: '—',
      warranty: 'Quality certificate',
      featured: 0,
    },
    {
      name: 'Pharmaceutical Lactose Excipient',
      category: 'Raw Materials',
      subcategory: 'Pharmaceutical APIs',
      model: 'LAC-PH',
      sku: 'BOS-LAC-PH',
      short_description: 'GMP lactose monohydrate for tablet and capsule production.',
      description:
        'Pharma-grade lactose sourced from audited facilities, with full DMF support and batch documentation for regulated manufacturers.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Purity: '99.9%', Grade: 'USP / EP', Mesh: '80–200' },
      features: ['GMP certified', 'DMF available', 'Sealed drums'],
      price: 4100,
      price_on_request: 1,
      brand: 'Bosco Pharma',
      origin: 'Netherlands',
      capacity: '25 kg drums',
      power: '—',
      dimensions: '—',
      warranty: 'COA + stability data',
      featured: 0,
    },
    {
      name: 'Servo Motor SM-400',
      category: 'Spare Parts',
      subcategory: 'Motors & Drives',
      model: 'SM-400',
      sku: 'BOS-SM-400',
      short_description: 'High-torque servo motor for fillers, wrappers, and conveyors.',
      description:
        'Drop-in servo replacement used across Bosco filling and packaging lines. Supplied with encoder cable and mounting kit.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Torque: '4.0 Nm', Voltage: '220V', Encoder: '17-bit' },
      features: ['IP65 housing', 'Matching drive available', 'Express shipping'],
      price: 890,
      price_on_request: 0,
      brand: 'Bosco Parts',
      origin: 'Japan',
      capacity: 'Continuous duty',
      power: '400 W',
      dimensions: '80 × 80 × 145 mm',
      warranty: '12 months',
      featured: 0,
    },
    {
      name: 'Photoelectric Sensor Kit',
      category: 'Spare Parts',
      subcategory: 'Sensors & Controls',
      model: 'PSK-12',
      sku: 'BOS-PSK-12',
      short_description: 'Line-ready photoelectric sensors for product detect and reject.',
      description:
        'A 12-piece industrial sensor kit with brackets and M12 leads, tuned for bottle, carton, and pouch detection on Bosco lines.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Range: '50–800 mm', Output: 'PNP/NPN', Connector: 'M12' },
      features: ['Teach-in button', 'Background suppression', 'Spare brackets'],
      price: 340,
      price_on_request: 0,
      brand: 'Bosco Parts',
      origin: 'Germany',
      capacity: '12 sensors / kit',
      power: '10–30 VDC',
      dimensions: 'Compact M18',
      warranty: '12 months',
      featured: 0,
    },
    {
      name: 'Conveyor Belt Master',
      category: 'Spare Parts',
      subcategory: 'Motors & Drives',
      model: 'CBM-HD',
      sku: 'BOS-CBM-HD',
      short_description: 'Heavy-duty modular belt with variable-speed drive.',
      description:
        'Sanitary modular belt conveyor for wet and dry areas. Variable speed, stainless side frames, and quick-release belt for washdown.',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Width: '400–800 mm', Load: '80 kg/m', Speed: '5–40 m/min' },
      features: ['Washdown ready', 'Variable VFD', 'Modular plastic belt'],
      price: 5400,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Egypt',
      capacity: 'Custom length',
      power: '0.75–1.5 kW',
      dimensions: 'Made to order',
      warranty: '12 months',
      featured: 1,
    },
    {
      name: 'Rotary Volumetric Filler R-240',
      category: 'Filling Lines',
      subcategory: 'Liquid Fillers',
      model: 'R-240',
      sku: 'BOS-R240',
      short_description: 'Compact rotary volumetric filler for oils, sauces, and chemicals.',
      description:
        'A 12-head rotary filler that handles viscous and foaming products with piston or flow-meter options. Built for plants that need reliability in a smaller footprint.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1400&auto=format&fit=crop',
      gallery: [],
      specs: { Heads: '12', Range: '100–1000 ml', Speed: '6,000 bph' },
      features: ['Viscous product kit', 'Drip-free nozzles', 'Recipe HMI'],
      price: 74000,
      price_on_request: 1,
      brand: 'Bosco',
      origin: 'Italy',
      capacity: '6,000 bph',
      power: '6.5 kW',
      dimensions: '2200 × 1800 × 2100 mm',
      warranty: '24 months',
      featured: 0,
    },
  ];

  for (const product of products) {
    queries.insertProduct.run(
      categoryIds[product.category],
      subcategoryIds[product.subcategory],
      product.name,
      product.name_ar || '',
      uniqueSlug('products', product.name),
      product.model,
      product.sku,
      product.short_description,
      product.short_description_ar || '',
      product.description,
      product.description_ar || '',
      product.image,
      JSON.stringify(product.gallery),
      JSON.stringify(product.specs),
      JSON.stringify(product.features),
      product.price,
      'USD',
      product.price_on_request,
      product.brand,
      product.origin,
      product.capacity,
      product.power,
      product.dimensions,
      product.warranty,
      product.featured,
      1,
      'published'
    );
  }
}

function backfillArabic() {
  const categoryAr = {
    'Packaging Machines': ['آلات التعبئة والتغليف', 'أنظمة تفريغ وتغليف وختم ولصق عالية السرعة لخطوط الإنتاج الكبيرة.'],
    'Filling Lines': ['خطوط التعبئة', 'أنظمة تعبئة سوائل ومساحيق آلية دقيقة للمصانع الخاضعة للرقابة.'],
    'Raw Materials': ['المواد الخام', 'كيماويات ومدخلات غذائية ومكونات صيدلانية عالية الجودة.'],
    'Spare Parts': ['قطع الغيار', 'محركات وحساسات وسيور ومكونات صيانة أساسية لاستمرار خطوط الإنتاج.'],
  };
  const subcategoryAr = {
    'Vacuum Sealers': ['أجهزة اللحام بالتفريغ', 'لحام تفريغ وMAP صناعي للأغذية والأدوية.'],
    'Wrapping Systems': ['أنظمة التغليف', 'تغليف تدفق وانكماش وتمدد للإنتاج الكبير.'],
    'Labeling Machines': ['آلات اللصق', 'لصق دوار وخطي لزجاجات متعددة الأشكال.'],
    'Liquid Fillers': ['ماكينات تعبئة السوائل', 'تعبئة سوائل حجمية ووزنية بسرعة صناعية.'],
    'Powder Dosing': ['تعبئة المساحيق', 'وحدات جرعات مساحيق وحبيبات بدون غبار.'],
    'Complete Lines': ['خطوط كاملة', 'خطوط تعبئة وتغليف متكاملة من الشطف إلى التعبئة.'],
    'Food-Grade Inputs': ['مدخلات غذائية', 'راتنجات وإضافات ومكونات معالجة معتمدة.'],
    'Pharmaceutical APIs': ['مواد فعالة صيدلانية', 'مواد فعالة وسواغات مطابقة لـ GMP.'],
    'Motors & Drives': ['محركات ودوافع', 'محركات سيرفو ومحولات ومجموعات دفع.'],
    'Sensors & Controls': ['حساسات وتحكم', 'حساسات ضوئية وتقريبية ومجموعات جاهزة لـ PLC.'],
  };
  const productAr = {
    'Automated Liquid Filler Pro': [
      'آلة تعبئة السوائل الآلية برو',
      'تعبئة سوائل بسرعة 12,000 زجاجة/ساعة بدقة حجم ±0.1%.',
      'مصممة لمصانع المشروبات والألبان والعناية الشخصية بسرعة عالية ودقة تعبئة موثوقة.',
    ],
    'Vacuum Sealer X-1000': [
      'جهاز لحام بالتفريغ X-1000',
      'لحام تفريغ صناعي مستمر لتعبئة الأغذية والطبية.',
      'غرفة صناعية للورديات المستمرة مع قضبان لحام مزدوجة ودورات تفريغ قابلة للبرمجة.',
    ],
    'Rotary Labeling System': [
      'نظام لصق دوار',
      'لصق دوار عالي السرعة لزجاجات الزجاج والـ PET.',
      'يطبق ملصقات الجسم والرقبة والخلف مع توجيه بصري وفحص رؤية.',
    ],
    'Flow Wrap System FW-800': [
      'نظام تغليف تدفق FW-800',
      'تغليف تدفق مستمر للمخبوزات والحلويات والأدوات.',
      'تغذية فيلم سيرفو ومدخل صحي للحفاظ على المحاذاة بسرعة عالية.',
    ],
    'Powder Dosing Unit PD-50': [
      'وحدة جرعات مساحيق PD-50',
      'جرعات مساحيق حجمية بدون غبار للبرطمانات والأكياس.',
      'جرعات بريمة مع قادوس مغلق واستخراج غبار لأوزان تعبئة دقيقة.',
    ],
    'Conveyor Belt Master': [
      'سير ناقل ماستر',
      'سير ناقل صناعي مخصص لخطوط التعبئة والتغليف.',
      'حلول نقل معيارية لإبقاء خطوط الإنتاج متصلة وموثوقة.',
    ],
    'Complete Bottling Line BL-12K': [
      'خط تعبئة زجاجات كامل BL-12K',
      'خط تعبئة وتغليف متكامل من الشطف إلى التغليف.',
      'خط جاهز للتشغيل يربط الغسيل والتعبئة والتغطية والوسم.',
    ],
    'Food-Grade HDPE Resin': [
      'راتنج HDPE غذائي',
      'راتنج بولي إيثيلين عالي الكثافة صالح للأغذية.',
      'مدخلات بوليمر معتمدة لتطبيقات التعبئة الغذائية والصناعية.',
    ],
    'Pharmaceutical Lactose Excipient': [
      'سواغ لاكتوز صيدلاني',
      'لاكتوز صيدلاني مطابق لمواصفات GMP.',
      'سواغ عالي النقاء لتصنيع الأقراص والكبسولات.',
    ],
    'Servo Motor SM-400': [
      'محرك سيرفو SM-400',
      'محرك سيرفو صناعي لأنظمة التعبئة والدفع.',
      'محرك دقيق للعزم والاستجابة السريعة في خطوط الإنتاج.',
    ],
    'Photoelectric Sensor Kit': [
      'طقم حساسات كهروضوئية',
      'طقم حساسات جاهز للتحكم في خطوط التعبئة.',
      'حساسات موثوقة للكشف والمحاذاة والرفض على الخط.',
    ],
    'Rotary Volumetric Filler R-240': [
      'آلة تعبئة حجمية دوارة R-240',
      'تعبئة حجمية دوارة مدمجة للزيوت والصلصات والكيماويات.',
      'تعبئة دوارة بـ 12 رأس للمنتجات اللزجة والرغوية.',
    ],
  };

  const updateCat = db.prepare(
    `UPDATE categories SET name_ar = ?, description_ar = ? WHERE name = ? AND (name_ar IS NULL OR name_ar = '')`
  );
  for (const [name, [nameAr, descAr]] of Object.entries(categoryAr)) {
    updateCat.run(nameAr, descAr, name);
  }

  const updateSub = db.prepare(
    `UPDATE subcategories SET name_ar = ?, description_ar = ? WHERE name = ? AND (name_ar IS NULL OR name_ar = '')`
  );
  for (const [name, [nameAr, descAr]] of Object.entries(subcategoryAr)) {
    updateSub.run(nameAr, descAr, name);
  }

  const updateProd = db.prepare(
    `UPDATE products
     SET name_ar = ?, short_description_ar = ?, description_ar = ?
     WHERE name = ? AND (name_ar IS NULL OR name_ar = '')`
  );
  for (const [name, [nameAr, shortAr, descAr]] of Object.entries(productAr)) {
    updateProd.run(nameAr, shortAr, descAr, name);
  }
}

seed();
backfillArabic();

export default db;

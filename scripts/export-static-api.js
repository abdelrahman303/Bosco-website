import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  listProducts,
  mapCategory,
  mapProduct,
  mapSubcategory,
  queries,
  similarProducts,
} from '../server/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'static-api');

fs.mkdirSync(outDir, { recursive: true });

const products = listProducts();
const categories = queries.allCategories.all().map((row) => mapCategory(row));
const subcategories = queries.allSubcategories.all().map(mapSubcategory);

const productByKey = {};
for (const product of products) {
  const row = queries.productBySlug.get(product.slug);
  const payload = { data: mapProduct(row), similar: similarProducts(row) };
  productByKey[product.slug] = payload;
  productByKey[String(product.id)] = payload;
}

const categoryByKey = {};
for (const category of categories) {
  const row = queries.categoryBySlug.get(category.slug);
  const payload = {
    data: {
      ...mapCategory(row),
      subcategories: queries.subcategoriesByCategory.all(row.id),
    },
  };
  categoryByKey[category.slug] = payload;
  categoryByKey[String(category.id)] = payload;
}

const subcategoryByKey = {};
for (const subcategory of subcategories) {
  const payload = { data: subcategory };
  subcategoryByKey[subcategory.slug] = payload;
  subcategoryByKey[String(subcategory.id)] = payload;
}

const catalog = {
  generatedAt: new Date().toISOString(),
  health: { ok: true, service: 'bosco-static-api' },
  products,
  categories,
  subcategories,
  productByKey,
  categoryByKey,
  subcategoryByKey,
};

fs.writeFileSync(path.join(outDir, 'catalog.json'), JSON.stringify(catalog));
console.log(`Wrote ${products.length} products to public/static-api/catalog.json`);

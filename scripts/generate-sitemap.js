const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site';
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const OUTPUT_PATH = path.join(process.cwd(), 'public/sitemap.xml');

// Get all articles
function getAllArticles() {
  const fileNames = fs.readdirSync(ARTICLES_DIR);
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(ARTICLES_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: data.slug || fileName.replace(/\.md$/, ''),
        date: data.date || new Date().toISOString(),
        category: data.category || 'general',
      };
    });
  
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get unique categories
function getAllCategories(articles) {
  const categories = [...new Set(articles.map(a => a.category))];
  return categories;
}

// Generate sitemap XML
function generateSitemap() {
  const articles = getAllArticles();
  const categories = getAllCategories(articles);
  const now = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';
  
  // Categories page
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/categories</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.7</priority>\n';
  xml += '  </url>\n';
  
  // About page
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/about</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.6</priority>\n';
  xml += '  </url>\n';
  
  // Articles
  articles.forEach(article => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/articles/${article.slug}</loc>\n`;
    xml += `    <lastmod>${article.date}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  // Category pages
  categories.forEach(category => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/category/${category}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Write sitemap to file
try {
  const sitemap = generateSitemap();
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
  console.log(`📄 Total URLs: ${sitemap.split('<url>').length - 1}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

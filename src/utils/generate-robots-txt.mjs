// scripts/generate-robots-txt.mjs
import fs from 'fs';
import path from 'path';

// This uses Vercel's specific environment variable, which is a reliable method.
const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

const content = `User-agent: *
${isProduction ? 'Allow: /' : 'Disallow: /'}
Sitemap: ${process.env.SITE || 'https://www.knowbrainertrivia.com.au'}/sitemap-index.xml`;

const filePath = path.join(process.cwd(), 'public', 'robots.txt');

console.log(`Generating robots.txt for a ${isProduction ? 'production' : 'preview'} environment...`);

fs.writeFileSync(filePath, content.trim());

console.log('Successfully generated public/robots.txt');
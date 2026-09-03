import fs from 'fs';
const e = fs.readFileSync('.env.production.local', 'utf8');
const m = {};
for (const l of e.split('\n')) {
  if (l.includes('=') && !l.startsWith('#')) {
    const k = l.split('=')[0];
    const v = l.split('=').slice(1).join('=').replace(/^"|"$/g, '');
    m[k] = v;
  }
}
console.log('BETTER_AUTH_URL:', m.BETTER_AUTH_URL);
console.log('GOOGLE_REDIRECT_URI:', m.GOOGLE_REDIRECT_URI);
console.log('GOOGLE_CLIENT_ID:', m.GOOGLE_CLIENT_ID?.substring(0, 30) + '...');
console.log('GOOGLE_CLIENT_SECRET present:', !!m.GOOGLE_CLIENT_SECRET);

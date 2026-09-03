import https from 'https';

const urls = [
  'https://tiles-gallery-pearl.vercel.app/api/auth/status',
  'https://tiles-gallery-pearl.vercel.app/api/auth/session',
  'https://tiles-gallery-pearl.vercel.app/api/auth/google/url?origin=https://tiles-gallery-pearl.vercel.app',
  'https://tiles-gallery-pearl.vercel.app/api/tiles',
  'https://tiles-gallery-pearl.vercel.app/',
];

for (const url of urls) {
  await new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        console.log('URL:', url);
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type'] || '(none)');
        console.log('Body (first 800 chars):', body.substring(0, 800));
        console.log('Body length:', body.length);
        console.log('---');
        resolve(null);
      });
    }).on('error', (e) => {
      console.log('URL:', url, 'Error:', e.message);
      console.log('---');
      resolve(null);
    });
  });
}

import https from 'https';

const BASE = 'https://tiles-gallery-pearl.vercel.app';
const urls = [
  `${BASE}/api/auth/status`,
  `${BASE}/api/auth/session`,
  `${BASE}/api/auth/google/url?origin=${BASE}`,
  `${BASE}/api/tiles`,
  `${BASE}/`,
];

function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve) => {
    if (redirectCount > 5) {
      console.log('URL:', url, 'Error: Too many redirects');
      console.log('---');
      resolve(null);
      return;
    }
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        console.log('URL:', url, '-> Redirect to:', redirectUrl);
        fetchUrl(redirectUrl, redirectCount + 1).then(() => resolve(null));
        return;
      }
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

for (const url of urls) {
  await fetchUrl(url);
}

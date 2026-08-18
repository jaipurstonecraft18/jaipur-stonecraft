import http from 'http';

function checkUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  console.log("Testing HTTP endpoints on Next.js server...");
  try {
    const home = await checkUrl('/');
    console.log("GET / -> Status:", home.statusCode, "Length:", home.body.length);

    const prods = await checkUrl('/products');
    console.log("GET /products -> Status:", prods.statusCode, "Length:", prods.body.length);

    const designs = await checkUrl('/designs/ganesh-ji/seated-ganesh-with-modak');
    console.log("GET /designs/ganesh-ji/seated-ganesh-with-modak -> Status:", designs.statusCode, "Length:", designs.body.length);

    console.log("HTTP tests complete!");
  } catch (err) {
    console.error("HTTP check error:", err.message);
  }
}

run();

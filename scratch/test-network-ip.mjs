import http from 'http';

http.get('http://192.168.29.36:3000/', (res) => {
  console.log(`Network IP http://192.168.29.36:3000/ status: HTTP ${res.statusCode} ${res.statusCode === 200 ? '✅ PASS' : '❌ FAIL'}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', (err) => {
  console.error(`❌ Could not connect to http://192.168.29.36:3000/:`, err.message);
  process.exit(1);
});

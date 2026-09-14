const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const def = '06_MediaKit_Beta.html';
const mime = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css', '.js': 'application/javascript',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json',
  '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
  if (!rel) rel = def;
  const fp = path.join(root, rel);
  if (!fp.startsWith(root)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404 - nao encontrado: ' + rel); }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, '0.0.0.0', () => {
  const ifaces = os.networkInterfaces();
  let ip = 'localhost';
  for (const n in ifaces) {
    for (const i of ifaces[n]) {
      if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.')) ip = i.address;
    }
  }
  console.log('==================================================');
  console.log('   Midia Kit PinguNana - servidor Node ATIVO');
  console.log('==================================================');
  console.log('   Neste PC:    http://localhost:' + port + '/');
  console.log('   Nesta rede:  http://' + ip + ':' + port + '/');
  console.log('');
  console.log('   Abra o endereco "Nesta rede" no celular/tablet');
  console.log('   conectado a MESMA rede Wi-Fi.');
  console.log('   Para PARAR: feche esta janela ou Ctrl+C');
  console.log('==================================================');
});

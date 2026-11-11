const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    try {
        // Normaliza a URL e remove query strings
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let decodedPathname = decodeURIComponent(parsedUrl.pathname);

        if (decodedPathname === '/') {
            decodedPathname = '/index.html';
        }

        const safePath = path.normalize(decodedPathname).replace(/^(\.\.[\/\\])+/, '');
        const filePath = path.join(BASE_DIR, safePath);

        // Previne acesso a pastas fora do diretório base
        if (!filePath.startsWith(BASE_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('403 Proibido');
            return;
        }

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`404 Não Encontrado: ${decodedPathname}`);
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': stats.size,
                'Access-Control-Allow-Origin': '*'
            });

            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Erro Interno do Servidor: ' + err.message);
    }
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`  Servidor Node.js iniciado com sucesso!`);
    console.log(`  Acesse a aplicação no navegador em:`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso. Tentando a porta ${Number(PORT) + 1}...`);
        server.listen(Number(PORT) + 1);
    } else {
        console.error('Erro no servidor:', e);
    }
});

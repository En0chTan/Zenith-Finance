require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('test-output.txt', body);
    });
});

const http = require('http');
const url = require('url');
const iconv = require('iconv-lite');

module.exports = function getPage(href) {
    return new Promise((resolve, reject) => {
        let link = url.parse(href);
        let options = {
            hostname: link.hostname,
            port: 80,
            method: 'GET',
            headers: {
                'Cookie': 'uid=4836786; pass=b7c4f8782513194183fea00106689a04'
            },
            path: link.path
        };
        let request = http.request(options, (res) => {
            let body = [];
            res
                .on('data', chunk => body.push(chunk))
                .on('end', () => {
                    body = Buffer.concat(body);
                    resolve(iconv.decode(body, 'win1251'));
                })
        });

        request.on('error', reject);

        request.end();
    });
};

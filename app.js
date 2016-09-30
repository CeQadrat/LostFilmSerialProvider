const request = require('request');
const http = require('http');
const searchParser = require('./parsers/lostFilmSearchParser');
const serialParser = require('./parsers/lostfilmSerialParser');
const iconv = require('iconv-lite');

function getPage(path) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'lostfilm.tv',
            port: 80,
            method: 'GET',
            headers: {
                'Cookie': 'uid=4836786; pass=b7c4f8782513194183fea00106689a04'
            },
            path
        };
        let request = http.request(options, (res) => {
            let body = [];
            res
                .on('data', chunk => body.push(chunk))
                .on('end', () => {
                    body = Buffer.concat(body);
                    resolve(iconv.decode(body,'win1251'));
                })
        });

        request.on('error', reject);

        request.end();
    });
}

getPage('/browse.php?cat=190')
    .then((body) => {
        console.log(serialParser.parse(body));
    })
    .catch(console.error);

// getPage('/serials.php')
//     .then((body) => {
//         for (let serial of searchParser.parse(body)){
//             console.log(serial);
//         }
//     })
//     .catch(console.error);

// getPage('/nrdr2.php?c=191&s=1&e=1')
//     .then((body) => {
//         console.log(body);
//     })
//     .catch(console.error);
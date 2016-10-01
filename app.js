const request = require('request');
const http = require('http');
const url = require('url');
const searchParser = require('./parsers/lostFilmSearchParser');
const serialParser = require('./parsers/lostfilmSerialParser');
const episodeParser = require('./parsers/lostFilmEpisodeParser');
const iconv = require('iconv-lite');

function getPage(href) {
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
}

// getPage('http://www.lostfilm.tv/browse.php?cat=190')
//     .then((body) => {
//         console.log(serialParser.parse(body));
//     })
//     .catch(console.error);

getPage('http://www.lostfilm.tv/serials.php')
    .then((body) => {
        for (let serial of searchParser.parse(body)){
            if(serial.name.toLowerCase() == 'мистер робот'){
                console.log(serial.code);
            }
        }
    })
    .catch(console.error);

// getPage('http://www.lostfilm.tv/nrdr2.php?c=191&s=1&e=1')
//     .then((body) => {
//         body = body.slice(body.indexOf('url='));
//         body = body.slice(4, body.indexOf('"'));
//         console.log(body);
//         getPage(body).then((page) => {
//             console.log(episodeParser.parse(page));
//         });
//     })
//     .catch(console.error);
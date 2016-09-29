const request = require('request');

function getPage(path) {
    return new Promise((resolve, reject) => {
        request.get({
                url: path,
                headers: {
                    'Cookie': 'uid=4836786; pass=b7c4f8782513194183fea00106689a04'
                }
            },
            function (err, httpResponse, body) {
                if (err) reject(err);
                resolve(body);
            });
    });
}

getPage('http://lostfilm.tv/nrdr2.php?c=191&s=1&e=1')
    .then((body) => {
        console.log(body);
    })
    .catch(console.error);
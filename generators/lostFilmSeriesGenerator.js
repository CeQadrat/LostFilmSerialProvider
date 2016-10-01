const getPage = require('./getPageRequest');
const episodeParser = require('../parsers/lostFilmEpisodeParser');

module.exports = function* getEpisode(series) {
    for (let episode of series) {
        let series = {
            serialName: episode.serialName,
            serialCode: episode.code,
            season: episode.season,
            series: episode.series,
            episodeName: episode.name,
            date: episode.date
        };
        yield new Promise((resolve, reject) => {
            let episode = series;
            getPage('http://www.lostfilm.tv/nrdr2.php?c=' + episode.serialCode + '&s=' + episode.season + '&e=' + episode.series)
                .then((body) => {
                    body = body.slice(body.indexOf('url='));
                    body = body.slice(4, body.indexOf('"'));
                    getPage(body).then((page) => {
                        episode.links = {
                            linksToWatch: null,
                            torrentLinks: episodeParser.parse(page)
                        };
                        resolve(episode);
                    }).catch(reject);
                })
                .catch(reject);
        });
    }
};

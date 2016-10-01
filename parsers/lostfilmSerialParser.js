const htmlParser = require('htmlparser2');

module.exports = {
    parse(page){
        return this._parse(page);
    },
    _parse(page){
        let enableParse = false;
        let enableParseEpisode = false;
        let enableParseName = false;
        let enableParseDate = false;
        let episode = {};
        let allNumberEpisodes = [];
        let parser = new htmlParser.Parser({
            onopentag: (name, attribs) => {
                if(name == 'div' && (attribs.class == 't_row even' || attribs.class=='t_row odd') && enableParse){
                    enableParseEpisode = true;
                }
                if(name == 'div' && attribs.class == 'mid'){
                    enableParse = true;
                }
                if(name == 'td' && attribs.class == 't_episode_title' && enableParseEpisode){
                    let numbers = attribs.onclick.slice(17,-2).split('\',\'');
                    episode.code = +numbers[0];
                    episode.season = +numbers[1];
                    episode.series = +numbers[2];
                    episode.name = '';
                    enableParseName = true;
                }
                if(name == 'span' && attribs.class == 'micro' && enableParseEpisode){
                    enableParseDate = true;
                }
            },
            ontext: (text) => {
                if(enableParseEpisode){
                    episode.name += text;
                }
                if(enableParseDate){
                    if(!episode.date){
                        episode.date = text;
                        let dataMas = text.split(' ').join('.').split(':').join('.').split('.');
                        episode.date = new Date(dataMas[2],dataMas[1]-1,dataMas[0],+dataMas[3]+3,+dataMas[4]);
                    }
                    enableParseDate = false;
                }
            },
            onclosetag: (tagname) => {
                if(tagname == 'td' && enableParseName){
                    enableParseName = false;
                    allNumberEpisodes.push(episode);
                    episode = {};
                }
                if(tagname == 'table' && enableParseEpisode){
                    enableParseEpisode = false;
                }
            },
            oncomment: (data) => {
                if(enableParse && data == ' ### Лента новостей '){
                    enableParse = false;
                }
            }
        }, {decodeEntities: true});
        parser.write(page);
        parser.end();
        return allNumberEpisodes;
    }
};

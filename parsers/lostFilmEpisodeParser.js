const htmlParser = require('htmlparser2');

module.exports = {
    parse(page){
        return this._parse(page);
    },
    _parse(page){
        let torrentLinks = [];
        let torrent = {};
        let enableParse = true;
        let enableParseInfo = false;
        let parser = new htmlParser.Parser({
            onopentag: (name, attribs) => {
                if(name == 'a' && enableParse){
                    torrent.link = attribs.href;
                }
                if(name == 'div' && enableParse && enableParseInfo){
                    enableParse = false;
                    enableParseInfo = false;
                    torrent.info = torrent.info.slice(2,-2);
                    torrentLinks.push(torrent);
                    torrent = {};
                }
            },
            ontext: (text) => {
                if(enableParseInfo){
                    if(!torrent.info) torrent.info = '';
                    torrent.info += text;
                }
            },
            onclosetag: (tagname) => {
                if(tagname == 'a' && enableParse){
                    enableParseInfo = true;
                }
                if(tagname == 'a' && !enableParse){
                    enableParse = true;
                }
            }
        }, {decodeEntities: true});
        parser.write(page);
        parser.end();
        return torrentLinks;
    }
};

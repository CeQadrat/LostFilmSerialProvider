const htmlParser = require('htmlparser2');

module.exports = {
    parse(page){
        return this._parse(page);
    },
    _parse(page){
        let enableParse = false;
        let enableParseSerial = false;
        let enableParseAllSerial = false;
        let serial = {};
        let allSerials = [];
        let parser = new htmlParser.Parser({
            onopentag: (name, attribs) => {
                if(name == 'div' && attribs.class == 'bb' && enableParseAllSerial){
                    enableParse = true;
                    console.log(1);
                }
                if(name == 'div' && attribs.class == 'mid'){
                    enableParseAllSerial = true;
                }
                if(name == 'a' && enableParse){
                    let link = attribs.href;
                    serial.code = link.slice(link.indexOf('cat=')+4);
                    enableParseSerial = true;
                }
            },
            ontext: (text) => {
                if(enableParseSerial){
                    serial.name = text;
                    enableParseSerial = false;
                }
            },
            onclosetag: (tagname) => {
                if(tagname == 'div' && enableParse){
                    enableParse = false;
                    enableParseAllSerial = false;
                }
                if(tagname == 'a' && enableParse){
                    allSerials.push(serial);
                    serial = {};
                }
            }
        }, {decodeEntities: true});
        parser.write(page);
        parser.end();
        return allSerials;
    }
}
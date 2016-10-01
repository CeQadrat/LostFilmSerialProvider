const LostFilmSP = require('./LostFilmSerialProvider');

let provider = new LostFilmSP('мистер робот');
provider.init().then(() => {
    let generator = provider.getSeries();
    generator.next().value.then((episode) => {
        console.log(episode);
    });
}).catch(console.error);

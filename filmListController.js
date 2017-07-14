const fs = require('fs');
const storage = 'filmListStorage.json';

module.exports = {
    loadListFromStorage: function () {
        return JSON.parse(fs.readFileSync(storage, 'utf8').replace(/\r\n/g,''))
    },
    updateStorage: function (list) {
        newStorage = JSON.stringify(list);
        return fs.writeFileSync(storage, newStorage)
    },
    loadFromFile : function (file) {
        var data = fs.readFileSync(__dirname + '/files/' + file, 'utf8');
            cleanUp = data.split('\n\n');
            filmObjArr = [];
            for ( var i = 0; i < cleanUp.length; i++ ) {
                if (cleanUp[i] !== '' && cleanUp[i]) {
                    filmObj = {
                        id: 0,
                        title: '',
                        year: '',
                        format: '',
                        stars: ''
                    };
                    var filmStr = cleanUp[i].split('\n');
                    if (filmStr.length === 4 && cleanUp[i].toUpperCase().indexOf('TITLE') !== -1 && cleanUp[i].toUpperCase().indexOf('STARS') !== -1) {
                        filmObj.id = (((1 + Math.random()) * 0x10000) | 0).toString(16);
                        for (var j = 0; j < 4; j++) {
                            switch (j) {
                                case 0: {
                                    filmObj.title = filmStr[j].replace('Title:', '').trim();
                                    break
                                }
                                case 1: {
                                    filmObj.year = filmStr[j].replace('Release Year:', '').trim();
                                    break
                                }
                                case 2: {
                                    filmObj.format = filmStr[j].replace('Format:', '').trim();
                                    break
                                }
                                case 3: {
                                    filmObj.stars = filmStr[j].replace('Stars:', '').trim();
                                }
                            }
                        }
                        filmObjArr.push(filmObj);
                    }
                }
            }
            return filmObjArr;
        }
};

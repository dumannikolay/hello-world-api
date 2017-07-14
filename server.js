const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const router = express.Router();
const port = 8080;
const fs = require('fs');
const filmList = require('./filmListController');


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(busboy());
app.use(express.static(__dirname + '/dist'));

var list = filmList.loadListFromStorage();
var response = JSON.stringify({result: 'ok'});

function updateList() {
    list = filmList.loadListFromStorage();
}

setInterval(updateList,1500);

router.get('/filmList', function (req, res) {
    res.json(list);
});

router.post('/addFilmToList', function (req, res) {
    req.body.id = (((1+Math.random())*0x10000)|0).toString(16);
    list.unshift(req.body);
    filmList.updateStorage(list);
    res.send(response)
});

router.post('/deleteFilmFromList', function (req, res) {
    list = removeByAttr(list, 'id', req.body.id);
    filmList.updateStorage(list);
    res.send(response)
});

router.post('/loadFomFile', function (req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            var fileFilmList = filmList.loadFromFile(filename);
            for (var i = 0; i < fileFilmList.length; i++) {
                list.unshift(fileFilmList[i]);
            }
            var fileResponse = {
                result: 'ok',
                loadedFilmsCount: fileFilmList.length
            };
            filmList.updateStorage(list);
            res.send(fileResponse);
        });
    });
});

app.use('/api', router);

var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value )) {

            arr.splice(i, 1);

        }
    }
    return arr;
};

app.listen(port);

console.log('API Started on http://localhost:8080/api');
console.log('U can check app on page: http://localhost:8080/');

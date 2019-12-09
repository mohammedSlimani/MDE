'use strict';
var plantuml = require('node-plantuml');
const fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));


function updateArray(diagArrElement, diagArrElement2, array) {

    let s = {
        Ord: diagArrElement['action'],
        Inh: diagArrElement2['action']
    };

    array.forEach((item) => {
        if (item['from'] === diagArrElement['from'] || item['from'] === diagArrElement['to'] || item['from'] === diagArrElement2['from']) {
            item['from'] = s;
        }
        if (item['to'] === diagArrElement['from'] || item['to'] === diagArrElement['to'] || item['to'] === diagArrElement2['from']) {
            item['to'] = s;
        }
    });

    return array;
}

app.post('/fromLCtoALC', (req, res, next) => {
    let myJson = req.body.lc;
    //console.log(myJson);

    var diagArr = [];
    var diagArr2 = [];

    let all = JSON.parse(myJson);
    all.forEach((item) => {
        let action = item['action'];
        if (action !== undefined) {
            let results = JSON.stringify(action).split(' ');
            let str = results[1].slice(0, -1);
            if (str[0] === str[0].toUpperCase()) {
                diagArr.push({
                    from: item['from'],
                    to: item['to'],
                    action: str
                })
            }
            diagArr2.push({
                from: item['from'],
                to: item['to'],
                action: str
            })

        } else {
            diagArr2.push({
                from: item['from'],
                to: item['to']
            });
        }
    });
    for (let i = 0; i < diagArr.length; i++) {

        for (let j = 0; j < diagArr.length; j++) {
            if (diagArr[j]['to'] === diagArr[i]['from'] && ((diagArr[j]['action'] === 'Go_up' && diagArr[i]['action'] === 'Go_dn') || (diagArr[i]['action'] === 'Go_up' && diagArr[j]['action'] === 'Go_dn'))) {
                updateArray(diagArr[i], diagArr[j], diagArr2);
            }
        }

    }

    diagArr2 = diagArr2.filter((item) => {
        return item['to'] !== item['from'];
    });
    res.send(diagArr2);
    console.log('done');
});

app.post('/Draw', (req, res, next) => {
    let myJson = req.body.uml;
    console.log(myJson);

    var gen = plantuml.generate(myJson);
    gen.out.pipe(fs.createWriteStream("output-file.png"));
});

app.listen(8080);
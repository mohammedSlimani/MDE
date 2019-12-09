'use strict';

const fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */













function updateArray(diagArrElement, diagArrElement2,array) {

let s = { Ord:  diagArrElement['action'] , Inh : diagArrElement2['action']};

    array.forEach((item) => {
       if (item['from'] === diagArrElement['from'] || item['from'] ===diagArrElement['to'] || item['from'] ===diagArrElement2['from']) {
            item['from'] = s;
       }
       if (item['to'] === diagArrElement['from'] || item['to'] ===diagArrElement['to'] || item['to'] ===diagArrElement2['from']){
           item['to'] = s;
       }
    });



return array;
}

function fromLCtoLAC() {


}

app.post('/fromLCtoALC',(req,res,next)=> {
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
                        diagArr.push({from: item['from'], to: item['to'], action: str})
                    }
                    diagArr2.push({from: item['from'], to: item['to'], action: str})

                } else {
                    diagArr2.push({from: item['from'], to: item['to']});
                }
            }
        );
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
        /*  fs.appendFile('result.txt', JSON.stringify(diagArr2), function (err) {
             if (err) throw err;
             console.log('Saved!');
         });
         return diagArr2; */

});

app.post('/Draw',(req,res,next)=> {
    let myJson = req.body.ALC;
    let todraw = JSON.parse(myJson);
    console.log(todraw);
}
);

app.listen(8080);
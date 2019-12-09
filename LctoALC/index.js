'use strict';
const plantuml = require('node-plantuml');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const app = express();
const axios = require('axios');
plantuml.useNailgun();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static("public"));

function updateArray(diagArrElement, diagArrElement2, array) {
    let s = {Ord: diagArrElement['action'], Inh: diagArrElement2['action']};
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

function fromLCtoLAC(lc) {
    let myJson = lc;
    //console.log(myJson);
    let diagArr = [];
    let diagArr2 = [];
    //myJson = JSON.parse(myJson);
    myJson.forEach((item) => {
            let action = item['action'];
            if (action !== undefined) {
                let results = JSON.stringify(action).split(' ');
                let str = results[1].slice(0, -1);
                //console.log(str);
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
    return diagArr2;

}

app.post('/Draw', (req, res, next) => {
        let myJson = req.body.uml;
        //console.log(myJson);

        var gen = plantuml.generate(myJson);
        gen.out.pipe(fs.createWriteStream("output-file.png"));
    }
);

app.get('/Home', (req, rep, next) => {
    rep.render('home.ejs');
    })
    .get('/Results', (req, rep, next) => {
        rep.render('result.ejs');
    });


app.post('/getInfo', async (req, rep, next) => {
    console.log(req.body.plantuml);
    const s = req.body.plantuml;
    await fs.writeFileSync('test.txt', req.body.plantuml, (err)=> {console.log('err',err)});
    console.log();
    let gen = plantuml.generate('test.txt');
    //decode.out.pipe(gen.in);
    gen.out.pipe(fs.createWriteStream("public/ImageGnerated/LC.png"));

    const resp = await axios.post('http://tromastrom.pythonanywhere.com/parse', {"uml": req.body.plantuml});

    console.log('LC JSON : ', resp.data);
    console.log();
    console.log();
    const resp2 = await axios.post('http://tromastrom.pythonanywhere.com/inverse', fromLCtoLAC(resp.data.lc));
    //let todraw =  resp2.data.uml;
    //console.log('Plaint Uml ToDraw : ' , todraw);
    const alcUml = resp2.data.uml.replace(/\n\.\.\.\.\n/g,'....');
    await fs.writeFileSync('test.txt',alcUml , (err)=> {console.log('err',err)});
    gen = plantuml.generate('test.txt');
    gen.out.pipe(fs.createWriteStream("public/ImageGnerated/ACL.png"));

    console.log();
    console.log();
    // var gen = plantuml.generate(todraw);
    //gen.out.pipe(fs.createWriteStream("LAC.png"));
    console.log("Ocl Contraints : ", req.body.ocl);
    console.log();
    console.log();
    console.log("DC", fromLCtoLAC(resp.data.lc));
    console.log();
    console.log();
    const resp3 = await axios.post('https://smed-dc.glitch.me/parse', {
        "source": fromLCtoLAC(resp.data.lc),
        'cdt': req.body.ocl
    });
    console.log("resp3", resp3.data.result);
    rep.render('result.ejs',{x:3})
    //rep.status(200).json({message:"success!"})

});
app.listen(8080, () => {
    console.log("Front End Started at http://localhost:8080/home")
});

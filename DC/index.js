// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser")
const lineReader= require('line-reader')
const Promise = require('bluebird')


app.use(cors())
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(bodyParser.json())



//Making a String Prototype 
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//Making reading line a promise
const eachLine = Promise.promisify(lineReader.eachLine);

const cdtParser =async  (fileName) =>{
    const cdts = {};
    try{
        await eachLine(fileName, (line)=>{
            let myLine = line
            .replaceAll('If', '')
            .replaceAll('Then','')
            .replaceAll('\\(','<')
            .replaceAll('\\)','>')
            .replaceAll('or','^')
            .replaceAll('\r','')
            .replaceAll('and','v')
            const cdt = myLine.split('Ord: ')
            if(cdt && cdt.length === 2){
                cdts[cdt[1]] = cdt[0]
            }
        })
    }catch(e){
        console.log("wtf",e)
    }
    return cdts;   
    
}

const stringParser = (str) =>{
    const cdts = {};

    const lines = str.split('\r\n');
    for(let i =0; i<lines.length; i++ ){
      const line =  lines[i].
      replaceAll('If', '')
            .replaceAll('Then','')
            .replaceAll('\\(','<')
            .replaceAll('\\)','>')
            .replaceAll('or','^')
            .replaceAll('and','v')
      const cdt = line.split('Ord: ')
            if(cdt.length === 2){
                cdts[cdt[1]] = cdt[0]
            }
    }
    console.log(cdts);
    return cdts
}

const merge = async (source, cdt) =>{
    // get the conditions
    //const cdts = await cdtParser(cdtFilePath);
    const cdts = stringParser(cdt)
    // check the "to" and "from" for objects, cz objects are what separates
    // controlled stated from uncontrolled states 
    // add attributes Ord_cdt and Inh_cdt 
    source.map( node => {
        if(node.to.constructor.name === "Object"){
            node.to.Ord_cdt = cdts[node.to.Ord];
            node.to.Inh_cdt = "--"
        }
        if(node.from.constructor.name === "Object"){
            node.from.Ord_cdt = cdts[node.from.Ord];
            node.from.Inh_cdt = "--"
        }
    })

    //return the new object
    source = source.map(x=>JSON.stringify(x));
    return source;
}



const sourceExample = [
    {
        "from": "start",
        "to": {
            "Ord": "Go_up",
            "Inh": "Go_dn"
        }
    },
    {
        "from": {
            "Ord": "Go_up",
            "Inh": "Go_dn"
        },
        "to": "2",
        "action": "dn"
    },
    {
        "from": "2",
        "to": {
            "Ord": "Go_dn",
            "Inh": "Go_up"
        },
        "action": "up"
    },
    {
        "from": {
            "Ord": "Go_dn",
            "Inh": "Go_up"
        },
        "to": "6",
        "action": "up"
    },
    {
        "from": "6",
        "to": {
            "Ord": "Go_up",
            "Inh": "Go_dn"
        },
        "action": "Go_up"
    }
]

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.use("/parse", async (req,res)=>{
  console.log('post has been caleled');
  const {source, cdt} = req.body;
  console.log("cdt", cdt);
    const result = await merge(source, cdt);
    res.json({result});
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

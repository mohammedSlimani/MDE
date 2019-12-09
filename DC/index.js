const lineReader= require('line-reader'),
        Promise = require('bluebird')

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
            .replaceAll('and','v')
            const cdt = myLine.split('Ord: ')
            if(cdt.length === 2){
                cdts[cdt[1]] = cdt[0]
            }
        })
    }catch(e){
        console.log(e)
    }
    return cdts;   
    
}

(async ()=>{
    console.log("cdtsPAAAAAAAA", await cdtParser());
})();


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

const merge = async (source, cdtFilePath) =>{
    // get the conditions
    const cdts = await cdtParser(cdtFilePath);
    
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
    return source;
}


 (async ()=>{
     const mergedSource = await merge(sourceExample, "./cdt.txt");
     console.log('result', mergedSource);
 })();
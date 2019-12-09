const lineReader= require('line-reader'),
        Promise = require('bluebird')

//Making a String Prototype 
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//Making reading line a promise
const eachLine = Promise.promisify(lineReader.eachLine);

const cdtParser =async  () =>{
    const cdts = [];
    await eachLine('./cdt.txt', (line)=>{
        let myLine = line
        .replaceAll('If', '')
        .replaceAll('Then','')
        .replaceAll('\\(','<')
        .replaceAll('\\)','>')
        .replaceAll('or','^')
        .replaceAll('and','v')
        cdts.push(myLine.split('Ord: '))
    })
    return cdts;   
    
}

(async ()=>{
    console.log("cdtsPAAAAAAAA", await cdtParser());
})();
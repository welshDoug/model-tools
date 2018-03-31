import * as fs from 'fs';
import {Parser} from 'json2csv';
// create a new converter object
const json2csv = new Parser();

var ocd = new Array(); 
var calib = new Array(); 
var model = new Object();
require('../data/euroevol2.js');

console.log("OCD Length: " + ocd.length);

const means = ocd.reduce((acc,date,i) => {
    if (date.likelihood && date.likelihood.mean) {
        acc.set(date.name, date.likelihood.mean);
    }
    return acc;
}, new Map());

//console.log(means);

let values = convertHashtoJSON(means);
const csv = json2csv.parse(values);
fs.writeFile('./data/euroevol2.csv', csv, { encoding: 'utf8' }, (err) => {
    if (err) throw err;
    console.log("file written");
});

function convertHashtoJSON(map) {
    let array = new Array();
    for (let [k,v] of map) {
        let obj = new Object();
        obj['C14ID'] = k;
        obj['CALIB_DATE'] = v;
        array.push(obj);
    }
    
    return array;
}
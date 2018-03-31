import {Converter} from 'csvtojson'; 
import * as fs from 'fs';
import {Parser} from 'json2csv';
// create a new converter object
const converter = new Converter({});
const json2csv = new Parser();


// Load Data
converter.fromFile("./data/dates.csv",function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An Error Has Occured");
        console.log(err);  
    } 
    let dateMatrix = calculateFirstNeolithic(result);
    let values = convertHashtoJSON(dateMatrix);
    const csv = json2csv.parse(values);
    fs.writeFile('./data/firstDates.csv', csv, { encoding: 'utf8' }, (err) => {
        if (err) throw err;
        console.log("file written");
    });
});

function extractDate(date) {
    return date.C14Age;
}

function extractRectID(date) {
    return date.RectID;
}

function convertHashtoJSON(map) {
    let array = new Array();
    for (let [k,v] of map) {
        let obj = new Object();
        obj['RectID'] = k;
        obj['Date'] = v;
        array.push(obj);
    }
    
    return array;
}

function calculateFirstNeolithic(dates) {
    return dates.reduce((acc, date, i) => {
        const rectID = extractRectID(date);
        const value = extractDate(date);
        
        if (!!date.Period &&['EBA','EMN','EN','IA','LBA','LMEN','LN','LNEBA','MBA','MLN','MN','UBA','UN'].includes(date.Period)) {
            const currentVal = acc.get(rectID);
            if (currentVal == undefined) {
                acc.set(rectID, value);
            }
            else {            
                if (value > currentVal) {
                    //If the new value is earlier replace it
                    acc.set(rectID, value);
                }
            }
        }
        return acc;
    }, new Map());
}
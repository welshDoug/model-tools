"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = require("csvtojson");
const fs = require("fs");
const json2csv_1 = require("json2csv");
// create a new converter object
const converter = new csvtojson_1.Converter({});
const json2csv = new json2csv_1.Parser();
// Load Data
converter.fromFile("./data/dates.csv", function (err, result) {
    // if an error has occured then handle it
    if (err) {
        console.log("An Error Has Occured");
        console.log(err);
    }
    let dateMatrix = calculateFirstNeolithic(result);
    let values = convertHashtoJSON(dateMatrix);
    const csv = json2csv.parse(values);
    fs.writeFile('./data/firstDates.csv', csv, { encoding: 'utf8' }, (err) => {
        if (err)
            throw err;
        console.log("file written");
    });
});
function extractDate(date) {
    return date.Calib_Date;
}
function extractRectID(date) {
    return date.RectID;
}
function convertHashtoJSON(map) {
    let array = new Array();
    for (let [k, v] of map) {
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
        if (!!date.Period && ['EBA', 'EMN', 'EN', 'IA', 'LBA', 'LN', 'LNEBA', 'MBA', 'MLN', 'MN', 'UBA', 'UN'].includes(date.Period)) {
            const currentVal = acc.get(rectID);
            if (currentVal == undefined) {
                acc.set(rectID, value);
            }
            else {
                if (value < currentVal) {
                    //If the new value is earlier replace it
                    acc.set(rectID, value);
                }
            }
        }
        return acc;
    }, new Map());
}
//TODO
/*
1. use a vlookup in excel to add calibrated dates to dates (or include file in here and lookup - could load file then convert to Map | possibly worth programatising the RectID lookup)
2. change comparisons to work with -ve numbers
3. re-gen first Neolithic dates file
*/ 

import * as d3 from 'd3';
import conflicts from '../data/conflicts.csv';

function getConflictsByYear(year) {
    let conflictsList = [];

    conflicts.forEach(conflic => {
        if (conflic.Date <= year && conflic.Date >= 1500) {
            conflictsList.push(conflic);
        }
    });

    return conflictsList;
}

//console.log(conflicts);

let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Changing year with mouse wheel (scroll)
let year = 1500;
let textYear = d3.select('#year');
let lastScrollTop = 0;

window.addEventListener('wheel', (e) => {  
    if (e.deltaY < 0) {
        if (year > 1500)    
            year--
    } else {
        if (year < 2022)    
            year++
    }
    textYear.text(year);
    
    console.log(getConflictsByYear(year));

})

let list = getConflictsByYear(1900);

//console.log(list);

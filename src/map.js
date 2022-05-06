import * as d3 from 'd3';
import conflicts from '../data/conflicts.csv';
import countries from '../data/countriesUpdated.csv';

/**
 * Function to get all conflicts that happend from 1500 to given year
 * @param {*} year 
 * @returns All conflict from 1500 to specified year
 */
function getConflictsByYear(year) {
    let conflictsList = [];

    conflicts.forEach(conflict => {
        if (conflict.Date <= year && conflict.Date >= 1500 
            || typeof conflict.Date == "string" && parseInt(conflict.Date.substring(0, 4)) <=  year && parseInt(conflict.Date.substring(0, 4)) >=  1500){
            conflictsList.push(conflict);
        }
    });

    return conflictsList;
}

/**
 * Function to get the number of time a country had a conflict up to the year given.
 * Will be used later to determine the radius of his circle.
 * @param {Array} conflictsList List of conflicts
 * @param {String} country Country you search
 * @param {Integer} year Up to what year to search
 * @returns Number of time a country had a conflict
 */
function countCountryOccurence(conflictsList, country, year) {
    let count = 3;
    conflictsList.forEach(conflict => {
        if (conflict.Country == country && conflict.Date <= year) {
            count+=.2;
        }
    });

    return count;
}

/**
 * Function to get all informations about a specified country (such as latitude, longitude, etc.)
 * @param {*} country The country searched
 * @returns The country fund or null if not fund
 */
function findCountryInList(country) {
    let countryFund = {}

    countries.forEach(c => {
        if (c.country == country) {
            countryFund = c;
        }
    });
    return countryFund;
}

let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

/** SCROLL EVENT **/
let year = 1500;
let textYear = d3.select('#year');

let conflictsList = []

// Define the card for hovering point
let card = d3.select("body").append("div")	
    .attr("class", "card")				
    .style("opacity", 0);

/**
 * Method to place points of conflicts on the map
 */
function placePoints() {
    conflictsList = getConflictsByYear(year)
    
    // Remove all circles
    svg.selectAll("circle").remove();

    // Place points
    conflictsList.forEach(conflict => {

        if (conflict.Country.includes(",")) {
            let allCountries = conflict.Country.split(",");
            allCountries = allCountries.map(function (element) {
                return element.trim();
            });

            let conflictToAdd = conflict;

            allCountries.forEach(country => {
                conflictToAdd.Country = country;
                conflictsList.push(conflictToAdd)
            });
 
        }
        

        let latitude = findCountryInList(conflict.Country).latitude;
        let longitude = findCountryInList(conflict.Country).longitude;
        let radius = countCountryOccurence(conflicts, conflict.Country, year);

        if (latitude != null) {

            let title = conflict.Headline;
            let description = conflict.Description;

            svg.append("circle")
            .attr("r",radius)
            .attr("fill","#B22222")
            .attr("fill-opacity", "0.3")
            .attr("transform", function() {
                return "translate(" + projection([longitude,latitude]) + ")";
            })
            .on('mouseover', function () {
                console.log();
                card.transition()
                     .duration('50')
                     card.html("<h3>" + title + "</h3><p>" + description + "</p>" + "<hr> <h4>" + conflict.Country + ", " + conflict.Date + "</h4>")
                     .style("height", "auto")
                     .style("left", window.event.clientX + "px")		
                     .style("top", window.event.clientY + "px")
                     .style("opacity", 1)
                     
            })
            .on('mouseout', function () {
                card.transition()
                     .duration('50')
                     .style("opacity", 0);
            })
        }
    });
}

// Increase/descrease year based on the mouse wheel rotation (scroll) 
// and place pou
/**
 * Increase/descrease year based on the mouse wheel rotation (scroll) 
 * and place points on map.
 */
window.addEventListener('wheel', (e) => {  
    if (e.deltaY < 0) {
        if (year > 1500)    
            year--
    } else {
        if (year < 2022)    
            year++
            
    }
    textYear.property('value', year);
    //textYear.text(year);

    placePoints();
})

textYear.on("change", inputYear)

function inputYear() {
    year = parseInt(textYear.property('value'));
    placePoints();
}

/** MAP **/
let svg = d3.select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("z-index", "0")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Map and projection
var projection = d3.geoNaturalEarth1()
    .scale(width / 1.5 / Math.PI)
    .translate([width / 2.2, height / 2])

let data = new Map();

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(d){
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // Set id
        .attr("id", function(d){ return d.properties.name;})
        .attr("fill", function(d) {
            // Make Antarctica disappear (fill)
            if (d.properties.name != "Antarctica") {
                return "#cdcdcd";
            } else {
                return "#ffffff";
            }
        })
        .style('stroke', function(d) {
            // Make Antarctica disappear (outline)
            if (d.properties.name != "Antarctica") {
                return "#9a9a9a";
            } else {
                return "#ffffff";
            }
        })


})

// Increase year on up button click
let upButton = d3.select("span.up").on("click", function() {
    if (year > 1500) { 
        year--
        textYear.text(year);
        placePoints();
    }
});

// Decrease year on down button click
let downButton = d3.select("span.down").on("click", function() {
    if (year < 2022) { 
        year++
        textYear.text(year);
        placePoints();
    }
});


let nIntervId;

function animate() {
    if (!nIntervId) {
          nIntervId = setInterval(play, 100);
    }
}

let i = 1500;

function play() {
    if(year == 2022) {
        stop
    } else { 
        year++;
        textYear.property('value', year);
        placePoints(); 
    }
    
}

function stop() {
    clearInterval(nIntervId);
    nIntervId = null;
  }

  document.getElementById("play").addEventListener("click", animate);
document.getElementById("stop").addEventListener("click", stop);



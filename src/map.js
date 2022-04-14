import * as d3 from 'd3';
import conflicts from '../data/conflicts.csv';
import countries from '../data/countries.csv';

/**
 * Function to get all conflicts that happend from 1500 to given year
 * @param {*} year 
 * @returns All conflict from 1500 to specified year
 */
function getConflictsByYear(year) {
    let conflictsList = [];

    conflicts.forEach(conflic => {
        if (conflic.Date <= year && conflic.Date >= 1500) {
            conflictsList.push(conflic);
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
        if (conflict.Country == country && conflict.Date <= year ) {
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

/**
 * Function to know how many lines a text is need to display a number of words.
 * @param {*} title Title of the conflict (headline)
 * @param {*} description Description of the conflict
 * @returns Number of line based on the words count
 */
function calculateNumberOfLines(title, description) {
    let titleWidth = title.split(" ").length;
    let descriptionWidth = description.split(" ").length;
    let nbrWords = titleWidth + descriptionWidth
    return Math.round(nbrWords/6);
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
    svg.selectAll("circle").remove()

    // Place points
    conflictsList.forEach(conflict => {

        let latitude = findCountryInList(conflict.Country).latitude;
        let longitude = findCountryInList(conflict.Country).longitude;
        let radius = countCountryOccurence(conflicts, conflict.Country, year);

        if (latitude != null) {

            let title = conflict.Headline;
            let description = conflict.Description;
            let nbrLines = calculateNumberOfLines(title,description)

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
                     .style("height", nbrLines*25 + "px");
                     card.html("<h3>" + title + "</h3><p>" + description + "</p>")	
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
    textYear.text(year);

    placePoints();
})

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

}).then(function(){
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
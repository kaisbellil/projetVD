import * as d3 from 'd3'

let img = d3.select('#img')

let i = 0;
let direction = true;

let nIntervId;

function animate() {
    if (!nIntervId) {
          nIntervId = setInterval(play, 10);
    }
}

function play() {
    if (i <= 170 && direction) {
        img.style("right",i + "px");
        i++;
    }
    if (i == 170) {
        direction = false;
    }
    if (i >= 15 && !direction) {
        img.style("right",i + "px");
        i--;
    }
    if (i == 15) {
        direction = true;
    }
    

    
}

function stop() {
    clearInterval(nIntervId);
    nIntervId = null;
}

animate();


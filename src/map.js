import * as d3 from 'd3'


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
})

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest();

let data 
let values

let heightScale 
let xScale
let xAxisScale
let yAxisScale

const w = 800
const h = 600
const padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', w)
    svg.attr('height', h)
}

let createScales = () => {

    heightScale = d3.scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([0, h - (padding * 2)])

    xScale = d3.scaleLinear()
    .domain([0, d3.max(values, (d) => values.length - 1)])
    .range([padding, w - padding])

    let dateArr = values.map(d =>  new Date(d[0]))

    xAxisScale = d3.scaleTime()
    .domain([d3.min(dateArr), d3.max(dateArr)])
    .range([padding, w - padding])

    yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([h - padding, padding])
}

let drawBars = () => {
    
    let tooltip = d3.select('#tooltip')

svg.selectAll('rect')
.data(values)
.enter()
.append('rect')
.attr('class', 'bar')
.attr('id', 'navy')
.attr('fill', '#448AFF')
.attr('width', (w - (2 * padding)) / values.length)
.attr('data-date', d => d[0])
.attr('data-gdp', d => d[1])
.attr('height', d => heightScale(d[1]))
.attr('x', (d, i) => xScale(i))
.attr('y', d => (h - padding) - heightScale(d[1]))
.on('mouseover', (event, d) => {
    tooltip.transition()
    .style('visibility', 'visible')
    
    tooltip.html(d[0] + '<br />' + '$' + d[1] + ' ' + 'Billion')
    .attr('data-date', d[0])
    .attr('height', 80)
    .attr('width', 120)
    .style('left', event.pageX + 10 + 'px')
})
.on('mouseout', () => {
    tooltip.transition()
    .style('visibility', 'hidden')
})
} 

let createAxis = () => {
let xAxis = d3.axisBottom(xAxisScale)

svg.append('g')
.call(xAxis)
.attr('id', 'x-axis')
.attr('transform', 'translate(0, ' + (h - padding) + ')')

let yAxis = d3.axisLeft(yAxisScale)

svg.append('g')
.call(yAxis)
.attr('id', 'y-axis')
.attr('transform', 'translate(' + padding + ', 0)')
}

req.open("GET",url,true);
req.send();
req.onload = function(){
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    createScales()
    drawBars()
    createAxis()
}
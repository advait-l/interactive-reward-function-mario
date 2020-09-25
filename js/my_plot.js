// SVG variables
var margin1 = {top: 20, right: 20, bottom: 30, left: 50},
   width1 = 400 - margin1.left - margin1.right,
   height1 = 200 - margin1.top - margin1.bottom;

// Append SVG attributes
var svg2 = d3.select("body").append("svg")
   .attr("width", width1 + margin1.left + margin1.right)
   .attr("height", height1 + margin1.top + margin1.bottom)
   .style("border", "1px solid black")
   .style("background-color", "yellow")
   .attr("transform", "translate(20, 20)")
   .append("g").attr("transform",
      "translate(" + margin1.left + "," + margin1.top + ")");

// Data preparation
const coinData = d3.csv("data/test1.csv")
coinData.then(function(data){
    data.forEach(function(d){
        d.frame = +d.frame;
        d.coins = +d.coins;
    });        

    console.log(data);
    console.log("Frame", data[0].frame, "Coins", data[0].coins);

    /* PREPARATION */
    // Scale preparation
    const xScale = d3.scaleLinear().rangeRound([0, width1]);
    const yScale = d3.scaleLinear().range([height1, 0]);
    xScale.domain(d3.extent(data, function(d) { return d.frame; }));
    yScale.domain([0, d3.max(data, function(d) { return d.coins; })]);

    // Axes preparation
    const yaxis = d3.axisLeft()
        .ticks(data.length)
        .scale(yScale);

    const xaxis = d3.axisBottom()
        //.ticks(data.length)
        .scale(xScale);

    // Lines preparation
    const line = d3.line()
    .x(function(d) { return xScale(d.frame); })
    .y(function(d) { return yScale(d.coins); })
    


    /* DRAWING */
    // Axes drawing
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xaxis);

    svg2.append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "10px")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Frequency");

    // Line drawing
    svg2.append("path")
        .style("fill", "none")
        .style("stroke", "#ed3700")
        .data([data])
        .attr("class", "line")
        .attr("d", line);
    







});

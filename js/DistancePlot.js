function DistancePlot() {

    var margin1 = {top: 20, right: 20, bottom: 30, left: 50},
       width1 = 375 - margin1.left - margin1.right,
       height1 = 250 - margin1.top - margin1.bottom;

    distancedata = [];


    // Append SVG attributes
    var svg2 = d3.select(".svg-container").append("svg")
       .attr("width", width1 + margin1.left + margin1.right)
       .attr("height", height1 + margin1.top + margin1.bottom)
       .style("border", "1px solid black")
       .style("background-color", "#c89858")
       .attr("transform", "translate(60, 20)")
       .append("g").attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");



        // Data preparation
            var frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var distance = [0, 10, 20, 25, 20, 15, 25, 30, 40, 35];
            //coindata.push(dataFromGame);
            for( let i = 0; i < frames.length; i++){
                distancedata.push({
                    frame: frames[i],
                    distance: distance[i]
                });
            }

        /* PREPARATION */
        // Scale preparation
        const xScale = d3.scaleLinear().rangeRound([0, width1]);
        const yScale = d3.scaleLinear().range([height1, 0]);
        xScale.domain(d3.extent(distancedata, function(d) { return +d.frame; }));
        yScale.domain([0, d3.max(distancedata, function(d) { return +d.distance; })]);

        // Axes preparation
        const yaxis = d3.axisLeft()
            //.ticks(+distance.length)
            .scale(yScale);

        const xaxis = d3.axisBottom()
            //.ticks(data.length)
            .scale(xScale);

        // Lines preparation
        const line = d3.line()
        .x(function(d) { return xScale(d.frame); })
        .y(function(d) { return yScale(d.distance); });


    this.draw = function() {
        /* DRAWING */
        // Axes drawing
        svg2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height1 + ")")
            .call(xaxis)
            .append("text")
            .attr("text-anchor", "end")
            .attr("x", width1)
            .attr("y", "-5px")
            .text("Time");

        svg2.append("g")
            .attr("class", "axis")
            .call(yaxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", "10px")
            .attr("y", 6)
            .style("text-anchor", "end")
            .text("Distance from start");

        // Line drawing
        svg2.append("path")
            .style("fill", "none")
            .style("stroke", "#007848")
            .style("stroke-width", "1.5")
            .data([distancedata])
            .attr("class", "line")
            .attr("d", line);

        // Circle drawing
        svg2.append("g")
            .selectAll("dot")
            .style("stroke", "gray")
            .data(distancedata)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.frame); } )
                .attr("cy", function(d) { return yScale(d.distance); } )
                .attr("r", "5px")
                .attr("fill", "#00c800");
    };
}

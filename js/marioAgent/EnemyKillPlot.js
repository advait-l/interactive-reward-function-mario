function EnemyKillPlot() {
    
    var margin1 = {top: 20, right: 20, bottom: 30, left: 50},
       width1 = 375 - margin1.left - margin1.right,
       height1 = 250 - margin1.top - margin1.bottom;

    // Append SVG attributes
    var svg2 = d3.select(".svg-container").append("svg")
       .attr("width", width1 + margin1.left + margin1.right)
       .attr("height", height1 + margin1.top + margin1.bottom)
       .style("border", "1px solid black")
       .style("background-color", "#f4d4b4")
       .attr("transform", "translate(40, 20)")
       .append("g").attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");

    // Data preparation
    var frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var enemies = [0, 0, 0, 0, 0, 1, 1, 2, 2, 2];

    enemydata = []
    for( let i = 0; i < frames.length; i++){
        enemydata.push({
            frame: frames[i],
            enemies: enemies[i]
        });
    }

    /* PREPARATION */
    // Scale preparation
    const xScale = d3.scaleLinear().rangeRound([0, width1]);
    const yScale = d3.scaleLinear().range([height1, 0]);
    xScale.domain(d3.extent(enemydata, function(d) { return +d.frame; }));
    yScale.domain([0, d3.max(enemydata, function(d) { return +d.enemies; })]);

    // Axes preparation
    const yaxis = d3.axisLeft()
        .ticks(4)
        .scale(yScale);

    const xaxis = d3.axisBottom()
        //.ticks(data.length)
        .scale(xScale);

    // Lines preparation
    const line = d3.line()
    .x(function(d) { return xScale(d.frame); })
    .y(function(d) { return yScale(d.enemies); });

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
            .text("Enemies Killed");

        // Line drawing
        svg2.append("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("stroke-width", "1.5")
            .data([enemydata])
            .attr("class", "line")
            .attr("d", line);

        // Circle drawing
        svg2.append("g")
            .selectAll("dot")
            .style("stroke", "gray")
            .data(enemydata)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.frame); } )
                .attr("cy", function(d) { return yScale(d.enemies); } )
                .attr("r", "5px")
                .attr("fill", "#c84c0c");
    
    }
}

function CoinPlot() {

    var margin1 = {top: 20, right: 20, bottom: 30, left: 50},
       width1 = 375 - margin1.left - margin1.right,
       height1 = 250 - margin1.top - margin1.bottom;

    coindata = [];

    // Append SVG attributes
    var svg2 = d3.select(".svg-container").append("svg")
       .attr("width", width1 + margin1.left + margin1.right)
       .attr("height", height1 + margin1.top + margin1.bottom)
       .style("border", "1px solid black")
       .style("background-color", "#f0aa11")
       .attr("transform", "translate(20, 20)")
       .append("g").attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");


    this.setData = function(dataFromGame) {
        coindata.push(dataFromGame);
    }

        // Data preparation
            var frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var coins = [0, 1, 1, 2, 3, 3, 4, 5, 7, 7];
            //coindata.push(dataFromGame);
            for( let i = 0; i < frames.length; i++){
                coindata.push({
                    frame: frames[i],
                    coins: coins[i]
                });
            }

        /* PREPARATION */
        // Scale preparation
        const xScale = d3.scaleLinear().rangeRound([0, width1]);
        const yScale = d3.scaleLinear().range([height1, 0]);
        xScale.domain(d3.extent(coindata, function(d) { return +d.frame; }));
        yScale.domain([0, d3.max(coindata, function(d) { return +d.coins; })]);

        // Axes preparation
        const yaxis = d3.axisLeft()
            //.ticks(+coindata.length)
            .scale(yScale);

        const xaxis = d3.axisBottom()
            //.ticks(data.length)
            .scale(xScale);

        // Lines preparation
        const line = d3.line()
        .x(function(d) { return xScale(d.frame); })
        .y(function(d) { return yScale(d.coins); });


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
            .text("Coins");

        // Line drawing
        svg2.append("path")
            .style("fill", "none")
            .style("stroke", "#ed3700")
            .style("stroke-width", "1.5")
            .data([coindata])
            .attr("class", "line")
            .attr("d", line);

        // Circle drawing
        svg2.append("g")
            .selectAll("dot")
            .style("stroke", "gray")
            .data(coindata)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.frame); } )
                .attr("cy", function(d) { return yScale(d.coins); } )
                .attr("r", "5px")
                .attr("fill", "#fefe00");
    };
}

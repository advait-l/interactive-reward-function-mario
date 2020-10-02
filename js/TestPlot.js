function TestPlot1() {

    // SVG variables
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
       width = 800 - margin.left - margin.right,
       height = 200 - margin.top - margin.bottom;

    // Define a line
    var valueline = d3.line()
       .x(function(d) { return x(d.year); })
       .y(function(d) { return y(d.population); });

    // Append SVG attributes
    var svg1 = d3.select("body").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .style("border", "1px solid black")
       .style("background-color", "yellow")
       .attr("transform", "translate(20, 20)")
       .append("g").attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    const timeConv = d3.timeParse("%d-%b-%Y");
    const dataset = d3.csv("data.csv");

    /**************** Everything happens inside this function *******************/
    dataset.then(function(data) {
        const slices = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d){
                    return {
                        date: timeConv(d.date),
                        measurement: +d[id]
                    };
                })
            };
        });
        //console.log("Column headers", data.columns);
        //console.log("Column headers without date", data.columns.slice(1));
        //// returns the sliced dataset
        ////console.log("Slices",slices);
        //// returns the first slice
        //console.log("First slice",slices[0]);
        //// returns the array in the first slice
        //console.log("A array",slices[0].values);
        //// returns the date of the first row in the first slice
        //console.log("Date element",slices[0].values[0].date);
        //// returns the array's length
        //console.log("Array length",(slices[0].values).length);

        // Scales preparation
        const xScale = d3.scaleTime().range([0,width]);
        const yScale = d3.scaleLinear().rangeRound([height, 0]);
        xScale.domain(d3.extent(data, function(d){
            return timeConv(d.date)}));
        yScale.domain([(0), d3.max(slices, function(c) {
            return d3.max(c.values, function(d) {
                return d.measurement + 4; });
                })
            ]);

        // Axis preparation
        const yaxis = d3.axisLeft()
            .ticks((slices[0].values).length)
            .scale(yScale);

        const xaxis = d3.axisBottom()
            .ticks(d3.timeDay.every(1))
            .tickFormat(d3.timeFormat('%b %d'))
            .scale(xScale);

        //const yaxis = d3.axisLeft().scale(yScale); 
        //const xaxis = d3.axisBottom().scale(xScale);

        // Axis drawing
        svg1.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis);

        svg1.append("g")
            .attr("class", "axis")
            .call(yaxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", ".75em")
            .attr("y", 6)
            .style("text-anchor", "end")
            .text("Frequency");

        // Lines preparation
        const line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.measurement); });

        // Lines drawing
        const lines = svg1.selectAll("lines")
        .data(slices)
        .enter()
        .append("g");

        lines.append("path")
        .attr("d", function(d) { return line(d.values); });




    });
}

function TestPlot2() {

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

        //console.log(data);
        //console.log("Frame", data[0].frame, "Coins", data[0].coins);

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
}


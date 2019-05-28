setTimeout(monthlyUsers, 100);
setTimeout(allUsers, 250);
setTimeout(personalityStats, 500);

//var socket = io('http://2.24.190.83:80');
var socket = io('http://localhost:800');

socket.on('data', function (data)
{
    $('#data').text("Last request sent - " + data["text"]);
    console.log(data["text"]);
});

socket.on('opennessData', function (data)
{
    $('#OP1').text("1º - " + data["a"]);
    $('#OP2').text("2º - " + data["b"]);
    $('#OP3').text("3º - " + data["c"]);
    $('#OP4').text("4º - " + data["d"]);
    $('#OP5').text("5º - " + data["e"]);
});

socket.on('conscientiousnessData', function (data)
{
    $('#CO1').text("1º - " + data["a"]);
    $('#CO2').text("2º - " + data["b"]);
    $('#CO3').text("3º - " + data["c"]);
    $('#CO4').text("4º - " + data["d"]);
    $('#CO5').text("5º - " + data["e"]);
});

socket.on('emotionalRangeData', function (data)
{
    $('#ER1').text("1º - " + data["a"]);
    $('#ER2').text("2º - " + data["b"]);
    $('#ER3').text("3º - " + data["c"]);
    $('#ER4').text("4º - " + data["d"]);
    $('#ER5').text("5º - " + data["e"]);
});

socket.on('extraversionData', function (data)
{
    $('#EX1').text("1º - " + data["a"]);
    $('#EX2').text("2º - " + data["b"]);
    $('#EX3').text("3º - " + data["c"]);
    $('#EX4').text("4º - " + data["d"]);
    $('#EX5').text("5º - " + data["e"]);
});

socket.on('agreeablenessData', function (data)
{
    $('#AG1').text("1º - " + data["a"]);
    $('#AG2').text("2º - " + data["b"]);
    $('#AG3').text("3º - " + data["c"]);
    $('#AG4').text("4º - " + data["d"]);
    $('#AG5').text("5º - " + data["e"]);
});

function monthlyUsers()
{
    var svg = d3.select("#monthlyUsers"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Users joining each month")
    var x = d3.scaleBand().range([0, width]).padding(0.4), y = d3.scaleLinear().range([height, 0]);
    var g = svg.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");
    d3.csv("./Stats/monthlyUsers.csv", function(error, data) 
    {
        if (error) 
        {
            throw error;
        }
        x.domain(data.map(function(d) { return d.month; }));
        y.domain([0, d3.max(data, function(d) { return d.users; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x))
         .append("text")
         .attr("font-size", "20px")
         .attr("y", height - 250)
         .attr("x", width / 2)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Month");
        g.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("font-size", "20px")
         .attr("transform", "rotate(-90)")
         .attr("y", 50)
         .attr("x", -100)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Users");
        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .on("mouseover", onMouseOver) //Add listener for the mouseover event
         .on("mouseout", onMouseOut)   //Add listener for the mouseout event
         .attr("x", function(d) { return x(d.month); })
         .attr("y", function(d) { return y(d.users); })
         .attr("width", x.bandwidth())
         .transition()
         .ease(d3.easeLinear)
         .duration(400)
         .delay(function (d, i) 
         {
             return i * 50;
         })
         .attr("height", function(d) 
         { 
             return height - y(d.users); 
         });
    });
    //mouseover event handler function
    function onMouseOver(d, i) 
    {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth() + 5)
          .attr("y", function(d) { return y(d.users) - 10; })
          .attr("height", function(d) { return height - y(d.users) + 10; });
        g.append("text")
         .attr('class', 'val') 
         .attr('x', function() {
             return x(d.month);
         })
         .attr('y', function() {
             return y(d.users) - 15;
         })
         .text(function() {
             return [d.users];  // Value of the text
         });
    }
    //mouseout event handler function
    function onMouseOut(d, i) 
    {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(d.users); })
          .attr("height", function(d) { return height - y(d.users); });
        d3.selectAll('.val')
          .remove()
    }
}

function allUsers()
{
        var svg = d3.select("#allUsers"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Total users in the game")
    var x = d3.scaleBand().range([0, width]).padding(0.4),
        y = d3.scaleLinear().range([height, 0]);
    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
    d3.csv("./Stats/allUsers.csv", function(error, data) {
        if (error) {
            throw error;
        }
        x.domain(data.map(function(d) { return d.month; }));
        y.domain([0, d3.max(data, function(d) { return d.users; })]);
        if(isNaN(x))
        {
            console.log("Its not a number!!");
        }
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x))
         .append("text")
         .attr("font-size", "20px")
         .attr("y", height - 250)
         .attr("x", width / 2)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Month");
        g.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("font-size", "20px")
         .attr("transform", "rotate(-90)")
         .attr("y", 50)
         .attr("x", -100)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Users");
        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .on("mouseover", onMouseOver) //Add listener for the mouseover event
         .on("mouseout", onMouseOut)   //Add listener for the mouseout event
         .attr("x", function(d) { return x(d.month); })
         .attr("y", function(d) { return y(d.users); })
         .attr("width", x.bandwidth())
         .transition()
         .ease(d3.easeLinear)
         .duration(400)
         .delay(function (d, i) {
             return i * 50;
         })
         .attr("height", function(d) { return height - y(d.users); });
    });
    //mouseover event handler function
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth() + 5)
          .attr("y", function(d) { return y(d.users) - 10; })
          .attr("height", function(d) { return height - y(d.users) + 10; });
        g.append("text")
         .attr('class', 'val') 
         .attr('x', function() {
             return x(d.month);
         })
         .attr('y', function() {
             return y(d.users) - 15;
         })
         .text(function() {
             return [d.users];  // Value of the text
         });
    }
    //mouseout event handler function
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(d.users); })
          .attr("height", function(d) { return height - y(d.users); });
        d3.selectAll('.val')
          .remove()
    }
}
function personalityStats()
{
    var svg = d3.select("#personalityStats"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height - 50) / 2;
    
    var g = svg.append("g")
               .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var color = d3.scaleOrdinal(['#6100FF','#8700FF','#7500FF','#9B00FE','#B100FF']);
    var pie = d3.pie().value(function(d) { 
            return d.percent; 
        });
    var path = d3.arc()
                 .outerRadius(radius - 10)
                 .innerRadius(0);
    var label = d3.arc()
                  .outerRadius(radius)
                  .innerRadius(radius - 80);
    d3.csv("./Stats/personalityStats.csv", function(error, data) 
    {
        if (error) {
            throw error;
        }
        var arc = g.selectAll(".arc")
                   .data(pie(data))
                   .enter().append("g")
                   .attr("class", "arc");
        arc.append("path")
           .attr("d", path)
           .attr("fill", function(d) { return color(d.data.trait); });
    
        console.log(arc)
    
        arc.append("text")
           .attr("transform", function(d) { 
                    return "translate(" + label.centroid(d) + ")"; 
            })
           .text(function(d) { return d.data.trait; });
    });

    svg.append("g")
       .attr("transform", "translate(" + (width / 2 - 90) + "," + 15 + ")")
       .append("text")
       .text("Personality Traits Statistics")
       .attr("class", "title")
    svg.append("g")
       .attr("transform", "translate(" + (width / 2 - 140) + "," + 380 + ")")
       .append("text")
       .text("1.Openness 2.Conscientiousness 3.Extraversion")
       .attr("class", "title")
    svg.append("g")
       .attr("transform", "translate(" + (width / 2 - 100) + "," + 400 + ")")
       .append("text")
       .text("4.Agreeableness 5.Emotional Range")
       .attr("class", "title")
    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(100);
}
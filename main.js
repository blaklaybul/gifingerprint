
function init(date){

d3.selectAll(".state").remove();
d3.selectAll(".state").remove();
new Map(date);

}

var Map = function(date){

var filedates =  ['2016-03-03', '2016-03-04', '2016-03-05', '2016-03-06', '2016-03-07', '2016-03-08', '2016-03-09', '2016-03-10',
 '2016-03-11', '2016-03-12', '2016-03-13', '2016-03-14', '2016-03-15', '2016-03-16', '2016-03-17', '2016-03-18',
 '2016-03-19', '2016-03-20', '2016-03-21', '2016-03-22', '2016-03-23', '2016-03-24', '2016-03-25', '2016-03-26',
 '2016-03-27', '2016-03-28', '2016-03-29', '2016-03-30', '2016-03-31', '2016-04-01', '2016-04-02', '2016-04-03',
 '2016-04-04', '2016-04-05', '2016-04-06', '2016-04-07', '2016-04-08', '2016-04-09', '2016-04-10', '2016-04-11',
 '2016-04-12', '2016-04-13', '2016-04-14', '2016-04-15', '2016-04-16', '2016-04-17'];

 var totalDays = filedates.length;


    var states = [];

    d3.select("#grid").text().split("\n").forEach(function(line, i) {
      var re = /\w+/g, m;
      while (m = re.exec(line)) states.push({
        name: m[0],
        x: m.index / 3,
        y: i
      });
    });

    var svg = d3.select("svg").attr("id","chart"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    var gridWidth = d3.max(states, function(d) { return d.x; }) + 1,
        gridHeight = d3.max(states, function(d) { return d.y; }) + 1,
        cellSize = 100;

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#29293d")


    var file = "map/" +date + ".json";

    d3.json(file, function(json){

        var data = json;
        var defaultGif = data[data.findIndex(x=>x.stateName=="XX")].trendMapped;


        var bg = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
          .selectAll(".state")
            .data(states)
          .enter().append("g")
            .attr("id", function(d) { return d.name })
            .attr("class", "state")
            .attr("transform", function(d) {
                    return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")";
            });

        var state = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
          .selectAll(".state")
            .data(json)
          .enter().append("g")
            .attr("id", function(d) { return d.name })
            .attr("class", "state")
            .attr("transform", function(d) {
                    var forx = states[states.findIndex(x => x.name==d.stateName)].x;
                    var fory = states[states.findIndex(x => x.name==d.stateName)].y;
                    return "translate(" + (forx - gridWidth / 2) * cellSize + "," + (fory - gridHeight / 2) * cellSize + ")";
            });

        bg.append("rect")
                .attr("x", -cellSize / 2)
                .attr("y", -cellSize / 2)
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", "black")
                .style("opacity", 0)
                .on("mouseover", function(d){
                    d3.select(this)
                    .style("opacity", 0.8);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                    .style("opacity", 0);
                });





        bg.append("image")
                  .data(states)
                  .attr("xlink:href", function(d, i) { return "gifs/" + defaultGif + ".gif"; })
                  .attr("x", -cellSize/2)
                  .attr("y", -cellSize/2)
                  .attr("width", cellSize)
                  .attr("height", cellSize)
                  .style("opactiy", 1.0)

      state.append("rect")
                        .attr("x", -cellSize / 2)
                        .attr("y", -cellSize / 2)
                        .attr("width", cellSize)
                        .attr("height", cellSize)
                        .style("fill", "#29293d")
                        .style("opacity", 1);


        state.append("image")
            .data(json)
              .attr("xlink:href", function(d, i) {
                  return "gifs/" + d.trendMapped + ".gif";
              })
              .attr("x", -cellSize/2)
              .attr("y", -cellSize/2)
              .attr("width", cellSize)
              .attr("id", function(d){return d.stateName + "-" + d.trendMapped})
              .attr("height", cellSize)
              .style("opactiy", 1.0);



        bg.append("text")
            .data(states)
             .attr("dy", "0.35em")
             .style("fill", "whites")
             .style("opacity", 0)
             .text(function(d) { return d.name; })
             .on("mouseover",function(){
                 d3.select(this).style("opacity",1);
             })
             .on("mouseout",function(){
                 d3.select(this).style("opacity",0);
             });

         state.append("text")
             .data(json)
              .attr("dy", ".35em")
              .style("fill", "white")
              .style("opacity", 0)
              .text(function(d) { return d.stateName; })
              .on("mouseover",function(){
                  d3.select(this).style("opacity",1);
              })
              .on("mouseout",function(){
                  d3.select(this).style("opacity",0);
              });;
         });
 }


init("2016-03-13");

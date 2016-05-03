
function init(date){

d3.selectAll("#chart").remove();
new Map(date);

}

var Map = function(date){


    var width = 1800;
    var height = 950;

    var states = [];

    d3.select("#grid").text().split("\n").forEach(function(line, i) {
      var re = /\w+/g, m;
      while (m = re.exec(line)) states.push({
        name: m[0],
        x: m.index / 3,
        y: i
      });
    });

    var svg = d3.select("#main")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id","chart");

    var gridWidth = d3.max(states, function(d) { return d.x; }) + 1,
        gridHeight = d3.max(states, function(d) { return d.y; }) + 1,
        cellSize = 120;

    var file = "map/" + date + ".json";

    d3.json(file, function(json){

        var data = json;

        var defaultGif = data[data.findIndex(function(x) {
            return x.stateName == "XX";
        })].trendMapped;

        var defaultTrend = data[data.findIndex(function(x) {
            return x.stateName == "XX";
        })].trendName;

        states.forEach(function(d){
            var result = data.filter(function (entry) { return entry.stateName === d.name; });

            if (result.length>0) {
                d.trendName = result[0]['trendName'];
                d.trendMapped = result[0]['trendMapped'];
                d.stateName = result[0]['stateName'];
            }

            else {
                d.stateName = d.name;
                d.trendMapped = defaultGif;
                d.trendName = defaultTrend;
            }
        })

        states = states.filter(function(entry){return entry.stateName != "XX";})

        var state = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
          .selectAll(".state")
            .data(states)
          .enter().append("g")
            .attr("id", function(d) { return d.name })
            .attr("class", "state")
            .attr("transform", function(d) {
                    var forx = states[states.findIndex(function(x){ return x.name==d.stateName;})].x;
                    var fory = states[states.findIndex(function(x){ return x.name==d.stateName;})].y;
                    return "translate(" + (forx - gridWidth / 2) * cellSize + "," + (fory - gridHeight / 2) * cellSize + ")";
            });


        state.append("image")
            .data(states)
              .attr("xlink:href", function(d, i) {
                  return "gif/" + d.trendMapped + ".gif";
              })
              .attr("x", -cellSize/2)
              .attr("y", -cellSize/2)
              .attr("width", cellSize)
              .attr("id", function(d){return d.stateName + "-" + d.trendMapped})
              .attr("height", cellSize)
              .style("opactiy", 1.0);

         state.append("text")
             .data(states)
              .attr("dy", ".35em")
              .style("fill", "white")
              .style("opacity", 0)
              .text(function(d) { return d.stateName; })
              .on("mouseover",function(d){
                  d3.select(this).style("opacity",1);
                  d3.select("h1").html("<b>" + d.trendName + "</b>");
              })
              .on("mouseout",function(){
                  d3.select(this).style("opacity",0);
                  d3.select("h1").html("<b>US Gifingerprint</b>");
              });;
         });
 }


init("2016-03-13");

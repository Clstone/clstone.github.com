var w = 680,
    h = 700;

var force = d3.layout.force()
    .linkDistance(60)
    .charge(-200)
    .gravity(0.08)
    .size([w, h]);

var svg = d3.select("#evfriends").append("svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 24)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("svg:path")
    .style("fill", "#2d2d2d")
    .attr("d", "M0,-5L10,0L0,5");
       
var linkLayer = svg.append("g");
var nodeLayer = svg.append("g");

var slider = d3.select("#evfriends")
  .append("div")
  .append("input")
    .style("width", "100%")
    .attr("type", "range")
    .attr("value", 4)
    .attr("min", 2)
    .attr("max", 6)
    .attr("step", 0.01)

var collide = function (node) {
  var r = 12,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = 24;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2
        || x2 < nx1
        || y1 > ny2
        || y2 < ny1;
  };
}   
                			    
d3.json("/assets/d3/evfriends.json", function (json) {
    
  var link;
  var node;
  var threshold = 4;
  var update = function () {
    force
        .nodes(json.nodes)
        .links(json.links.filter(function (link) {return link.value > threshold}));
    
    force.start();
    link = linkLayer.selectAll("line.link")
        .data(force.links());
      
    link.enter().append("line")
        .attr("class", "link")
        .style("stroke", "#2d2d2d")
        .attr("marker-end", "url(#arrowhead)");
 
    link.exit().remove();
  
    node = nodeLayer.selectAll("g.node")
        .data(force.nodes());
      
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .call(force.drag)
  
    node.exit().remove();
     
    nodeEnter.append("circle")
        .attr("r", 12)
        .style("fill", "#bada55")
        .style("stroke", "#2d2d2d")
      
    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-family", "junctionregularRegular, sans-serif")
        .style("font-size", 12)
        .style("color", "#2d2d2d")
        .text(function (d) {return d.name});
  };
  
  update();
  slider.on("change", function (d) {
    threshold = this.value;
    update();
  });
  force.on("tick", function() {
    var nodes = force.nodes();
    
    var q = d3.geom.quadtree(nodes),
          i = 0,
          n = nodes.length;

    while (++i < n) {
      q.visit(collide(nodes[i]));
    }
  
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  });
});
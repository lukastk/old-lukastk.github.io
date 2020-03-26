var get_default_settings = function() {
  st = {};

  st.dataset = "https://raw.githubusercontent.com/lukastk/autonomy-projects/master/corona/website/high-touch-plot-wp/data/rif_data.csv?token=ACX6XFP5H33CPMB4NVY3DBC6QUZRQ"

  st.scatter_dot_radius_scale = 0.001;
  st.zoom_scale_min = 0.7;
  st.zoom_scale_max = 5;

  st.not_highlighted_color= "#3a91d6FF";
  st.highlighted_color= "#00FFFFFF";

  st.main_employment_cat = "Employment (tot)";
  st.main_wage_cat = "Median weekly pay";
  st.main_reg = "Reg (t)";

  st.radius_is_employment = true;
  st.employment_radius_factor = 1;
  st.default_radius = 6;

  st.xCat_default = "Proximity";
  st.yCat_default = "Exposure";
  st.colorCat = "Display";

  st.above70mode = false;

  st.show_fit = false;
  st.wage_region_plot = false;

  st.axes_view_lookup = {
    "Proximity" : [-10, 110],
    "Exposure" : [-10, 110],
    "Employment (tot)" : [-50000, 1200000],
    "Employment (f)" : [-50000, 708900+100000],
    "Employment (m)" : [-50000, 369100+100000],
    'Median weekly pay' : [150, 1700],
    'Mean weekly pay' : [150, 1700],
    'Median weekly pay (m)' : [150, 1700],
    'Mean weekly pay (m)' : [150, 1700],
    'Median weekly pay (f)' : [150, 1700],
    'Mean weekly pay (f)' : [150, 1700],
    'RIF' : [10, 105]
  }

  st.margin_top = 50;
  st.margin_right = 300;
  st.margin_bottom = 50;
  st.margin_left = 85;
  st.outerWidth = 1100;
  st.outerHeight = 500;
  st.width = st.outerWidth - st.margin_left - st.margin_right;
  st.height = st.outerHeight - st.margin_top - st.margin_bottom;

  return st;
}

var initialize_plot = function(parent_div, st) {

  var scatter_dot_radius_scale = st.scatter_dot_radius_scale;
  var zoom_scale_min = st.zoom_scale_min;
  var zoom_scale_max = st.zoom_scale_max;

  var not_highlighted_color= st.not_highlighted_color;
  var highlighted_color= st.highlighted_color;

  var main_employment_cat = st.main_employment_cat;
  var main_wage_cat = st.main_wage_cat;
  var main_reg = st.main_reg;

  var radius_is_employment = st.radius_is_employment;
  var employment_radius_factor = st.employment_radius_factor;
  var default_radius = st.default_radius;

  var xCat_default = st.xCat_default;
  var yCat_default = st.yCat_default;
  var xCat = st.xCat_default;
  var yCat = st.yCat_default;
  var rCat = main_employment_cat;
  var colorCat = st.colorCat;

  var above70mode = st.above70mode;

  var minRIF = st.minRIF;
  var maxRIF = st.maxRIF;

  var show_fit = st.show_fit;
  var wage_region_plot = st.wage_region_plot;

  var dataset = st.dataset;

  var margin = { top: st.margin_top, right: st.margin_right, bottom: st.margin_bottom, left: st.margin_left };
  var outerWidth = st.outerWidth;
  var outerHeight = st.outerHeight;
  var width = st.width;
  var height = st.height;

  var label_lookup = {
    "Proximity" : "Physical proximity to others",
    "Exposure" : "Exposure to diseases",
    "Employment (tot)" : "Employment (total)",
    "Employment (m)" : "Employment (male)",
    "Employment (f)" : "Employment (female)",
    'Median weekly pay' : 'Median weekly pay',
    'Mean weekly pay' : 'Mean weekly pay',
    'Median weekly pay (m)' : 'Median weekly pay (male)',
    'Mean weekly pay (m)' : 'Mean weekly pay (male)',
    'Median weekly pay (f)' : 'Median weekly pay (female)',
    'Mean weekly pay (f)' : 'Mean weekly pay (female)',
    'RIF' : 'Risk Indication Factor',
    'ONS SOC' : 'ONS SOC Code'
  };

  var axes_limits_lookup = {
    "Proximity" : [0, 100],
    "Exposure" : [0, 100],
    "Employment (tot)" : [0, 10000000],
    "Employment (f)" : [0, 10000000],
    "Employment (m)" : [0, 10000000],
    'Median weekly pay' : [0, 10000000],
    'Mean weekly pay' : [0, 10000000],
    'Median weekly pay (m)' : [0, 10000000],
    'Mean weekly pay (m)' : [0, 10000000],
    'Median weekly pay (f)' : [0, 10000000],
    'Mean weekly pay (f)' : [0, 10000000],
    'RIF' : [0, 100]
  }

  var axes_view_lookup = st.axes_view_lookup;

  var xScale = d3.scale.linear()
      .range([0, width]).nice();

  var yScale = d3.scale.linear()
      .range([height, 0]).nice();

 /*var yScale = d3.scale.log()
    .base(10)
    .range([height, 0]);*/

  d3.csv(dataset, function(data) {
    data.forEach(function(d) {
      d.Proximity = +d.Proximity;
      d.Exposure = +d.Exposure;
      d["Employment (tot)"] = +d["Employment (tot)"];
      d["Employment (m)"] = +d["Employment (m)"];
      d["Employment (f)"] = +d["Employment (f)"];
      d['Median weekly pay'] = +d['Median weekly pay'];
      d['Mean weekly pay'] = +d['Mean weekly pay']
      d['Median weekly pay (m)'] = +d['Median weekly pay (m)']
      d['Mean weekly pay (m)'] = +d['Mean weekly pay (m)']
      d['Median weekly pay (f)'] = +d['Median weekly pay (f)']
      d['Mean weekly pay (f)'] = +d['Mean weekly pay (f)']
      d['RIF'] = +d['RIF']
    });

    var xMax = d3.max(data, function(d) { return d[xCat]; }),
        xMin = d3.min(data, function(d) { return d[xCat]; }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) { return d[yCat]; }),
        yMin = d3.min(data, function(d) { return d[yCat]; }),
        yMin = yMin > 0 ? 0 : yMin;

    var tick_formatter = d3.format("0");

    xScale.domain([axes_view_lookup[xCat][0], axes_view_lookup[xCat][1]]);
    yScale.domain([axes_view_lookup[yCat][0], axes_view_lookup[yCat][1]]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(-height)
        .tickFormat(function (d) {
           if (d < axes_limits_lookup[xCat][0]) return '';
           if (d > axes_limits_lookup[xCat][1]) return '';
           return tick_formatter(d);
         });

     var yAxis = d3.svg.axis()
         .scale(yScale)
         .orient("left")
         .tickSize(-width)
         .tickFormat(function (d) {
           if (d < axes_limits_lookup[yCat][0]) return '';
           if (d > axes_limits_lookup[yCat][1]) return '';
            return tick_formatter(d);
          });

    var data_point_formatter = function(dp) {
      if (dp == -1) { return "Not available"; }
      else { return dp; }
    }

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          txt = "";
          txt += "<h4>" + d["ONS Title"] + "</h4>"
          txt += "<table>"
          txt += "<tr><td><b>" + label_lookup["Proximity"] + ":</b></td><td>" + data_point_formatter(d["Proximity"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Exposure"] + ":</b></td><td>" + data_point_formatter(d["Exposure"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["RIF"] + ":</b></td><td>" + data_point_formatter(Math.round(d["RIF"])) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Employment (tot)"] + ":</b></td><td>" + data_point_formatter(d["Employment (tot)"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Employment (m)"] + ":</b></td><td>" + data_point_formatter(d["Employment (m)"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Employment (f)"] + ":</b></td><td>" + data_point_formatter(d["Employment (f)"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Median weekly pay"] + ":</b></td><td>£" + data_point_formatter(d["Median weekly pay"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Median weekly pay (m)"] + ":</b></td><td>£" + data_point_formatter(d["Median weekly pay (m)"]) + "<br></td></tr>";
          txt += "<tr><td><b>" + label_lookup["Median weekly pay (f)"] + ":</b></td><td>£" + data_point_formatter(d["Median weekly pay (f)"]) + "<br></td></tr>";
          //txt += "<tr><td><b>" + label_lookup["ONS SOC"] + ":</b></td><td>" + data_point_formatter(d["ONS SOC"]) + "<br></td></tr>";
          //txt += "<tr><td><b>" + "IsAbove70RIF" + ":</b></td><td>£" + data_point_formatter(d["IsAbove70RIF"]) + "<br></td></tr>";
          txt += "</table>"
          return txt;
        });

    var zoomBeh = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([zoom_scale_min, zoom_scale_max])
        .on("zoom", zoom);

    function dot_radius(d) {
      if (xCat.startsWith("Median")) {
        if (d["Median weekly pay"] == -1 || d["Median weekly pay (m)"] == -1 || d["Median weekly pay (f)"] == -1) {
          return 0;
        }
      }

      if (radius_is_employment) {
        if (d[xCat] == -1 || d[yCat] == -1 || d[rCat] == -1) {
          return 0;
        } else {
          return Math.sqrt(employment_radius_factor*scatter_dot_radius_scale*d[rCat]);
        }
      } else {
        return default_radius;
      }
    }
    function transform(d) {
      return "translate(" + xScale(d[xCat]) + "," + yScale(d[yCat]) + ")";
    }
    function transform_text(d) {
      if (d[xCat] == -1 || d[yCat] == -1 || d[rCat] == -1) {
        return "";
      } else {
        return "translate(" + xScale(d[xCat]) + "," + ( yScale(d[yCat]) - 5 - Math.sqrt(scatter_dot_radius_scale*d[rCat]) ) + ")";
      }
    }

    //var color = d3.scale.category10();
    var color = function(d) {
      if (d == 0 || above70mode) {
        return not_highlighted_color;
      } else {
        return highlighted_color;
      }
    }

    var svg = d3.select(parent_div + " .scatter")
      .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", margin.bottom-5)
        .text(label_lookup[xCat]);

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
      .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -height/2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(label_lookup[yCat]);

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

  // Scatter dots

    objects.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .classed("dot", true)
        .classed("display", function(d) { return d[colorCat] == 1 && !above70mode; })
        .classed("below70rif", function(d) {
          if (above70mode) {
            return d['IsAbove70RIF'] == 0;
          } else { return false; }
        })
        .classed("above70rif", function(d) {
          if (above70mode) {
            return d['IsAbove70RIF'] == 1;
          } else { return false; }
        })
        .classed("is-female-dominated", function(d) {
          if (above70mode) {
            return d['IsFemaleDominated'] == 1;
          } else { return false; }
        })
        .attr("r", dot_radius)
        .attr("transform", transform)
        .style("fill", function(d) { return color(d[colorCat]); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)

  // Put display dots last

  var display_dots = $(parent_div + " .display");
  display_dots.detach()
  $(parent_div + " .objects").append(display_dots);

  objects.selectAll(".dotlabel")
    .data(data)
    .enter().append("text")
    .attr("transform", transform_text)
    .attr("class", function (d) {
      if (d[colorCat] == 1 & !above70mode) {
        return "dotlabel dot-text-display"
      } else {
        return "dotlabel dot-text-no-display"
      }
    })
    .text(function(d) {
      var title = d["ONS Title"];
      var title = title[0] + title.slice(1).toLowerCase();
      return title;
    });


    function change() {
      var xMax = d3.max(data, function(d) { return d[xCat]; });
      var xMin = d3.min(data, function(d) { return d[xCat]; });

      zoomBeh.x(xScale.domain([axes_view_lookup[xCat][0], axes_view_lookup[xCat][1]])).y(yScale.domain([axes_view_lookup[yCat][0], axes_view_lookup[yCat][1]]));

      var svg = d3.select(parent_div + " .scatter").transition();

      svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(label_lookup[xCat]);
      svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(label_lookup[yCat]);

      objects.selectAll(".dot").transition().duration(1000).attr("transform", transform)
            .attr("r", dot_radius);
      objects.selectAll(".dotlabel").transition().duration(1000).attr("transform", transform_text);

      xAxis.tickFormat(function (d) {
             if (d < axes_limits_lookup[xCat][0]) return '';
             if (d > axes_limits_lookup[xCat][1]) return '';
             return tick_formatter(d);
           });
      yAxis.tickFormat(function (d) {
           if (d < axes_limits_lookup[yCat][0]) return '';
           if (d > axes_limits_lookup[yCat][1]) return '';
            return tick_formatter(d);
          });
    }

    d3.select(parent_div + " .btn-set-tot").on("click", function () {
      main_employment_cat = "Employment (tot)";
      main_wage_cat = "Median weekly pay"
      rCat = main_employment_cat;
      if (yCat.startsWith("Employment")) { yCat = main_employment_cat; }
      if (xCat.startsWith("Median")) { xCat = main_wage_cat; }
      change();

      main_reg = "Reg (t)";
      if (show_fit) { setup_reg_plot(); }

      if (wage_region_plot) { update_wage_lines_smooth(); }
    });
    d3.select(parent_div + " .btn-set-male").on("click", function () {
      main_employment_cat = "Employment (m)";
      main_wage_cat = "Median weekly pay (m)"
      rCat = main_employment_cat;
      if (yCat.startsWith("Employment")) { yCat = main_employment_cat; }
      if (xCat.startsWith("Median")) { xCat = main_wage_cat; }
      change();

      main_reg = "Reg (m)";
      if (show_fit) { setup_reg_plot(); }

      if (wage_region_plot) { update_wage_lines_smooth(); }
    });
    d3.select(parent_div + " .btn-set-female").on("click", function () {
      main_employment_cat = "Employment (f)";
      main_wage_cat = "Median weekly pay (f)"
      rCat = main_employment_cat;
      if (yCat.startsWith("Employment")) { yCat = main_employment_cat; }
      if (xCat.startsWith("Median")) { xCat = main_wage_cat; }
      change();

      main_reg = "Reg (f)";
      if (show_fit) { setup_reg_plot(); }

      if (wage_region_plot) { update_wage_lines_smooth(); }
    });

    d3.select(parent_div + " .btn-exposure-to-proximity").on("click", function () {
      xCat = "Proximity";
      yCat = "Exposure";
      change();
    });

    d3.select(parent_div + " .btn-employment-to-exposure").on("click", function () {
      xCat = "Exposure";
      yCat = main_employment_cat;
      change();
    });

    d3.select(parent_div + " .btn-employment-to-proximity").on("click", function () {
      xCat = "Proximity";
      yCat = main_employment_cat;
      change();
    });

    d3.select(parent_div + " .btn-rfi-to-wage").on("click", function () {
      xCat = main_wage_cat;
      yCat = "RIF";
      change();
    });

    d3.select(parent_div + " .change-reset").on("click", function () {
      main_employment_cat = "Employment (tot)";
      rCat = main_employment_cat;
      xCat = xCat_default;
      yCat = yCat_default;
      change();
      $(parent_div + " .reg-fit-component").show(300);

      main_reg = "Reg (t)";
      if (show_fit) { setup_reg_plot(); }

      if (wage_region_plot) { update_wage_lines_smooth(); }
    });

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
          .attr("transform", transform);

      svg.selectAll(".dotlabel")
          .attr("transform", transform_text);

      if (show_fit) {
        svg.selectAll(".reg-line").attr("d", reg_plot(reg_plot_pts.reg_pts));
        svg.selectAll(".reg-err").attr("points", reg_plot_pts.reg_er_shape.map(function(d) { return [zoomBeh.x()(d.x),zoomBeh.y()(d.y)].join(","); }).join(" "))
      }

      if (wage_region_plot) {
        update_wage_lines();
      }
    }

    $(parent_div + " .search").keyup(function() {
      var search_term = $(this).val().toLowerCase();

      if (search_term === "") {
        objects.selectAll(".dot")//.transition().duration(1000)
          .classed("search-highlighted", false)
          .classed("search-not-highlighted", false);
        objects.selectAll(".dotlabel")
          .classed("label-search-highlighted", false)
          .classed("label-search-not-highlighted", false);
      } else {
        objects.selectAll(".dot")//.transition().duration(1000)
          .classed("search-highlighted", function(d) {
            return d["ONS Title"].toLowerCase().includes(search_term);
          })
          .classed("search-not-highlighted", function(d) {
            return !d["ONS Title"].toLowerCase().includes(search_term);
          });

        objects.selectAll(".dotlabel")
          .classed("label-search-highlighted", function(d) {
            return d["ONS Title"].toLowerCase().includes(search_term);
          })
          .classed("label-search-not-highlighted", function(d) {
            return !d["ONS Title"].toLowerCase().includes(search_term);
          });
      }
    });

    if (show_fit) {

          // Regression plot

          var reg_data = {
           'Reg (t)' : {slope: -0.02582268128821666, intercept: 58.00821273461131, slope_e1: -0.037037739082695684, slope_e2: -0.014624302512533808},
           'Reg (m)' : {slope: -0.02582268128821666, intercept: 58.00821273461131, slope_e1: -0.037037739082695684, slope_e2: -0.014624302512533808},
           'Reg (f)' : {slope: -0.027616471234512822, intercept: 58.27969671626578, slope_e1: -0.040244296361920985, slope_e2: -0.015077577261843276}
          }

          var reg_plot = d3.svg.line()
            .x(function(d, i) { return zoomBeh.x()(d[0]); })
            .y(function(d) { return zoomBeh.y()(d[1]); });

          var reg_plot_pts = {};

          var setup_reg_plot = function() {
            reg = reg_data[main_reg]

            function linspace(startValue, stopValue, cardinality) {
              var arr = [];
              var step = (stopValue - startValue) / (cardinality - 1);
              for (var i = 0; i < cardinality; i++) {
                arr.push(startValue + (step * i));
              }
              return arr;
            }

            var reg_intercept = reg.intercept;
            var reg_slope = reg.slope;
            var reg_x1 = 300;
            var reg_x2 = 1100;
            var reg_n = 4;

            var reg_xs = linspace(reg_x1, reg_x2, reg_n);
            var reg_ys = reg_xs.map( x => x*reg_slope + reg_intercept );
            reg_plot_pts.reg_pts = reg_xs.map(function(x, i) { return [x, reg_ys[i]]; });

            objects.selectAll(".reg-line").transition().duration(1000)
              .attr("d", reg_plot(reg_plot_pts.reg_pts));

            // Regression error

            var reg_e1_slope = reg.slope_e1;
            var reg_e2_slope = reg.slope_e2;

            reg_plot_pts.reg_er_shape = [
              {x: reg_x1, y: reg_x1*reg_e1_slope + reg_intercept},
              {x: reg_x1, y: reg_x1*reg_e2_slope + reg_intercept},
              {x: reg_x2, y: reg_x2*reg_e2_slope + reg_intercept},
              {x: reg_x2, y: reg_x2*reg_e1_slope + reg_intercept}
            ]

            objects.selectAll(".reg-err").transition().duration(1000)
              .attr("points", reg_plot_pts.reg_er_shape.map(function(d) { return [zoomBeh.x()(d.x),zoomBeh.y()(d.y)].join(","); }).join(" "))
          }

          objects.append("path")
            .attr("class", "reg-line reg-fit-component");

          objects.append("polygon")
            .attr("class", "reg-err reg-fit-component");

          setup_reg_plot();

          // Create legend

          // create a list of keys
          var legend_labels = ["Fit line", "Fit error"]

          // Usually you have a color scale in your chart already
          var legend_colors = [ "#FF0000", "#FF0000" ];
          var legend_colors_opacity = [0.7, 0.25];

          var legend_x = width - 100;
          var legend_x_spacing = 20;
          var legend_y = 30;
          var legend_y_spacing = 25;

          // Add one dot in the legend for each name.
          legend = svg.append("g")
            .attr("class", "legend reg-fit-component")

          legend.selectAll(".legend-dots")
            .data(legend_colors)
            .enter()
            .append("circle")
              .attr("cx", legend_x)
              .attr("cy", function(d,i){ return legend_y + i*legend_y_spacing}) // 100 is where the first dot appears. 25 is the distance between dots
              .attr("r", 7)
              .style("fill", function(d){ return d; })
              .style("fill-opacity", function(d, i) { return legend_colors_opacity[i]; })

          legend.selectAll(".legend-labels")
            .data(legend_labels)
            .enter()
            .append("text")
              .attr("x", legend_x + legend_x_spacing)
              .attr("y", function(d,i){ return legend_y + i*legend_y_spacing}) // 100 is where the first dot appears. 25 is the distance between dots
              .text(function(d){ return d; })
              .attr("text-anchor", "left")
              .style("alignment-baseline", "middle")
    }



    if (wage_region_plot) {
      var median_wage = 585;
      var poverty_wage = (2.0/3)*median_wage;

      var median_wage_line = [
        [-10000, median_wage],
        [10000, median_wage]
      ]

      var poverty_wage_line = [
        [-10000, poverty_wage],
        [10000, poverty_wage]
      ]

      var label_x = width - 200;
      var label_y = +22;

      var wage_region_line = d3.svg.line()
        .x(function(d, i) { return zoomBeh.x()(d[0]); })
        .y(function(d) { return zoomBeh.y()(d[1]); });

      objects.append("path")
        .attr("class", "median-wage-line")
        .attr("d", wage_region_line(median_wage_line));

      objects.append("path")
        .attr("class", "poverty-wage-line")
        .attr("d", wage_region_line(poverty_wage_line));

      var update_wage_lines = function() {
        objects.selectAll(".median-wage-line")
          .attr("d", wage_region_line(median_wage_line));

        objects.selectAll(".poverty-wage-line")
          .attr("d", wage_region_line(poverty_wage_line));
      }

      var update_wage_lines_smooth = function() {
        objects.transition().duration(1000)
          .selectAll(".median-wage-line")
          .attr("d", wage_region_line(median_wage_line));

        objects.transition().duration(1000)
          .selectAll(".poverty-wage-line")
          .attr("d", wage_region_line(poverty_wage_line));
      }

      objects.append("text")
        .attr("class", "median-wage-line-label")
        .attr("transform", "translate(" + label_x + "," + (zoomBeh.y()(median_wage) + label_y) + ")")
        .text("Weekly median wage");

      objects.append("text")
        .attr("class", "poverty-wage-line-label")
        .attr("transform", "translate(" + label_x + "," + (zoomBeh.y()(poverty_wage) + label_y) + ")")
        .text("Poverty line");
    }
  });
}

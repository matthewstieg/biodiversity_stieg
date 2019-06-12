
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`    
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);

  var metaurl = `/metadata/${sample}`;
  d3.json(metaurl).then(function (sample) {
    console.log(sample);
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");
    Object.entries(sample).forEach(([key, value]) => {
      console.log(key, value);
      sample_metadata.append('p').text(`${key}, ${value}`);
    });
  });
};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  var url = `samples/${sample}`
  d3.json(url).then(function (d) {
    var bx = d.otu_ids;
    var by = d.sample_values;
    var btext = d.otu_labels;
    var bmode = "markers";
    var marker_clr = d.otu_ids;
    var marker_sz = d.sample_values;

    var trace_bubble = {
      x: bx,
      y: by,
      text: btext,
      mode: bmode,
      marker: {
        color: marker_clr,
        size: marker_sz
      }
    };
    var bubbleData = [trace_bubble];

    var layout = {
      xaxis: { title: "OTU_ID" }
    };
    Plotly.newPlot('bubble', bubbleData, layout);

    d3.json(url).then(function (d) {
      var pvalues = d.sample_values.slice(0, 10);
      var plabels = d.otu_ids.slice(0, 10);
      var phovertext = d.otu_labels.slice(0, 10);

      var pie_trace = {
        values: pvalues,
        labels: plabels,
        hovertext: phovertext,
        type: 'pie'
      };
      var pieData = [pie_trace]
      Plotly.newPlot("pie", pieData)
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();

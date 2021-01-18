

d3.json("samples.json").then((dataRead)=> {
    let data=dataRead
    let names=data.names.map(d=>d)
    let selection=d3.select("#selDataset").selectAll("option")
    .data(names)
    selection.enter()
    .append("option")
    .merge(selection)
    .attr("value",d=>d)
    .text(d=>d)
d3.selectAll("#selDataset").on("change",ReadData)
function ReadData(){
    let name = d3.select("#selDataset").property("value")
    let filterData = data.samples.filter(function(d){
        return d.id == name
    })
    let metadata= data.metadata.filter(function(d){
        return d.id == name
    })
    let ethni=metadata[0].ethnicity
    let gender=metadata[0].gender
    let age = metadata[0].age
    let location= metadata[0].location
    let bbtype= metadata[0].bbtype
    let wfreq=metadata[0].wfreq
    CreateTable(name,ethni,gender,location,bbtype,age,wfreq)
    BarPlot(filterData) 
}
function CreateTable(name,ethni,gender,age,location,bbtype,wfreq){
    //create data table
    let table = d3.select("#summary-table")
    let tbody = table.select("tbody")
    tbody.html("")
    let trow=tbody.append("tr")
    trow.append("tr").text(`id: ${name}`)
    trow.append("tr").text(`Ethnicity: ${ethni} `)
    trow.append("tr").text(`Gender: ${gender}`)
    trow.append("tr").text(`Age: ${age}`)
    trow.append("tr").text(`Location: ${location}`)
    trow.append("tr").text(`bbtype: ${bbtype}`)
    trow.append("tr").text(`wfreq: ${wfreq}`)
}
function BarPlot(filterData){
    filterData.sort(function(a,b){
        return parseFloat(b.sample_values) - parseFloat(a.sample_values)
    })
    let values_data = filterData.map(d=>d.sample_values)
    values= values_data[0].slice(0, 10)
    values= values.reverse()
    let id_data = filterData.map(d=>d.otu_ids)
    ids= id_data[0].slice(0,10)
    id=ids.map(d=>`OTU-${d}`)
    id=id.reverse()
    let text_data=filterData.map(d=>d.otu_labels)
    text = text_data[0].slice(0, 10)
    let trace1= {
        x: values,
        y:id,
        text: text,
        name:"Sample Values",
        type:"bar",
        orientation:"h"
    }
    let barchart = [trace1]

    let layout={
        title:"Sample Values",
        xaxis:{title:"Sample Value"},
        yaxis:{title:"OTU ID"}
    }
    Plotly.newPlot("bar", barchart,layout)
    BubllePlot(values_data,id_data,text_data)
}
function BubllePlot(values_data,id_data,text_data){
    let values =values_data[0]
    let ids =id_data[0]
    let text =text_data[0]
    var trace1 = {
        x: ids,
        y: values,
        text: text,
        mode: 'markers',
        marker: {
          color: ids,
          size: values
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Bublle Chart',
        showlegend: false,
        
      };
      
      Plotly.newPlot('bubble', data, layout);

}
})
       




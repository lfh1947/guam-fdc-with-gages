console.log("started java script");
const map = L.map('map', {
    center: [13.4443, 144.7937],
    zoom: 11,
})
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

console.log("just before single marker above dededot");



const myIcon = L.icon({
    iconUrl: 'https://lfh1947.github.io/guam-fdc-with-gages/static/js/red google icon.png',
    //iconUrl: '/placeholder.png',
    // iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png',
    iconSize: [24, 24],
    iconAnchor: [12, 23],
    popupAnchor: [-3, -76]
      //shadowUrl: 'my-icon-shadow.png',
      //shadowSize: [68, 95],
      //shadowAnchor: [22, 94]
});

L.marker([13.56403, 144.8511], {icon: myIcon}).addTo(map);
//L.marker([13.56403, 144.8511], ).addTo(map);

console.log("just after single marker above dededo");

const yigo = L.marker([13.5640, 144.9061],{icon: myIcon}).bindPopup('Yigo')
const dededo = L.marker([13.5453, 144.8511]).bindPopup('Dededo')
const mangilao = L.marker([13.4702, 144.8456]).bindPopup('Mangilao')
const tamuning = L.marker([13.5005, 144.7956]).bindPopup('Tamuning')
const barrigada = L.marker([13.4708, 144.8181]).bindPopup('Barrigada')
const agana = L.marker([13.4763, 144.7502]).bindPopup('Agana')
const asan = L.marker([13.4608, 144.7247]).bindPopup('Asan')
const piti = L.marker([13.4456, 144.6918]).bindPopup('Piti')
const yona = L.marker([13.4010, 144.7522]).bindPopup('Yona')
const santaRita = L.marker([13.3743, 144.7083]).bindPopup('Santa Rita')
const agat = L.marker([13.3673, 144.6643]).bindPopup('Agat')
const talofofo = L.marker([13.3383, 144.7302]).bindPopup('Talofofo')
const inarajan = L.marker([13.2792, 144.7302]).bindPopup('Inajaran')
const umatac = L.marker([13.3139, 144.6698]).bindPopup('Umatac')
const merizo = L.marker([13.2682, 144.6918]).bindPopup('Merizo')
console.log("just before constant villages");
//const villages = L.layerGroup([yigo, dededo, mangilao, tamuning, barrigada, agana, asan, piti, yona, santaRita, agat, talofofo, inarajan, umatac, merizo],{icon: greenIcon}).addTo(map);
//const greenIcon = new L.icon({
  //  iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
  //  iconSize:[38,95],
   // iconAnchor:[22,94],
   // popupAnchor:[12,-90]
    //shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
  // })
//const villages = L.layerGroup([yigo, dededo, mangilao, tamuning, barrigada, agana, asan, piti, yona, santaRita, agat, talofofo, inarajan, umatac, merizo],{icon: greenIcon}).addTo(map);  
const villages = L.layerGroup([yigo, dededo, mangilao, tamuning, barrigada, agana, asan, piti, yona, santaRita, agat, talofofo, inarajan, umatac, merizo]).addTo(map);
const layerControl = L.control.layers({"Open Street Map": osm}, {"Villages": villages}).addTo(map);

console.log("just before plot data");
let plotData
const plotFDC = () => {
    const eps = [0, 10, 30, 50, 80, 95]
    const fdcTrace = {
        x: eps,
        y: eps.map(ep => plotData[`Q${ep}`]),
        type: 'scatter',
        name: 'Flow Duration Curve',
    };
    const layout = {
        title: {
            text: `Flow Duration Curve for ${plotData.streamName} - Reach ID ${plotData.ARCID}`,
            font: {
                size: 20
            }
        },
        xaxis: {
            title: "Exceedance Probability (%)",
            range: [0, 100],
            nticks: 50,
        },
        yaxis: {
            title: "Discharge (cfs)",
            type: "log"
        }
    }
    Plotly.newPlot('plot-div', [fdcTrace,], layout)
}

const plotFDCgage = () => {
    const eps = [0, 10, 30, 50, 80, 95]
    const fdcTrace = {
        x: eps,
        y: eps.map(ep => plotData[`Q${ep}`]),
        type: 'scatter',
        name: 'Flow Duration Curve',
    };
    const layout = {
        title: {
            text: `FLOW DURATION CURVE FOR ${plotData.NAME}`,
            font: {
                size: 20
            }
        },
        xaxis: {
            title: "Exceedance Probability (%)",
            range: [0, 100],
            nticks: 50,
        },
        yaxis: {
            title: "Discharge (cfs)",
            type: "log"
        }
    }
    Plotly.newPlot('plot-div', [fdcTrace,], layout)
}

const download = () => {
    const eps = [0, 10, 30, 50, 80, 95]
    const a = document.createElement('a')
    a.href = "data:text/csv;charset=utf-8,Exceedance Probability, Discharge (cfs),\n" + eps.map(ep => [ep, plotData[`Q${ep}`]].join(",")).join(",\n")
    a.download = "flow_duration_curve.csv" 
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}   








console.log("just before rivers fetch");
fetch('./static/geojson/rivers.json')
  .then(response => response.json())
  .then(geojson => {
      const getFDCValues = (feature, layer) => {
          layer.bindPopup(
            [0, 10, 30, 50, 80, 95, 'AVG'].map(ep => `Q${ep}: ${feature.properties[`Q${ep}`]}<br>`).join('') +
            '<button type="button" class="btn btn-primary" data-bs-toggle="modal" onclick="plotFDC()" data-bs-target="#exampleModal">Plot FDC</button>' +
            '<button type="button" class="btn btn-success" onclick="download()">Download CSV</button>'
          );
          layer.on('click', a => plotData = a.target.feature.properties)
      }
      const riverGeoJSON = L.geoJSON(geojson, {onEachFeature: getFDCValues}).addTo(map);
     layerControl.addOverlay(riverGeoJSON, "Selected Rivers")
      console.log("just after rivers to map");
  })
      console.log("just before gage json fetch");
fetch('./static/geojson/gages.json')
  .then(response => response.json())
  .then(geojson => {
      const getFDCValues = (feature, layer) => {
          layer.bindPopup(
            [0, 10, 30, 50, 80, 95, 'AVG'].map(ep => `Q${ep}: ${feature.properties[`Q${ep}`]}<br>`).join('') +
            '<button type="button" class="btn btn-primary" data-bs-toggle="modal" onclick="plotFDCgage()" data-bs-target="#exampleModal">Plot FDC</button>' +
            '<button type="button" class="btn btn-success" onclick="download()">Download CSV</button>'
          );
          layer.on('click', a => plotData = a.target.feature.properties)
      }
      
      console.log("just before new gage icon  setup");
         // Icon options
         const iconOptions2 = {
            iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconSize:[38,50],
            iconAnchor:[22,40],
             popupAnchor:[12,-90]
         }
         
         // Creating a custom icon
         const customIcon2 = L.icon(iconOptions2);

         console.log("just after icon setup");

      // Creating Marker Options
      //const  markerOptions = {
        //title: "MyLocation",
        //clickable: true,        
        //icon: customIcon2
     //}

      
      //const gageGeoJSON = L.geoJSON(geojson,{onEachFeature: getFDCValues}, {icon: greenIcon}).addTo(map);
      
      const gageGeoJSON = L.geoJSON(geojson,{onEachFeature: getFDCValues},{customIcon2}).addTo(map);        
      console.log("just before  gages layer control");  
      //layerControl.addOverlay(riverGeoJSON, "Selected Rivers in Guam")
      layerControl.addOverlay(gageGeoJSON, "Selected stream gages")
      console.log("just after gages to map");
  }) 

VIZ2 = {
  mapOptions: {
    zoom: 11,
    center: new google.maps.LatLng(-33.5, -70.7),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  },
  escuelas : [], comunas : [], lines : [],
  map : null,
  config: {
    "numericData": "datos.csv",
    "geoData": "comunas.csv",
    "mapCenter": [-33.5, -70.7],
    "mapZoom": 11,
    "scoreField": "simce",
    "latField": "lat",
    "lonField": "lon",
    "titleField": "escuela",
    "scoreField": "simce",
    "mapId": 'map1',
    "runButton": "#run",
    "resultDiv": "#resultado"
  },


  init: function(options){
    var self = this;
    for(var i in options){
      self.config[i] = options[i];
    }

    var max = 0, min = 1000;
    if (typeof(Number.prototype.toRad) === "undefined") {
     Number.prototype.toRad = function() {
       return this * Math.PI / 180;
     }
   }  
   self.map = new google.maps.Map(document.getElementById('map1'), self.mapOptions);
   d3.csv(self.config["numericData"], function(error, csv) {
    escuelas = csv;
    d3.csv(self.config["geoData"], function(error2, csv2){
      comunas = csv2;
      csv2.forEach(function(x) {
        d3.select("#comuna").append("option").attr("value", x.lat+","+x.lon).html(x.comuna);
      });
      $(self.config.runButton).on("click", function(){self.run()});
    });
  });
 },


 run: function(){
  var self = this;
  var latlon = $("#comuna option:selected").val().split(",");
  var p ={
    simce: d3.select("#puntaje").property("value"),
    lat: latlon[0],
    lon: latlon[1],
    name: $("#comuna option:selected").html()
  };
  selection  = self.getClosestSchool(p);
  if(selection !=null){
    var e = selection[0];
    d3.select(self.config.resultDiv).html(e.escuela+"<br/>Distancia: "+parseInt(e.distance)+" KM.<br/>Simce: "+e.simce+"puntos<br/> Costo: "+e.costo+"<br/> Tipo: "+e.tipo+"<hr/>");
  }else{
    d3.select(self.config.resultDiv).html("No se encontraron escuelas con ese criterio");
  }
},

getClosestSchool:function(point){
  var self = this;
  var selection = [];
  for(var i=0; i< self.lines.length; i++){
    self.lines[i].setMap(null);
  }
    //First, filter schools by simce
    for(i in escuelas){
      if(parseInt(escuelas[i].simce) >= parseInt(point.simce)){
        var x = escuelas[i];
        x.distance = self.distance(escuelas[i], point);
        selection.push(x);
      }
    }
    //Then, find the closes one
    selection.sort(function(a,b) { return a.distance - b.distance } );


    if(selection.length>0){
      closest = selection[0];
      var schoolCoordinates = [
      new google.maps.LatLng(point.lat, point.lon),
      new google.maps.LatLng(closest.lat, closest.lon)
      ];

      i=self.lines.length;
      self.lines[i] = new google.maps.Polyline({
        path: schoolCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      self.lines[i++].setMap(self.map);
      self.lines[i++] =  new google.maps.Marker({
        position: new google.maps.LatLng(point.lat, point.lon),
        map: self.map
      });
      self.lines[i++] =  new google.maps.Marker({
        position: new google.maps.LatLng(closest.lat, closest.lon),
        map: self.map
      });
      return selection;
    }else{
      return null;
    }
  },

  distance: function(point1, point2){
    var lat1 = parseFloat(point1.lat), lat2 = parseFloat(point2.lat), lon1 = parseFloat(point1.lon), lon2 = parseFloat(point2.lon);
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  lat1 = lat1.toRad();
  lat2 = lat2.toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
}

VIZ2.init();
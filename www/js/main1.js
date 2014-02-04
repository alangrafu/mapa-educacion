function init(options){
 config = {
  "url": "datos.csv",
  "mapCenter": [-33.5, -70.7],
  "mapZoom": 11,
  "latField": "lat",
  "lonField": "lon",
  "titleField": "escuela",
  "scoreField": "simce",
  "mapDiv": 'map1'
};
for(var i in options){
  config[i] = options[i];
}

var mapOptions = {
  zoom: config.mapZoom,
  center: new google.maps.LatLng(config.mapCenter[0], config.mapCenter[1]),
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var marker = [];
var map = new google.maps.Map(document.getElementById(self.config.mapDiv),
  mapOptions);

google.maps.event.addDomListener(window, "resize", function() {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center); 
});

var max = 0, min = 200;
var infowindow = new google.maps.InfoWindow({
  content: ""
});

d3.csv(config.url, function(error, csv) {
  csv.forEach(function(x) {
   if(max < parseInt(x[config.scoreField])){
    max = parseInt(x[config.scoreField]);
  }
  if(min > parseInt(x[config.scoreField])){
    min = parseInt(x[config.scoreField]);
  }
  var myLatLng = new google.maps.LatLng(parseFloat(x[config.latField]), parseFloat(x[config.lonField]));
  marker.push( new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: x[config.titleField],
    simce: parseInt(x[config.scoreField])
  })
  );

  google.maps.event.addListener(marker[marker.length-1], 'click', function() {
    infowindow.content = this.title
    infowindow.open(map,this);
  });
  min=200;

});
  d3.select("#viz1").append("input").attr("type", "range").attr("max", max).attr("min", min).attr("step", "1").attr("value", min).attr("id", "thresholdScore").on("change", function(){changeThresholdScore();});
  changeThresholdScore();


  function changeThresholdScore(){
   var v =d3.select("#thresholdScore").property("value");
   d3.select("#simceText").html(v);
   for (i in marker){
    if(marker[i][config.scoreField] < v){
     marker[i].setMap(null);
   }else{
     marker[i].setMap(map);       
   }
 }
}


});
}

init();

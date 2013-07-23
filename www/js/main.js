var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(-33.5, -70.7),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var marker = [];
  var map = new google.maps.Map(document.getElementById('map1'),
                                mapOptions);

google.maps.event.addDomListener(window, "resize", function() {
var center = map.getCenter();
google.maps.event.trigger(map, "resize");
map.setCenter(center); 
});
  function init1(){
  	var max = 0, min = 200;
    var infowindow = new google.maps.InfoWindow({
      content: ""
    });

  	d3.csv("datos.csv", function(error, csv) {
      csv.forEach(function(x) {
      	if(max < parseInt(x.simce)){
      		max = parseInt(x.simce);
      	}
      	if(min > parseInt(x.simce)){
      		min = parseInt(x.simce);
      	}
        var myLatLng = new google.maps.LatLng(parseFloat(x.lat), parseFloat(x.lon));
        marker.push( new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: x.escuela,
          simce: parseInt(x.simce)
        })
        );

google.maps.event.addListener(marker[marker.length-1], 'click', function() {
  infowindow.content = this.title
  infowindow.open(map,this);
});
min=200;

      });
      d3.select("#viz1").append("input").attr("type", "range").attr("max", max).attr("min", min).attr("step", "1").attr("value", min).attr("id", "simceScore").attr("onchange", "changeSimceScore();");
      changeSimceScore();

    });
  }

  function changeSimceScore(){
  	var v =d3.select("#simceScore").property("value");
  	d3.select("#simceText").html(v);
  	for (i in marker){
  		if(marker[i].simce < v){
  			marker[i].setMap(null);
  		}else{
  			marker[i].setMap(map);  			
  		}
  	}
  }
  
  init1();

var LocationData = [
    [40.60275, 22.98965, "ΣΥΣΤΗΜΑ ΠΥΛΑΙΑ","2310303761, 2310324027","Προφ. Ηλία 35"],
    [40.60957, 23.10146, "ΣΥΣΤΗΜΑ ΧΟΡΤΙΑΤΗ","2310349840","Μετ. Σωτήρος 3"],
    [40.59134, 23.03417, "ΣΥΣΤΗΜΑ ΠΑΝΟΡΑΜΑ","2310343802, 23103471802","Κομνηνών 11"]
];
  
function initialize()
{
    var mapOptions = {
                    // How zoomed in you want the map to start at (always required)
                    zoom: 12,

                    // The latitude and longitude to center the map (always required)
                    center: new google.maps.LatLng(40.614213,23.071533), // Touba
                    // ONLY ROAD
                    mapTypeId: google.maps.MapTypeId.ROADMAP,

                    // How you would like to style the map.
                    // This is where you would paste any style found on Snazzy Maps.
                    // http://www.mapstylr.com/
                    styles : [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#111111"},{"lightness":17}]}]
                };
    var mapElement = document.getElementById('map-canvas-multiple');
    var map = new google.maps.Map(mapElement, mapOptions);
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow({ maxWidth: 200 });

    for (var i in LocationData)
    {
        var p = LocationData[i];
        var latlng = new google.maps.LatLng(p[0], p[1]);
        bounds.extend(latlng);


        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: p[2],
            phone: p[3],
            address: p[4]
        });


        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent( "<div class='title'>" + this.title + "</div>" + "<div class='phone' >" + this.phone + "</div>" + "<div class='address'>" + this.address + "</div>" );
            infowindow.open(map, this);
        });
    }

//     var listener = google.maps.event.addListener(map, "idle", function() {
//       if (map.getZoom() > 16) map.setZoom(12);
//       google.maps.event.removeListener(listener);
//     });
}
 google.maps.event.addDomListener(window, 'load', initialize);

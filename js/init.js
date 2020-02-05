// JavaScript Document
var pushNotification;
var mapa;
var numImatges = 0;
var MACadress;
var push;
var platform;
var okPush = true; // si l'usuari vol rebre notificacions
var tokenPush;
var mapawow;

function onLoad() {
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
}

function initApp() {



    //controlam tipus dispositiu
    try {
        window.platform = device.platform;
        var vers = device.version;
        vers = vers.toString();
        vers = vers.substring(0, 3);

        if (vers == '9.0' && device.platform == 'iOS') {
            $.mobile.hashListeningEnabled = true;
            $.mobile.pushStateEnabled = false;
        } else if (vers == '9.1' && device.platform == 'iOS') {
            $.mobile.hashListeningEnabled = false;
        }
    } catch (e) {
        error_('E INIT-42', 'ERROR TIPUS DISPOSITIU', e);
    }



    //push service
    var vullPush = readCookie('pushNotifications');
    if (vullPush == 2) {
        window.okPush = false;
        if ($('#activaNotificacions').is(':checked'))
            $('.swraper.light').click();
    } else {
        window.okPush = true;
        if (!$('#activaNotificacions').is(':checked'))
            $('.swraper.light').click();
    }

    try {
        initPushNotification();
    } catch (e) {
        error_('E INIT-60', 'INIT PUSH NOTIFICATION', e);
    }


    //MAC ADDRESS
    try {
        window.MACadress = device.uuid;
        iniciaSessioInici();

    } catch (e) {
        error_('E INIT-75', 'MAC ADDRESS', e);
    }
    
            

    //MAPA
//    try {
//
//        mapaInc.initMap();
//
//    } catch (e) {
//        errorMapa();
//        console.log('E INIT-84', 'ERROR INIT MAPA', e);
//    }
    //MAPA WOW
//    try {
//        mapawow.getMap();
//        
//
//    } catch (e) {
//       // errorMapa();
//        console.log('E INIT-84', 'ERROR INIT MAPA', e);
//    }


    init.initApp();

}



//####################//####################//####################
//####################      PUSh         #########################
//####################//####################//####################


function initPushNotification() {
    window.push = PushNotification.init({
        android: {
            senderID: "379336820272"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    window.push.on('registration', function (data) {
        window.tokenPush = data.registrationId;
        guardaTokenPush(data.registrationId);
    });

    window.push.on('notification', function (data) {
        console.log(data);
        areYouSure(data.message, "Aceptar", function () { }, 'avis');

    });

    window.push.on('error', function (e) {
        error_('E INIT-139', 'ERROR PUSH NOTIFICATION', e);
    });



}

//###################################################################################
//###################################################################################



//####################//####################//####################
//####################      mapa         #########################
//####################//####################//####################

var mapaInc = {

    mapInc: null,
    pos: {"lat": 39.702031, "lng": 3.431725},
    marcador: '',

    initMap: function() {

      var map =new google.maps.Map(
      document.getElementById('mapa'), {zoom: 18, center: mapaInc.pos});
      mapaInc.marcador = new google.maps.Marker({
      position: mapaInc.pos,
      map: map
    });
    google.maps.event.addListener(map, 'click', function(event){
       mapaInc.marcador.setMap(null);
       mapaInc.marcador = new google.maps.Marker({
       position: event.latLng,
       map: map
    });
    var request = {
            position:event.latLng
        };
             plugin.google.maps.Geocoder.geocode(request,function (results) {

            if (results.length) {
                var result = results[0];
                $('#adresaIncidencia').val(result.thoroughfare);
                $('#poblacioIncidencia').val(result.locality);
                //ONCAPDEPERA
                $('#adresaIncidenciaOnCap').val(result.thoroughfare);
                $('#poblacioIncidenciaOnCap').val(result.locality);
                
            
            } else {
                console.log('E-202: NOT LENGHT MAPA');
                errorMapa();
            }
        });
    });
    $('#mapa').on('swipe',  function (event) {
            $.event.special.swipe.horizontalDistanceThreshold (300);
        });

},

 onMapInit: function() {     
 
},

getLocalitzacio: function() {
        var option = {enableHighAccuracy: true};
            plugin.google.maps.LocationService.getMyLocation(option, function (location) {
              
                mapawow.lat = location.latLng.lat;
                mapawow.long = location.latLng.lng;          
            });
    },

getLocation: function() {
    
    var option = {enableHighAccuracy: true};
            plugin.google.maps.LocationService.getMyLocation(option, function (location) {
                //CAMERA POSITION
                var lat = location.latLng.lat;
                var long = location.latLng.lng;
               // mapaInc.mapInc.changeCamera(lat, long);
                const NOVAPOSICIO = new plugin.google.maps.LatLng(lat, long);
              //  mapaInc.mapInc.getAdress(NOVAPOSICIO);
              mapaInc.pos = NOVAPOSICIO;
              const GOOGLE = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);
        
        var request = {
            position:GOOGLE
        };
             plugin.google.maps.Geocoder.geocode(request,function (results) {

            if (results.length) {
                var result = results[0];
                $('#adresaIncidencia').val(result.thoroughfare);
                $('#poblacioIncidencia').val(result.locality);
                //ONCAPDEPERA
                $('#adresaIncidenciaOnCap').val(result.thoroughfare);
                $('#poblacioIncidenciaOnCap').val(result.locality);
                
            
            } else {
                console.log('E-202: NOT LENGHT MAPA');
                errorMapa();
            }
        });
            });
},

    clickEvent: function () {
        console.log('event');
        var evtName = plugin.google.maps.event.MAP_CLICK;
        mapaInc.mapInc.on(evtName, function (latLng) {
            console.log('click');
//            mapaInc.mapInc.trigger("MARKER_REMOVE");
            $('#latitutIncidencia').val(latLng.lat);
            $('#longitutIncidencia').val(latLng.lng);
            console.log('lat: ' + latLng.lat)
//            const NOVAPOSICIO = new plugin.google.maps.LatLng(latLng.lat, latLng.lng);
//            mapaInc.novaLocalitzacio(NOVAPOSICIO);
        });
    },

    changeCamera: function (lat, long) {
        mapaInc.mapInc.animateCamera({
            target: {lat: lat, lng: long},
            zoom: 17,
            tilt: 60,
            bearing: 0,
            duration: 2000
        }, function () {
            //alert("Camera target has been changed");
        });
    },

    onSuccess: function (location) {
        //comprovam posició
        $('#latitutIncidencia').val(location.latLng.lat);
        $('#longitutIncidencia').val(location.latLng.lng);
        $('#latitutIncidenciaOnCap').val(location.latLng.lat);
        $('#longitutIncidenciaOnCap').val(location.latLng.lng);

        const GOOGLE = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);

        var request = {
            position: GOOGLE
        };
        console.log(request);

        plugin.google.maps.Geocoder.geocode(request, function (results) {

            if (results.length) {
                var result = results[0];
                var position = result.position;
                var address = [
                    result.thoroughfare || "",
                    result.locality || "",
                    result.postalCode || ""].join(", ");
                mapaInc.mapInc.trigger("MARKER_REMOVE");
                mapaInc.mapInc.addMarker({
                    'position': position,
                    'title': address
                }, function (marker) {
                    mapaInc.mapInc.addEventListenerOnce("MARKER_REMOVE", function () {
                        marker.remove();
                    });
                });
                mapaInc.mapInc.animateCamera({
                    target: {
                        lat: location.latLng.lat,
                        lng: location.latLng.lng
                    },
                    'duration': 2,
                    zoom: 18
                });

                $('#adresaIncidencia').val(result.thoroughfare);
                $('#poblacioIncidencia').val(result.locality);
                //ONCAPDEPERA
                $('#adresaIncidenciaOnCap').val(result.thoroughfare);
                $('#poblacioIncidenciaOnCap').val(result.locality);


            } else {
                console.log('E-202: NOT LENGHT MAPA');
                errorMapa();
            }
        });


    },

    onError: function (msg) {
        errorMapa();
        console.log('E INIT-235', 'ERROR POSICIÓ MAPA');
    },

//NOVA LOCALITZACIÓ AL MAPA
    novaLocalitzacio: function (posicio) {


        var request = {
            'position': posicio
        };

        plugin.google.maps.Geocoder.geocode(request, function (results) {
            if (results.length) {

                var result = results[0];
                var position = result.position;

                var address = [
                    result.thoroughfare || "",
                    result.locality || "",
                    result.postalCode || ""].join(", ");
                mapaInc.mapInc.addMarker({
                    'position': position,
                    'title': address
                }, function (marker) {
                    marker.showInfoWindow();
                    mapaInc.mapInc.addEventListenerOnce("MARKER_REMOVE", function () {
                        marker.remove();
                    });
                });
                mapaInc.mapInc.animateCamera({
                    target: {
                        lat: position.lat,
                        lng: position.lng
                    },
                    'duration': 1,
                    zoom: 18
                });
                $('#adresaIncidencia').val(result.thoroughfare);
                $('#poblacioIncidencia').val(result.locality);
                //ONCAPDEPERA
                $('#adresaIncidenciaOnCap').val(result.thoroughfare);
                $('#poblacioIncidenciaOnCap').val(result.locality);
                $('#latitutIncidenciaOnCap').val(position.lat);
                $('#longitutIncidenciaOnCap').val(position.lng);
            } else {
                if (posicio) {
                    mapaInc.mapInc.addMarker({
                        'position': posicio
                    }, function (marker) {
                        marker.showInfoWindow();
                        mapaInc.mapInc.addEventListenerOnce("MARKER_REMOVE", function () {
                            marker.remove();
                        });
                    });
                } else {
                    alert("No es pot aconseguir la vostra ubicació");
                }

            }
        });

    },

    getNovaPosicio: function () {
        mapaInc.onMapInit();

    }

};
//###################################################################################
//###################################################################################


//####################      MAC ADDRESS         #########################

function getMacAddress() {
    try {
        window.MacAddress.getMacAddress(
                function (macAddress) {
                    window.MACadress = macAddress;
                    iniciaSessioInici();
                }, function (fail) {
            error_('E INIT-313', 'ERROR GET MAC ADDRESS', fail);
        }
        );
    } catch (e) {
        error_('E INIT-317', 'ERROR GET MAC ADDRESS', e);
        window.MACadress = '00:00:00';
    }
}
function successUUID(uuid) {
    //console.log(uuid);
    window.MACadress = uuid;
    iniciaSessioInici();
}
function failUUID(e) {
    error_('E INIT-235', 'ERROR UUID', e);
    window.MACadress = '00:00:00';
}

var mapawow = {

    wow: null,
    lat: null,
    long: null,
    infoWindow : '',

    initWow: function (etnos) {
      mapawow.infoWindow = new google.maps.InfoWindow();
      var posicio = {"lat": 39.702031, "lng": 3.431725};
      var map =new google.maps.Map(
      document.getElementById('mapaWow'), {zoom: 12, center: posicio,disableDefaultUI: true});
      google.maps.event.addListener(map, "click", function(event) {
        mapawow.infoWindow.close();
        });      
      var lloc = JSON.parse(JSON.stringify(etnos));       
       // var infoWindow = new google.maps.InfoWindow();
        $.each(lloc, function (i, item) {
            var decodeHTML = function (html) {
                var txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value;
            };
            var decoded = decodeHTML(item.titol);           
            var desc = decodeHTML(item.desc); 
            var pos = new google.maps.LatLng({lat: parseFloat(item.lat), lng: parseFloat(item.longt)});
            var marker = new google.maps.Marker({position: pos, map: map, title: '<a href="#">' + decoded + '</a>'});

            google.maps.event.addListener(marker, "click", function (e) {
                mapawow.infoWindow.close();
                mapawow.infoWindow.setContent('<a href="#fitxa-etno" onclick="mapawow.infoWindow.close();init.wow.getFitxaEtno('+item.id+')">' + decoded + '</a>');
                mapawow.infoWindow.open(map, marker);
            });
       
            
        $('#mapaWow').on('swipe',  function (event) {
            $.event.special.swipe.horizontalDistanceThreshold (400);
        });

        });             
    }
    ,checkCat: function () {
            var all = $('#botoSelect').attr('data-check');            
            if (all == 1) {
                $('.grup-categories .ui-checkbox').each(function () {
                    $(this).find('input').prop("checked", true);
                    $(this).find('label').removeClass('ui-checkbox-off');
                    $(this).find('label').addClass('ui-checkbox-on');
                    $('.btn-categoria').addClass('active');
                    $('#botoSelect').attr('data-check', '0');
                    $('#botoSelect').text('Netejar');
                    $('#botoSelect').attr('data-literal', 'cer_7');                                     
                    
                });
            } else {
                $('.grup-categories .ui-checkbox').each(function () {
                    $(this).find('input').prop("checked", false);
                    $(this).find('label').removeClass('ui-checkbox-on');
                    $(this).find('label').addClass('ui-checkbox-off');
                    $('.btn-categoria').removeClass('active');
                    $('#botoSelect').attr('data-check', '1');
                    $('#botoSelect').text('Seleccionar tot');
                    $('#botoSelect').attr('data-literal', 'cer_6');                                       
                });
            }
            
        }
    ,getLocalitzacio: function() {
        var option = {enableHighAccuracy: true};
            plugin.google.maps.LocationService.getMyLocation(option, function (location) {
              
                mapawow.lat = location.latLng.lat;
                mapawow.long = location.latLng.lng;          
            });
    }    
    
};

var mapapos = {
    lat: null,
    long: null,
    marcador: '',
    pos: {"lat": 39.702031, "lng": 3.431725},
    dinsPos: false,
    
     mapaPosidonia: function() {
      //var src = 'http://www.google.com/maps/d/kml?forcekml=1&mid=1D3USEeIbdVN3zV4B0S8jgODVIS0NHGvY';
     //var src = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
     var src = 'https://oncapdepera.com/App/posidonia/export.kmz';
     var src2 = 'https://oncapdepera.com/App/posidonia/artalite.kml';
      var posicio = {"lat": 39.7163321, "lng": 3.4592721};
      //var posicio = {"lat": -19.257753, "lng": 146.823688};
      var map =new google.maps.Map(
      document.getElementById('mapaPos'), {zoom: 12, center: posicio,disableDefaultUI: true});
//      var kmlLayer = new google.maps.KmlLayer(src, {
//          suppressInfoWindows: true,
//          preserveViewport: true,
//          zIndex: 100,
//          map: map
//        });
        var kmlLayer = new google.maps.KmlLayer(src2, {
          suppressInfoWindows: true,
          preserveViewport: true,
         // zIndex: 100,
          map: map
        });
        kmlLayer.addListener('click', function(event) {
        // var content = event.featureData.infoWindowHtml;
        // var testimonial = document.getElementById('capture');
        // testimonial.innerHTML = content;
          mapapos.marcador.setMap(null);
          mapapos.marcador = new google.maps.Marker({
          position: event.latLng,
          map: map
      });
      console.log('Posidoni si');
        });
//      var kmlTrack = "res/artalite.kml";
//      var geoXml = new geoXML3.parser({map: map});
//      geoXml.parse(kmlTrack);
      
      
    
        $('#mapaPos').on('swipe',  function (event) {
            $.event.special.swipe.horizontalDistanceThreshold (400);
        });
      //const NOVAPOSICIO = new plugin.google.maps.LatLng(mapapos.lat, mapapos.long);
      mapapos.marcador = new google.maps.Marker({
      position: mapapos.pos,
      map: map
    });
        
       google.maps.event.addListener(map, 'click', function(event){
       mapapos.marcador.setMap(null);
       mapapos.marcador = new google.maps.Marker({
       position: event.latLng,
       map: map
      });
      console.log('Posidonia no');
       });
      
     console.log('Viewport: '+kmlLayer.getDefaultViewport());
      
        },
        
        getLocalPos: function() {
        var option = {enableHighAccuracy: true};
            plugin.google.maps.LocationService.getMyLocation(option, function (location) {
                var lat = location.latLng.lat;
                var long = location.latLng.lng;
               // mapaInc.mapInc.changeCamera(lat, long);
                const NOVAPOSICIO = new plugin.google.maps.LatLng(lat, long);
              //  mapaInc.mapInc.getAdress(NOVAPOSICIO);
                mapapos.pos = NOVAPOSICIO;
              
                mapapos.lat = location.latLng.lat;
                mapapos.long = location.latLng.lng;          
            });
    }    
    
    
};
//###################################################################################

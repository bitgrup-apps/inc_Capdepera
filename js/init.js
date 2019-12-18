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
    

},

 onMapInit: function() {     
 
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

    initWow: function () {
      var map =new google.maps.Map(
      document.getElementById('mapaWow'), {zoom: 17, center: {"lat": 39.702031, "lng": 3.431725}});
     
        
    }    
};
//###################################################################################

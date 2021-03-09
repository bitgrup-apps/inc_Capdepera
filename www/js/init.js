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
      //  areYouSure(data.message, "Aceptar", function () { }, 'avis');
      var id = data.additionalData.id;
            init.avisos.getAvis(id);

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
    lat: null,
    lng: null,

    initMap: function () {

        var map = new google.maps.Map(
                document.getElementById('mapa'), {zoom: 18, center: mapaInc.pos});
        mapaInc.marcador = new google.maps.Marker({
            position: mapaInc.pos,
            map: map
        });
        google.maps.event.addListener(map, 'click', function (event) {
            mapaInc.marcador.setMap(null);
            console.log('pos click: ' + event.latLng);
            mapaInc.marcador = new google.maps.Marker({
                position: event.latLng,
                map: map
               
            });
            
            var request = {
                position: event.latLng
            };
            plugin.google.maps.Geocoder.geocode(request, function (results) {

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
        $('#mapa').on('swipe', function (event) {
            $.event.special.swipe.horizontalDistanceThreshold(300);
        });

    },

    onMapInit: function () {

    },

    getLocalitzacio: function () {
        var option = {enableHighAccuracy: true};
        plugin.google.maps.LocationService.getMyLocation(option, function (location) {

            mapawow.lat = location.latLng.lat;
            mapawow.long = location.latLng.lng;
        });
    },
    //LOCALITZACIO GEOLOCATION PLUGUIN
    getLocation: function() {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 3600000
         }
         var watchID = navigator.geolocation.getCurrentPosition(mapaInc.onSuccessGeo, mapaInc.onErrorGeo, options);
    },

    onSuccessGeo: function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log('lat: '+ lat + '/lng: '+lng);
    },
    onErrorGeo: function(error){
    console.log('Error: '+ error.code);
    },

    getLocation2: function () {
        console.log('getLocation');
        var option = {enableHighAccuracy: true};
        console.log('after option');
        plugin.google.maps.LocationService.getMyLocation(option, function (location) {
            console.log('After getMyLocation');
            //CAMERA POSITION
            var lat = location.latLng.lat;
            var long = location.latLng.lng;
            // mapaInc.mapInc.changeCamera(lat, long);
            const NOVAPOSICIO = new plugin.google.maps.LatLng(lat, long);
            //  mapaInc.mapInc.getAdress(NOVAPOSICIO);
            mapaInc.pos = NOVAPOSICIO;
            console.log('Pos:'+NOVAPOSICIO);
            const GOOGLE = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);

            var request = {
                position: GOOGLE
            };
            plugin.google.maps.Geocoder.geocode(request, function (results) {

                if (results.length) {
                    var result = results[0];
                    $('#adresaIncidencia').val(result.thoroughfare);
                    $('#poblacioIncidencia').val(result.locality);
                    //ONCAPDEPERA
                    $('#adresaIncidenciaOnCap').val(result.thoroughfare);
                    $('#poblacioIncidenciaOnCap').val(result.locality);
                    $('#latitutIncidenciaOnCap').val(location.latLng.lat);
                    $('#longitutIncidenciaOnCap').val(location.latLng.lng);


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
    infoWindow: '',

    initWow: function (etnos) {
        mapawow.infoWindow = new google.maps.InfoWindow();
        var posicio = {"lat": 39.702031, "lng": 3.431725};
        var map = new google.maps.Map(
                document.getElementById('mapaWow'), {zoom: 12, center: posicio, disableDefaultUI: true});
        google.maps.event.addListener(map, "click", function (event) {
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
                mapawow.infoWindow.setContent('<a href="#fitxa-etno" onclick="mapawow.infoWindow.close();init.wow.getFitxaEtno(' + item.id + ')">' + decoded + '</a>');
                mapawow.infoWindow.open(map, marker);
            });


            $('#mapaWow').on('swipe', function (event) {
                $.event.special.swipe.horizontalDistanceThreshold(400);
            });

        });
    }
    , checkCat: function () {
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
    , getLocalitzacio: function () {
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
    lang: '',

    mapaPosidonia: function () {
        mapapos.getLang();
        var reserva;
        var noreserva;
        var aneiMsg;
        switch(mapapos.lang) {
            case 'ca':
             reserva = 'Esteu sobre posidònia. Recordeu que si tira l\'àncora aquí podria vostè ser multat.' ;
             noreserva = 'Esteu sobre posidònia. Preguem tingui vostè la màxima precaució intentant que la seva  àncora quedi sobre sorra o roca.';
             aneiMsg  = 'Es troba vostè en zona verda protegida. Recordeu extremar les precaucions per evitar incendis. Preguem recullin i evitin llençar les escombraries, ja que podrien ser multats.';
             break;
              case 'es':
             reserva = 'Se encuentra usted sobre posidonia. Tenga en cuenta que si tira el ancla aquí podría usted ser multado.' ;
             noreserva = 'Se encuentra usted sobre posidonia. Rogamos tenga usted la máxima precaución intentando que su ancla quede sobre arena o roca.';
             aneiMsg  = 'Se encuentra usted en zona verde protegida. Recuerde extremar las precauciones para evitar incendios. Rogamos recojan y eviten tirar basura, ya que podrían ser multados.';
             break;
             case 'en':
             reserva = 'You are about posidonia. Keep in mind that if you drop the anchor here you could be fined.' ;
             noreserva = 'You are about posidonia. Please take the utmost caution trying to keep your anchor on sand or rock.';
             aneiMsg  = 'You are in a protected green area. Remember to take precautions to avoid fires. Please pick up and avoid littering, as they could be fined.';
             break;
             case 'de':
             reserva = 'Sie sind über Posidonia. Denken Sie daran, dass Sie eine Geldstrafe erhalten könnten, wenn Sie den Anker hier fallen lassen.' ;
             noreserva = 'Sie sind über Posidonia. Bitte seien Sie äußerst vorsichtig und versuchen Sie, Ihren Anker auf Sand oder Felsen zu halten.';
             aneiMsg  = 'Sie befinden sich in einer geschützten Grünfläche. Denken Sie daran, Vorsichtsmaßnahmen zu treffen, um Brände zu vermeiden. Bitte heben Sie Müll auf und vermeiden Sie ihn, da er mit einer Geldstrafe belegt werden kann.';
             break;
        }
      //  var src = 'http://gestcap.com/App/posidonia/anei.kml';
        var src2 = 'http://gestcap.com/App/posidonia/posTest.kml';
        var posicio = {"lat": 39.9163321, "lng": 3.5592721};
        var map = new google.maps.Map(
                document.getElementById('mapaPos'), {zoom: 11, center: posicio, disableDefaultUI: true});

//        var kmlLayer2 = new google.maps.KmlLayer(src, {
//            suppressInfoWindows: true,
//            preserveViewport: true,
//            map: map
//        });

        var kmlLayer = new google.maps.KmlLayer(src2, {
            suppressInfoWindows: true,
            preserveViewport: true,
            map: map
        });
        kmlLayer.addListener('click', function (event) {
            mapapos.marcador.setMap(null);
            mapapos.marcador = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
             var conte = (google.maps.geometry.poly.containsLocation(event.latLng, interiorPoly));
             var conte2 = (google.maps.geometry.poly.containsLocation(event.latLng, exteriorPoly));            
             var missatge;
        if(conte || conte2) {
             missatge = reserva;
        }else {
            missatge= noreserva;
        }
        
        
            $('#infoPos').html(missatge);
        });
        

        var interiors = [
            {lat: 39.76232842355503, lng: 3.405110504997997},
            {lat: 39.76225206429066, lng: 3.406151251961027},
            {lat: 39.76163844682439, lng: 3.405688871637098},
            {lat: 39.76015739032768, lng: 3.406268415788007},
            {lat: 39.75945051253754, lng: 3.404515220641289},
            {lat: 39.75890367469501, lng: 3.40459805563891},
            {lat: 39.75957716735186, lng: 3.408172196858097},
            {lat: 39.75903009656166, lng: 3.410306043772622},
            {lat: 39.75796993132811, lng: 3.410972775905945},
            {lat: 39.75674996757481, lng: 3.409931272601785},
            {lat: 39.75672134996115, lng: 3.410475478296233},
            {lat: 39.75726970163123, lng: 3.410899761276163},
            {lat: 39.75717960503592, lng: 3.411291634426132},
            {lat: 39.75635833934442, lng: 3.411379439777942},
            {lat: 39.75681526920209, lng: 3.411726485286792},
            {lat: 39.75593586123217, lng: 3.412551817496967},
            {lat: 39.75490341822847, lng: 3.412520243414419},
            {lat: 39.75447843747877, lng: 3.413896791428135},
            {lat: 39.75387160114418, lng: 3.414253130012814},
            {lat: 39.75241717989963, lng: 3.413389140464929},
            {lat: 39.75223338062452, lng: 3.414096208546413},
            {lat: 39.75296040655393, lng: 3.415712772347075},
            {lat: 39.75286868739938, lng: 3.417055088687775},
            {lat: 39.7505655405198, lng: 3.41772713081782},
            {lat: 39.75069233186702, lng: 3.418791655824704},
            {lat: 39.75129298552759, lng: 3.41883203219649},
            {lat: 39.75198949852165, lng: 3.420451067394239},
            {lat: 39.75183704004995, lng: 3.421636226797815},
            {lat: 39.75135408535286, lng: 3.421712411128859},
            {lat: 39.75200858776167, lng: 3.425635397227089},
            {lat: 39.7517655709509, lng: 3.427064785785565},
            {lat: 39.75074906534264, lng: 3.427775324028468},
            {lat: 39.75018775700864, lng: 3.427288090609337},
            {lat: 39.74998478956957, lng: 3.427655437880719},
            {lat: 39.7500882987845, lng: 3.428630409296041},
            {lat: 39.74946548828725, lng: 3.429005046554596},
            {lat: 39.74939779932863, lng: 3.429338718894874},
            {lat: 39.74962987112864, lng: 3.429550555049832},
            {lat: 39.74933588021864, lng: 3.430519765445192},
            {lat: 39.74840483637652, lng: 3.430650510954292},
            {lat: 39.74835481795647, lng: 3.431116852816738},
            {lat: 39.74601203758762, lng: 3.43247959300691},
            {lat: 39.7459089801912, lng: 3.43221268946774},
            {lat: 39.74514115969348, lng: 3.432327227975878},
            {lat: 39.74426266535354, lng: 3.435777309978625},
            {lat: 39.74502991448165, lng: 3.437074841418997},
            {lat: 39.74548644026738, lng: 3.439363878490826},
            {lat: 39.74487506099688, lng: 3.441391301418268},
            {lat: 39.74451441288525, lng: 3.441506469052458},
            {lat: 39.74453080359686, lng: 3.443249709473672},
            {lat: 39.74304320335177, lng: 3.442862065758365},
            {lat: 39.74386032659114, lng: 3.443788924137012},
            {lat: 39.74376264808403, lng: 3.444611307632295},
            {lat: 39.7444120761458, lng: 3.444075644709297},
            {lat: 39.74460067282391, lng: 3.444361814889529},
            {lat: 39.7442709236599, lng: 3.44593115800405},
            {lat: 39.74475298715371, lng: 3.446713024564545},
            {lat: 39.74406109290962, lng: 3.448516464055709},
            {lat: 39.74422998260827, lng: 3.450238650438191},
            {lat: 39.74222833213008, lng: 3.450102190758215},
            {lat: 39.74370916202473, lng: 3.453320660312902},
            {lat: 39.74358029409701, lng: 3.455030584815613},
            {lat: 39.743840774265, lng: 3.455369856049599},
            {lat: 39.7445468615421, lng: 3.4549383261815},
            {lat: 39.74481079099731, lng: 3.455204168853656},
            {lat: 39.74465996318573, lng: 3.456375728818457},
            {lat: 39.74489093167044, lng: 3.456620638561263},
            {lat: 39.74587182773782, lng: 3.456720837459302},
            {lat: 39.74649932501944, lng: 3.458026428712251},
            {lat: 39.74624127510907, lng: 3.458497424803759},
            {lat: 39.74696551536518, lng: 3.459406099436877},
            {lat: 39.74760336965175, lng: 3.459934650856309},
            {lat: 39.74792220052623, lng: 3.459762712464005},
            {lat: 39.74856174892806, lng: 3.459589645273766},
            {lat: 39.74873614775129, lng: 3.460194784464383},
            {lat: 39.7492818, lng: 3.4605414},
            {lat: 39.78683381966442, lng: 3.40405116139322},
            {lat: 39.76403437540321, lng: 3.404043988576639},
            {lat: 39.76232842355503, lng: 3.405110504997997}
        ];

        var autonomiques = new google.maps.Polyline({
            path: interiors,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 1
        });

        autonomiques.setMap(map);

        var interiorPoly = new google.maps.Polygon({
            paths: interiors,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        }); 
        
        var exteriors = [
    {lat:39.74850278938518 , lng:3.45975915638991 },
    {lat:39.74809840923644 , lng:3.461749799248142 },
    {lat:39.74590350330769 , lng:3.460319589094834 },
    {lat:39.74569996395992 , lng:3.458499367468368 },
    {lat:39.74420553335399 , lng:3.457691874450437 },
    {lat:39.74126416239428 , lng:3.458972489143486 },
    {lat:39.74057554427602 , lng:3.456971966326483 },
    {lat:39.7402685940265 , lng:3.460488650231603 },
    {lat:39.74101929744153 , lng:3.461744347326108 },
    {lat:39.73781006771491 , lng:3.46212014592139 },
    {lat:39.73839206540475 , lng:3.460209651571029 },
    {lat:39.73737268281353 , lng:3.459804498276715 },
    {lat:39.73755508150973 , lng:3.45860562682788 },
    {lat:39.73336243214634 , lng:3.457805961862834 },
    {lat:39.73113122172231 , lng:3.455005670821745 },
    {lat:39.7272723004529 , lng:3.452258448370558 },
    {lat:39.72607526621574 , lng:3.452592158042593 },
    {lat:39.72830144921795 , lng:3.456577993586412 },
    {lat:39.72771752793407 , lng:3.457432000142344 },
    {lat:39.72454204380713 , lng:3.452354637281314 },
    {lat:39.72107602981899 , lng:3.454631500442624 },
    {lat:39.72195186323284 , lng:3.456482521249076 },
    {lat:39.72096619987248 , lng:3.460275415641618 },
    {lat:39.72107436317513 , lng:3.464051338986314 },
    {lat:39.71969589698995 , lng:3.467174710465906 },
    {lat:39.72041810515415 , lng:3.467805915124946 },
    {lat:39.72034507585374 , lng:3.470471223668556 },
    {lat:39.72195022064976 , lng:3.471428049286673 },
    {lat:39.72004462731228 , lng:3.476933375483353 },
    {lat:39.71917522236514 , lng:3.476160411121536 },
    {lat:39.71737609019545 , lng:3.477108754861533 },
    {lat:39.71580465831778 , lng:3.476149182403061 },
    {lat:39.71664727411699 , lng:3.478769769297287 },
    {lat:39.7146123840151 , lng:3.47874423167589 },
    {lat:39.71482649605623 , lng:3.476204344565899 },
    {lat:39.71421179636819 , lng:3.476166184542397 },
    {lat:39.71297141037708 , lng:3.477655554342167 },
    {lat:39.7089941160872 , lng:3.474522133573235 },
    {lat:39.71059589715656 , lng:3.473839843373356 },
    {lat:39.71172881157199 , lng:3.471334140136937 },
    {lat:39.7129207306571 , lng:3.470162573797935 },
    {lat:39.71265733844816 , lng:3.469522878861393 },
    {lat:39.7119084390815 , lng:3.469901990676894 },
    {lat:39.71129029573666 , lng:3.469196124648766 },
    {lat:39.71059865941215 , lng:3.46810948467996 },
    {lat:39.71044987365942 , lng:3.465917551412607 },
    {lat:39.7096137056882 , lng:3.464076283265816 },
    {lat:39.70994470469867 , lng:3.462756468541865 },
    {lat:39.70975853903767 , lng:3.461606942206006 },
    {lat:39.70822946986694 , lng:3.461996127674358 },
    {lat:39.70604051738005 , lng:3.458818024978847 },
    {lat:39.70567525153187 , lng:3.456962297569448 },
    {lat:39.70068840456059 , lng:3.456427142841956 },
    {lat:39.70016163386662 , lng:3.50016322181635 },
    {lat:39.8166815952825 , lng:3.447255787977799 },
    {lat:39.78703579569714 , lng:3.40399173879306 },
    {lat:39.7492818 , lng:3.4605414 }   
  ];
  
   var estatals = new google.maps.Polyline({
            path: exteriors,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 1
        });

        estatals.setMap(map);

        var exteriorPoly = new google.maps.Polygon({
            paths: exteriors,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        
        var mesquida = [
            {lat:39.71115925053849 , lng:3.451940546376568 },
            {lat:39.71259555369567 , lng: 3.455854599357253},
            {lat:39.71522361690921 , lng:3.454799976510301 },
            {lat:39.71628453922816 , lng:3.456524242217616 },
            {lat:39.71768590838848 , lng:3.455454289952888 },
            {lat:39.72098945277256 , lng:3.457029633308912 },
            {lat:39.72177663576035 , lng:3.456484167697793 },
            {lat:39.7214334907809 , lng:3.455512593406214 },
            {lat:39.72080811263226 , lng:3.454748206820306 },
            {lat:39.72105007419791 , lng:3.454015771699872 },
            {lat:39.72395464543704 , lng:3.452206715142356 },
            {lat:39.72500598434541 , lng:3.452390642405396 },
            {lat:39.72593705554758 , lng:3.45511719044606 },
            {lat:39.72698462242432 , lng:3.45615397834989 },
            {lat:39.72802423787878 , lng:3.45676643888132 },
            {lat:39.7269172570554 , lng:3.454269562274708 },
            {lat:39.72590931218868 , lng:3.452905089636391 },
            {lat:39.72595059850165 , lng:3.452249094851418 },
            {lat:39.72663809191126 , lng:3.451933934126081 },
            {lat:39.72721618280486 , lng:3.452408658031767 },
            {lat:39.72805093280568 , lng:3.452221606400843 },
            {lat:39.7283328030441 , lng:3.452562431035597 },
            {lat:39.72847334617671 , lng:3.452798691235082 },
            {lat:39.73038935644296 , lng:3.454472518636764 },
            {lat:39.73161742118349 , lng:3.455013813509589 },
            {lat: 39.73123503760678, lng:3.455391846005895 },
            {lat:39.73336942276567 , lng:3.45787590743359 },
            {lat:39.73579321366066 , lng:3.458307025949137 },
            {lat:39.73682214894132 , lng:3.45873090931972 },
            {lat:39.73719991503152 , lng:3.458228926786719 },
            {lat:39.73755501329576 , lng:3.458688344697853 },
            {lat:39.73730177721024 , lng:3.459579353383047 },
            {lat:39.73855252572349 , lng:3.460168098567311 },
            {lat:39.73776478473204 , lng:3.461733084346879 },
            {lat:39.73912278754561 , lng:3.462281851298998 },
            {lat:39.74107651089895 , lng:3.46128267014904 },
            {lat:39.74025278604144 , lng:3.46053865664961 },
            {lat:39.74056518203933 , lng:3.457302615378561 },
            {lat:39.74164001561692 , lng:3.458803878622081 },
            {lat:39.74368194519846 , lng:3.457651080397981 },
            {lat:39.74509202558878 , lng:3.457871160312533 },
            {lat:39.74567456478054 , lng:3.458369541333586 },
            {lat:39.74558134438668 , lng:3.459253521603249 },
            {lat:39.74600753029559 , lng:3.460181367013453 },
            {lat:39.74811550525949 , lng:3.461576583994761 },
            {lat:39.7482341720173 , lng:3.460207056231626 },
            {lat:39.74854601010003 , lng:3.459909281312763 },
            {lat:39.74842485668945 , lng:3.459515211210453 },
            {lat:39.74786348323847 , lng:3.459981357135673 },
            {lat:39.74624664254907, lng:3.458499865013573 },
            {lat:39.7464586830277 , lng:3.458001314564469 },
            {lat:39.74585750881855 , lng:3.456593270103803 },
            {lat:39.74491616277194 , lng:3.456754118439094 },
            {lat:39.74462256253672 , lng:3.456240751149535 },
            {lat:39.74480505782243 , lng:3.455115749508331 },
            {lat:39.74368890387746 , lng:3.455062768381945 },
            {lat:39.74367411838673 , lng:3.453363008012529 },
            {lat:39.74228089706242 , lng:3.449951336194035 },
            {lat:39.74413704331621 , lng:3.450039782482748 },
            {lat:39.74393501227136 , lng:3.448935776328492 },
            {lat:39.7445047304825 , lng:3.447612627490637 },
            {lat:39.74454886539058 , lng:3.446858927042025 },
            {lat:39.74428031786017 , lng:3.445465801524679 },
            {lat:39.74458087426002 , lng:3.444311505232189 },
            {lat:39.74380796133564 , lng:3.443850843566816 },
            {lat:39.74309746973934 , lng:3.442853162307189 },
            {lat:39.74436072056757 , lng:3.443302139349773 },
            {lat:39.74452056856478 , lng:3.442871253657547 },
            {lat:39.74439873803715 , lng:3.441554371290214 },
            {lat:39.74475010095654 , lng:3.441390028266145 },
            {lat:39.74540071767343 , lng:3.439591108348037 },
            {lat:39.74537344964563 , lng:3.439093264222712 },
            {lat:39.74505104716047 , lng:3.437382271069673 },
            {lat:39.74465530142302 , lng:3.436486856009295 },
            {lat:39.74423363841839 , lng:3.435818788693987 },
            {lat:39.74523331804897 , lng:3.432263206089006 },
            {lat:39.74191281871083 , lng:3.430154133180767 },
            {lat:39.73802214039539 , lng:3.428555135839493 },
            {lat:39.72137354548772 , lng:3.429059332568221 },
            {lat:39.72274357166008 , lng:3.439230089661272 },
            {lat:39.72438117249569 , lng:3.438877873381669 },
            {lat:39.72421744394538 , lng:3.434362950443175 },
            {lat:39.72484064384283 , lng:3.434275235651225 },
            {lat:39.72546585691003 , lng:3.435868447748016 },
            {lat:39.72883361293675 , lng:3.434009498559214 },
            {lat:39.72730556887086 , lng:3.439142897278877 },
            {lat:39.72739665666828 , lng:3.446592118092611 },
            {lat:39.72618146047625 , lng:3.447132118292566 },
            {lat:39.72473204901198 , lng:3.442069367150311 },
            {lat:39.72310158165539 , lng:3.443577411443672 },
            {lat:39.7242076626189 , lng:3.447932810946426 },
            {lat:39.72174788088276 , lng:3.446065762744264 },
            {lat:39.72045682550538 , lng:3.448375444120679 },
            {lat:39.72203204555566 , lng:3.45086726428157 },
            {lat:39.72114398133189 , lng:3.451664137808435 },
            {lat:39.71505594749284 , lng:3.447814541964258 },
            {lat:39.70920362368744 , lng:3.45031908150254 },
            {lat:39.71008992125208 , lng:3.452892944815762 },
            {lat:39.71115925053849 , lng:3.451940546376568 }           
        ];
        
        var far = [
            {lat:39.71525815275706 , lng:3.475116911748526 },
            {lat:39.71488606660503 , lng:3.475621253045131 },
            {lat:39.71412920732837 , lng:3.473757105872006 },
            {lat:39.71202047745345 , lng:3.475978125672041 },
            {lat:39.71299354067113 , lng:3.477632756599793 },
            {lat:39.71399541273766 , lng:3.476234424955977 },
            {lat:39.71490994873709 , lng:3.476112682004597 },
            {lat:39.71455441810523 , lng:3.477648598579941 },
            {lat:39.71503459180261 , lng:3.478749648867825 },
            {lat:39.71635981949749 , lng:3.478806532302487 },
            {lat:39.71578686839877 , lng:3.476228042165241 },
            {lat:39.71712441780802 , lng:3.477214916348175 },
            {lat:39.7191294738106 , lng:3.476163446559197 },
            {lat:39.71980908510751 , lng:3.476701335134798 },
            {lat:39.72068524351391 , lng:3.475121414275597 },
            {lat:39.72057140592378 , lng:3.473941080433591 },
            {lat:39.71960697145398 , lng:3.474235786799642 },
            {lat:39.71980341288328 , lng:3.47283880302806 },
            {lat:39.71758150761868 , lng:3.465513791699464 },
            {lat:39.71662648372183 , lng:3.465915102590382 },
            {lat:39.71625854409416 , lng:3.465005818660711 },
            {lat:39.71263942233816 , lng:3.467483391875359 },
            {lat:39.71400980163354 , lng:3.469025392698788 },
            {lat:39.71306713062301 , lng:3.469850722938839 },
            {lat:39.71525815275706 , lng:3.475116911748526 }            
        ];
        
         

        var mesq = new google.maps.Polygon({
            paths: mesquida,
            strokeColor: '#0f0f0f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#91d982',
            fillOpacity: 0.35
        });
        
        mesq.setMap(map);
        
        var fa = new google.maps.Polygon({
            paths: far,
            strokeColor: '#0f0f0f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#91d982',
            fillOpacity: 0.35
        });
        
        fa.setMap(map);
        
        google.maps.event.addListener(mesq,'click',function(event){
            $('#infoPos').html(aneiMsg);
            mapapos.marcador.setMap(null);
            mapapos.marcador = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
        });
        
        google.maps.event.addListener(fa,'click',function(event){
            $('#infoPos').html(aneiMsg);
            mapapos.marcador.setMap(null);
            mapapos.marcador = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
        });

        $('#mapaPos').on('swipe', function (event) {
            $.event.special.swipe.horizontalDistanceThreshold(400);
        });

        mapapos.marcador = new google.maps.Marker({
            position: mapapos.pos,
            map: map
        });

        google.maps.event.addListener(map, 'click', function (event) {
            mapapos.marcador.setMap(null);
            mapapos.marcador = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
           
            $('#infoPos').html('');
        });

        setTimeout(function () {
            google.maps.event.trigger(map, 'click', {
                latLng: new google.maps.LatLng(mapapos.lat, mapapos.long)

            });
            map.setCenter({lat: mapapos.lat, lng: mapapos.long});
        }, 1000);


    },

    getLocalPos: function () {
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
    },
    
    getLang: function () {
        var lang = null;
        if (navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
            lang = lang[1];
        }

        if (!lang && navigator) {
            if (navigator.language) {
                lang = navigator.language;
            } else if (navigator.browserLanguage) {
                lang = navigator.browserLanguage;
            } else if (navigator.systemLanguage) {
                lang = navigator.systemLanguage;
            } else if (navigator.userLanguage) {
                lang = navigator.userLanguage;
            }
            lang = lang.substr(0, 2);
        }
        if (lang != 'es' && lang != 'ca' && lang != 'en' && lang != 'de') {
            lang = 'es';
        }
        mapapos.lang = lang;
    }


};
//###################################################################################

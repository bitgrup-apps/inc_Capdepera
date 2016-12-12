// JavaScript Document
var pushNotification;
var mapa;
var numImatges = 0;
var MACadress;
var push;
var platform;
var okPush = true; // si l'usuari vol rebre notificacions
var tokenPush;

function onLoad() {
	if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
		document.addEventListener('deviceready', initApp, false);
	} else {
		initApp();
	}
}

function initApp() {
	

	//controlam tipus dispositiu
	try{
		window.platform = device.platform;
		var vers = device.version;
		vers = vers.toString(); vers = vers.substring(0,3); 
		
		if (vers == '9.0' && device.platform == 'iOS'){
			$.mobile.hashListeningEnabled = true;
			$.mobile.pushStateEnabled = false;
		}else if(vers == '9.1' && device.platform == 'iOS'){
			$.mobile.hashListeningEnabled = false;
		}
	}catch(e){
            error_('E INIT-42','ERROR TIPUS DISPOSITIU', e);	
        }
	
	
	
	//push service
	var vullPush = readCookie('pushNotifications');
	if (vullPush == 2) {
		window.okPush = false; 
		if($('#activaNotificacions').is(':checked')) $('.swraper.light').click();
	}else{
		window.okPush = true; 
		if(!$('#activaNotificacions').is(':checked')) $('.swraper.light').click();
	}
	
	try{	
		initPushNotification();
	}catch(e){
            error_('E INIT-60','INIT PUSH NOTIFICATION', e);	
        }
	
	
	//MAC ADDRESS
	try{
		/*var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" 
						: (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" 
						: (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : "null";
		if (deviceType == 'Android'){
			getMacAddress();
		}else{
			window.plugins.uniqueDeviceID.get(successUUID, failUUID);
		}*/
                window.MACadress = device.uuid;
                iniciaSessioInici();
                
	}catch(e){
		error_('E INIT-75','MAC ADDRESS', e);	
	}
	
	
	//MAPA
	try{	
		initMap();
	}catch(e){
		errorMapa();
		error_('E INIT-84','ERROR INIT MAPA', e);		
	}
	
        
	
}



//####################//####################//####################
//####################      PUSh         #########################
//####################//####################//####################


function initPushNotification(){
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

	window.push.on('registration', function(data) {
		window.tokenPush = data.registrationId;
		guardaTokenPush(data.registrationId);
	});
	
	window.push.on('notification', function(data) {
		areYouSure(data.message,"Acceptar", function() { });
		
	});
	
	window.push.on('error', function(e) {
		error_('E INIT-139','ERROR PUSH NOTIFICATION', e);	
	});
        
        

}

//###################################################################################
//###################################################################################



//####################//####################//####################
//####################      mapa         #########################
//####################//####################//####################

function initMap(){
	try{
			plugin.google.maps.Map.isAvailable(function(isAvailable, message) {
				if (isAvailable) {
					var map = plugin.google.maps.Map.getMap(document.getElementById("mapaIncidencia"), {
						'backgroundColor': '#FFFFFF',
						'mapType': plugin.google.maps.MapTypeId.ROADMAP,
						'controls': {'compass': true,'myLocationButton': true,'indoorPicker': true,'zoom': true},
						'gestures': {'scroll': true,'tilt': true,'rotate': true,'zoom': true}
					});
					window.mapa = map;
				
					window.mapa.setClickable( true );
					window.mapa.getVisibleRegion();
					window.mapa.on(plugin.google.maps.event.MAP_READY, onMapInit);
					
				} else {
				  console.log(message); 
				  errorMapa();
				}
			});
			
	}catch(e){
            error_('E INIT-178','ERROR INIT MAP', e);	
        }
		
}

function onMapInit() { 

		//LOCALITZACIÓ
		var onSuccess = function(location) {
			//comprovam posició
			
			if(comprovaPosicio(location.latLng.lat, location.latLng.lng )){
				$('#latitutIncidencia').val(location.latLng.lat);
				$('#longitutIncidencia').val(location.latLng.lng);
				const GOOGLE = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);
				var request = {
				  'position': GOOGLE
				};
				plugin.google.maps.Geocoder.geocode(request, function(results) {
				  if (results.length) {
					var result = results[0];
					var position = result.position; 
					var address = [
					  result.thoroughfare || "",
					  result.locality || "",
					  result.postalCode || ""].join(", ");
					window.mapa.trigger("MARKER_REMOVE");
					window.mapa.addMarker({
					  'position': position,
					  'title':  address
					}, function(marker) {
					  window.mapa.addEventListenerOnce("MARKER_REMOVE", function() {marker.remove();});
					});
					window.mapa.animateCamera({
					  target: {
						lat: location.latLng.lat,
						lng: location.latLng.lng,
					  },
					  'duration': 2,
					  zoom: 18
					});
                                        
					$('#adresaIncidencia').val(result.thoroughfare);
					$('#poblacioIncidencia').val(result.locality);
				  } else {
						errorMapa();
				  }
				});	
				
			}else{
				errorMapa();
                                error_('E INIT-229','ERROR ON MAP INI', e);	
			}
		  
		};
		
		var onError = function(msg) {
		  errorMapa();
		  error_('E INIT-235','ERROR ON MAP INI', e);	
		};
		
		//AGAFAM LA LOCALITZACIÓ
		window.mapa.getMyLocation(onSuccess, onError);
		// SI CLICK GUARDAM NOVA LOCALITZACIÓ
		var evtName = plugin.google.maps.event.MAP_CLICK;
		window.mapa.on(evtName, function(latLng) {
			if(comprovaPosicio(latLng.lat, latLng.lng)){
				window.mapa.trigger("MARKER_REMOVE");
				$('#latitutIncidencia').val(latLng.lat);
				$('#longitutIncidencia').val(latLng.lng);
				const NOVAPOSICIO = new plugin.google.maps.LatLng(latLng.lat, latLng.lng);
				novaLocalitzacio(NOVAPOSICIO);
			}else{
				alert("La nova posició no es troba a una àrea correcte");	
			}
		});
		//ACTUALITZAM LLISTA DE INCIDENCIES
		iniciaLlistatIncidencies();

}

//NOVA LOCALITZACIÓ AL MAPA
function novaLocalitzacio(posicio){
	
			var request = {
			  'position': posicio
			};
			plugin.google.maps.Geocoder.geocode(request, function(results) {
			  if (results.length) {
				  
				var result = results[0];
				var position = result.position; 
				
				var address = [
				  result.thoroughfare || "",
				  result.locality || "",
				  result.postalCode || ""].join(", ");
				window.mapa.addMarker({
				  'position': position,
				  'title':  address
				}, function(marker) {
				  marker.showInfoWindow();
				  window.mapa.addEventListenerOnce("MARKER_REMOVE", function() {marker.remove();});
				});
				window.mapa.animateCamera({
				  target: {
					lat: position.lat,
					lng: position.lng
				  },
				  'duration': 1,
				  zoom: 18
				});
                                 $('#adresaIncidencia').val(result.thoroughfare);
				 $('#poblacioIncidencia').val(result.locality);
			  } else {
				alert("No es pot aconseguir la vostra ubicació");
			  }
			});

}

//###################################################################################
//###################################################################################


//####################      MAC ADDRESS         #########################

function getMacAddress(){
	try{
		window.MacAddress.getMacAddress(
			function(macAddress) {
				window.MACadress = macAddress;
				iniciaSessioInici();
			},function(fail) {
				error_('E INIT-313','ERROR GET MAC ADDRESS', fail);	
			}
		);	
	}catch(e){ 
            error_('E INIT-317','ERROR GET MAC ADDRESS', e);	
            window.MACadress = '00:00:00';
        }
}
function successUUID(uuid){
	//console.log(uuid);
	window.MACadress = uuid;
	iniciaSessioInici();
}
function failUUID(e){
	error_('E INIT-235','ERROR UUID', e);	  
	window.MACadress = '00:00:00';
}
//###################################################################################
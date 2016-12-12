// JavaScript Document

//GLOBAL
var xml_incidencies = '';
function iniciaLlistatIncidencies() {
    window.xml_incidencies = llistatAjax();
    carregaLlistaIn(window.xml_incidencies);
}

function carregaLlistaIn(xml_in) {

    var inc = '';
    $(xml_in).find('incidencia').each(function (index, element) {
        
        inc = inc + '<div class="col-xs-12 incidencia" data-role="collapsible" data-filtertext="' + $(this).find('titol').text() + '">' +
         '<a class="col-xs-8" href="#veureIncidencia" onClick="idInc = ' + $(this).find('Id').text() + ';" data-transition="slide" data-role="none" >' +
         '<b>' + getTipusIncidencia($(this).find('tipus').text()) + '</b>' +
         '<p>Incidència creada el ' + $(this).find('fecha').text() + '</p>' +
        // '<p>' + $(this).find('titol').text() + '</p>' +
         '</a>' +
         '<div class="col-xs-4 img" style="background-image:url(\'http://www.arta.cat:82/panel/aplicacions/incidencies/img/incidencies/' + $(this).find('img').text() + '\');"></div>' +
         '</div>';
        
        

        try {
            //insertam al mapa
            var lat = parseFloat($(this).find('latitut').text());
            var long = parseFloat($(this).find('longitut').text());
            var idIn = parseInt($(this).find('Id').text());
            var title = $(this).find('titol').html();
            title =  getTipusIncidencia($(this).find('tipus').text());
            window.mapa.addMarker({
                'position': new plugin.google.maps.LatLng(lat, long),
                'title': title,
                'icon': {'url': 'www/icons/icon-incid.png'},
                'snippet': 'Clica per veure',
                'styles': {
                    'text-align': 'center',
                    'font-weight': '400',
                    'color': '#999999',
                    'font-size': '12px',
                    'padding': '5px',
                    'border-radius': '4px',
                    'border': '1px solid #fbd375'
                },
                'markerClick': function (marker) {
                    marker.showInfoWindow();
                },
                'infoClick': function (marker) {
                    window.idInc = idIn;
                    mostraIncidencia();
                    $.mobile.changePage("#veureIncidencia", {transition: "slide", changeHash: true});
                }
            });
        } catch (e) {
             error_('E INCID-57','addMarker', e);
        }
    });
    $('#collapsiblesetForFilter').html(inc);

}


function getTipusIncidencia(id) {
    id = parseInt(id);
    switch (id) {
        case 1:
            return "Xarxa d'aigua";
        case 2:
            return 'Parcs infantils i mobiliari urbà';
        case 3:
            return 'Neteja i gestió de residus';
        case 4:
            return 'Enllumenat';
        case 5:
            return 'Suggeriments';
        case 6:
            return 'Altres';
    }
}


function carregaMapa() {
    try {
        var div = document.getElementById('mapaLlista');
        window.mapa.setDiv(div);
    } catch (e) {
         error_('E INCID-89','carregaMapa', e);
    }
}

function carregaMapaPosicionament() {
    try {
        var div = document.getElementById('mapaIncidencia');
        window.mapa.setDiv(div);
    } catch (e) {
        error_('E INCID-98','carregaMapaPosicionament', e);
    }
}




function llistatAjax() {
    var xml = '';
    var formData = new FormData();
    formData.append("funcio", "getIncidencies");
    formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
    $.ajax({
        url: 'http://www.arta.cat:82/App/incidencies.php', type: 'POST', data: formData,
        cache: false, contentType: false, processData: false, async: false, dataType: "xml", beforeSend: function () {},
        success: function (data) {
            xml = data;
        },
        error: function (e) {
            alert("E INCID-118: No es pot accedir al serveis a n'aquest moment");
            error_('E INCID-118','getIncidencies', e);
        }
    });
    return xml;
}

function refrescaIncidencies() {
    $('#loading').css('display', 'table');
    try {
        window.xml_incidencies = llistatAjax();
        carregaLlistaIn(window.xml_incidencies);
        window.mapa.clear();
        carregaMapa();
    } catch (e) {
        alert("E INCID-133: No s'ha aconseguit carregar el mapa");
        error_('E INCID-133','refrescaIncidencies', e);
    }
    setTimeout("$('#loading').css('display','none')", 1500);
}

function mostraIncidencia() {
    $('#loading').css('display', 'table');
    var Incide = window.idInc;
    var xml;
    var formData = new FormData();
    formData.append("funcio", "getIncidencia");
    formData.append("id", Incide);
    formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
    $.ajax({
        url: 'http://www.arta.cat:82/App/incidencies.php', type: 'POST', data: formData,
        cache: false, contentType: false, processData: false, async: false, dataType: "xml", beforeSend: function () {},
        success: function (data) {
            xml = data;
        },
        error: function (e) {
            alert('E INCID-154: No es pot conectar amb el servidor a n\'aquests moments');
            error_('E INCID-154','mostraIncidencia', e);
        }});
    try {
        $('#titolIncidenciaP2').html( getTipusIncidencia($(xml).find('tipus').text()) );
        $('#adresaIncidenciaP2').html($(xml).find('adresa').text());
        $('#dataIncidenciaP2').html($(xml).find('fecha').text());
        $('#comentariIncidenciaP2').html($(xml).find('descripcio').text());
        $('#verificaIncidencia').data('incidencia',$(xml).find('Id').text());
        //GET IMG 1
        if ($(xml).find('img').text() != '') {
            $('#imgIncidenciaZ').attr('src', 'http://www.arta.cat:82/panel/aplicacions/incidencies/img/incidencies/' + $(xml).find('img').text());
        } else {
            $('#imgIncidenciaZ').attr('src', 'images/no-img-incid.png');
        }

        //GET IMG 2
        if ($(xml).find('img2').text() != '') {
            $('#imgIncidenciaY').attr('src', 'http://www.arta.cat:82/panel/aplicacions/incidencies/img/incidencies/' + $(xml).find('img2').text());
        } else {
            $('#imgIncidenciaY').attr('src', 'images/no-img-incid.png');
        }

        //GET IMG 3
        if ($(xml).find('img3').text() != '') {
            $('#imgIncidenciaX').attr('src', 'http://www.arta.cat:82/panel/aplicacions/incidencies/img/incidencies/' + $(xml).find('img3').text());
        } else {
            $('#imgIncidenciaX').attr('src', 'images/no-img-incid.png');
        }


        //$.mobile.changePage( "#veureIncidencia", { transition: "slide", changeHash: true });
    } catch (e) {
        error_('E INCID-185',xml, e);
    }
    $('#loading').css('display', 'none');
}



//####################//####################//####################
//####################      camera         #########################
//####################//####################//####################

function getImg() {
    navigator.camera.getPicture(onSuccess, onFail, {quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
    });
}
function getImgLibrary() {
    navigator.camera.getPicture(onSuccess, onFail, {quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true
    });
}
function onSuccess(imageData) {
    var id = 'imgIncidencia';

    switch (window.numImatges) {
        case 1:
            id = 'imgIncidenciaB';
            $('#imgIncidenciaB').siblings('.removeImg').css('display', 'block');
            break;
        case 2:
            id = 'imgIncidenciaC';
            $('#imgIncidenciaC').siblings('.removeImg').css('display', 'block');
            break;
        default:
            id = 'imgIncidencia';
            $('#imgIncidencia').siblings('.removeImg').css('display', 'block');
            break;
    }

    window.numImatges++;
    var image = document.getElementById(id);
    image.src = imageData;
}


function onFail(message) {
    error_('E INCID-235','ERROR GET IMATGE', message);
}

function removeImg(i) {
    window.numImatges--;
    switch (i) {

        case 1:
            if (window.numImatges == 2) {
                $('#imgIncidencia').attr('src', $('#imgIncidenciaB').attr('src'));
                $('#imgIncidenciaB').attr('src', $('#imgIncidenciaC').attr('src'));
                $('#imgIncidenciaC').attr('src', 'images/no-img-2.jpg');
                $('#imgIncidenciaC').siblings('.removeImg').css('display', 'none');
            } else if (window.numImatges == 1) {
                $('#imgIncidencia').attr('src', $('#imgIncidenciaB').attr('src'));
                $('#imgIncidenciaB').attr('src', 'images/no-img-2.jpg');
                $('#imgIncidenciaB').siblings('.removeImg').css('display', 'none');
            } else {
                $('#imgIncidencia').attr('src', 'images/no-img-2.jpg');
                $('#imgIncidencia').siblings('.removeImg').css('display', 'none');
            }

            break;
        case 2:
            if (window.numImatges == 2) {
                $('#imgIncidenciaB').attr('src', $('#imgIncidenciaC').attr('src'));
                $('#imgIncidenciaC').attr('src', 'images/no-img-2.jpg');
                $('#imgIncidenciaC').siblings('.removeImg').css('display', 'none');
            } else if (window.numImatges == 1) {
                $('#imgIncidenciaB').attr('src', 'images/no-img-2.jpg');
                $('#imgIncidenciaB').siblings('.removeImg').css('display', 'none');
            }
            break;
        case 3:
            $('#imgIncidenciaC').attr('src', 'images/no-img-2.jpg');
            $('#imgIncidenciaC').siblings('.removeImg').css('display', 'none');
            break;
    }
}
//###################################################################################
//###################################################################################




//####################//####################//####################
//####################      PUSH         #########################
//####################//####################//####################

function guardaTokenPush(token) {
    if (window.okPush) {
        $.post('http://www.arta.cat:82/App/incidencies.php',
         {funcio: 'guardaToken', userToken: token, TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y', os: window.platform},
         function (data) {
             try {
                 var resposta = JSON.parse(data);
                 if (resposta.error == '1') {
                     error_('E INCID-291',data, resposta.str);
                 }
             } catch (e) {
                 error_('E INCID-294',data, e);
             }
         }
        );
    }
}

function actualitzaPush() {
    if ($('#activaNotificacions').is(':checked')) {
        //marcam cookie si
        var date, expires;
        var days = 3650;
        var name = 'pushNotifications';
        var value = 1;
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
        var actulitzat = actualitzaServidorPush(true);
        if (!actulitzat) {
            alert('En aquest moment no es pot resoldre la solicitut, provi més tart');
            $('.swraper.light').click();
        }
    } else {
//marcam cookie no
        var date, expires;
        var days = 3650;
        var name = 'pushNotifications';
        var value = 2;
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
        var actulitzat = actualitzaServidorPush(false);
        if (!actulitzat) {
            alert('En aquest moment no es pot resoldre la solicitut, provi més tart');
            $('.swraper.light').click();
        }
    }
}


function actualitzaServidorPush(guardaToken) {
    if (guardaToken)
        var funcio = 'guardaToken';
    else
        var funcio = 'eliminaToken';
    var ok = true;
    $.post('http://www.arta.cat:82/App/incidencies.php',
     {funcio: funcio, userToken: window.tokenPush, TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y', os: window.platform},
     function (data) {
         try {
             var resposta = JSON.parse(data);
             if (resposta.error == '1') {
                 error_('E INCID-348',data, resposta.str);
                 ok = false;
             }
         } catch (e) {
             error_('E INCID-352',data, e);
             ok = false;
         }
     }
    );
    return ok;
}



//###################################################################################
//###################################################################################



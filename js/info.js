// JavaScript Document

var init = {

    urlFunctions: 'http://gestcap.com/gestio/App/part-turistica/',
    lang: 'es',

    initApp: function () {
        init.initLangs();
        init.session.initSession();
    },
    home: function () {
        $.mobile.changePage("#home-nou", {transition: "slide", reverse: true});
    },
    onCapdepera: {
        menuOk: false,
        file: 'oncapdepera.class.php',
        init: function () {
            init.onCapdepera.menu();
        },
        menu: function () {
            if (!init.onCapdepera.menuOk) {
                var file = init.onCapdepera.file;
                var formData = new FormData();
                formData.append('funcio', 'getMenu');
                formData.append('lang', init.lang);
                var resp = init.sendAjax(formData, file, true);
                if (resp.error == 0) {
                    //carrega sub-menus
                    $('#m-visites').html(resp.visites);
                    $('#m-festes').html(resp.festes);
                    $('#m-nuclis').html(resp.nuclis);
                    $('#m-rutes').html(resp.rutes);

                    $('.menu').click(function () {
                        if ($(this).find('.sub-menu').is(":visible")) {
                            var that = this;
                            $(this).find('.sub-menu').slideToggle('slow', function () {
                                $(that).removeClass('open');
                            });
                        } else {
                            $(this).addClass('open');
                            $(this).find('.sub-menu').slideToggle('slow');
                        }
                    });
                    init.onCapdepera.menuOk = true;
                }
            }
            $.mobile.changePage("#oncapdepera-home", {transition: "slide"});
        },
        getFitxa: function (id, tipus) {
            var file = init.onCapdepera.file;
            var formData = new FormData();
            formData.append('funcio', 'getFitxa');
            formData.append('tipus', tipus);
            formData.append('id', id);
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#oncpd-html').html(resp.str);
                $.mobile.changePage("#oncapdepera-fitxa", {transition: "slide"});
            }
        }
    },
    esports: {
        menuOk: false,
        file: 'esports.class.php',
        init: function () {
            init.esports.menu();
        },
        menu: function () {
            var file = init.esports.file;
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniments');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#llista-esports').html(resp.str);
                $.mobile.changePage("#esports-home", {transition: "slide"});
            }
        },
        getFitxa: function (id) {
            var file = init.esports.file;
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniment');
            formData.append('id', id);
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#img-esport').css('background-image', 'url(' + resp.img + ')');
                $('#fitxa-esportiva').html(resp.str);
                $.mobile.changePage("#esports-fitxa", {transition: "slide"});
            }
        }
    },
    noticies: {
        menuOk: false,
        file: 'notis.class.php',
        init: function () {
            init.noticies.menu();
        },
        menu: function () {
            var file = init.noticies.file;
            var formData = new FormData();
            formData.append('funcio', 'getAll');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#llista-noticies').html(resp.str);
                $.mobile.changePage("#noticies-home", {transition: "slide"});
            }
        },
        getFitxa: function (id) {
            var file = init.noticies.file;
            var formData = new FormData();
            formData.append('funcio', 'getId');
            formData.append('id', id);
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#img-noticia').css('background-image', 'url(' + resp.img + ')');
                $('#desc-noticia').html(resp.str);
                init.noticies.arreglaLinks();
                $.mobile.changePage("#noticies-fitxa", {transition: "slide"});
            }
        },
        arreglaLinks: function () {
            //canviam els links per window.load
            $('#desc-noticia a').not('.notLink').each(function () {
                var href = $(this).attr('href');
                $(this).attr('href', '#');
                $(this).click(function () {
                    window.open(href, '_system');
                });
            });
        }
        
    },
    
    esdeveniments: {

        file: 'esdeveniments.class.php',

        getEsdeveniments: function () {
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniments');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, init.esdeveniments.file, true);
            if (resp.error == 0) {
                $('#llista-esdeveniments').html(resp.str);
                $.mobile.changePage("#esdeveniments-home", {transition: "slide"});
            }
        },
        getFitxa: function (id) {
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniment');
            formData.append('lang', init.lang);
            formData.append('id', id);
            var resp = init.sendAjax(formData, init.esdeveniments.file, true);
            if (resp.error == 0) {
                $('#desc_esdev').html(resp.str);
                $('#img_esdev').css('background-image', 'url(http://www.oncapdepera.com/panel/img/eventos/' + resp.img + ')');
                $.mobile.changePage("#esdeveniments-fitxa", {transition: "slide"});
            }
        }
    },
    initLangs: function () {
        init.getLang();
        jQuery.i18n.properties({
            name: 'Messages', //Nombre del fichero
            path: 'bundle/', //Carpeta donde la incluimos
            mode: 'both',
            language: init.lang, //Lenguaje, hablaremos del el abajo
            callback: function () {
                //Callback
                init.setLiterals();
            }
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
        if(lang != 'es' && lang != 'ca'){
            lang = 'es';
        }
        init.lang = lang;
    },
    setLiterals: function () {
        var literal = null;
        $('.literal').each(function () {
            literal = $(this).data('literal');
            $(this).html(jQuery.i18n.prop(literal));
        });
    },
    sendAjax: function (formData, file, loading_gif) {

        var json = false;

        $.ajax({
            url: init.urlFunctions + file, type: 'POST', data: formData, cache: false, contentType: false, processData: false, async: false,
            beforeSend: function () {
                if (loading_gif) {
                    $('#loading').css('display', 'table');
                }
            },
            complete: function () {
                setTimeout("$('#loading').css('display', 'none')", 300);
            },
            success: function (resposta) {
                if( (typeof resposta) === 'string'){
                    resposta = JSON.parse(resposta);
                }
                try {
                    if (resposta.error == 1) {
                        init.error_('E BIT-80', '', resposta.str);
                    } else if (resposta.error == 0) {
                        json = resposta;
                    } else {
                        init.error_('E BIT-81', '', resposta);
                    }
                } catch (e) {
                    init.error_('E BIT-80', '', e);
                }
            },
            error: function (e) {
                $('#loading').css('display', 'none');
                init.error_('E BIT-251', '', e);
            },
            timeout: 60000
        });
        return json;
    },
    session: {
        initSession: function () {
            if (init.session.getSession()) {
                init.session.motraAmagaLogin(false);
            } else {
                init.session.motraAmagaLogin(true);
            }
        },
        getSession: function () {
            var cookie = localStorage.getItem('sessionId');
            var code = md5(window.MACadress);
            if (cookie == code)
                return true;
            else
                return false;

        },
        login: function () {
            if (!init.session.getSession()) {
                var ok = true;
                //comprovam usuari
                if ($('#usuari-login').val() == '' || $('#pass-login').val() == '') {
                    init.areYouSure('Tots el camps son obligatories', 'Acceptar', function () {});
                    ok = false;
                }

                if (ok) {
                    var formData = new FormData();
                    formData.append('userLogin', $('#usuari-login').val()); 
                    formData.append('passwordLogin', $('#pass-login').val());
                    formData.append("macAddress", window.MACadress);
                    formData.append("funcio", 'loginOperari');
                    formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
                    var antigaUrl = init.urlFunctions;
                    init.urlFunctions = 'http://gestcap.com/gestio/App/incidencies.php';
                    var resposta = init.sendAjax(formData, '', true);
                    var intResp = parseInt(resposta.login_code);
                    if (intResp === 99) {//LOGIN OK
                        window.user = $('#usuari-login').val();
                        window.pass = md5($('#pass-login').val());
                        localStorage.setItem('idU', window.user);
                        localStorage.setItem('idP', window.pass);
                        localStorage.setItem('sessionId', md5(window.MACadress));
                        if (resposta.verificador == 1) {
                            localStorage.setItem('verificador', 1);
                        } else {
                            localStorage.setItem('verificador', 0);
                        }
                        iniciaLlistatIncidencies();
                        $.mobile.changePage("#home", {transition: "slide", changeHash: true});
                        init.session.motraAmagaLogin(false);
                    } else if (intResp === 2) {
                        init.areYouSure('Aquest dispositiu no està autoritzat', 'Acceptar', function () {});
                    } else if (intResp === 3) {
                        init.areYouSure('Usuari i/o contrasenya incorrecte', 'Acceptar', function () {});
                    }
                    init.urlFunctions = antigaUrl;
                }
            } else {
                iniciaLlistatIncidencies();
                $.mobile.changePage("#home", {transition: "slide", changeHash: true});
            }
            return false;
        },
        motraAmagaLogin: function (mostra) {
            if (mostra) {
                $('#login-form').show();
                $('#login-form-out').hide();
            } else {
                $('#login-form').hide();
                $('#login-form-out').show();
            }
        },
        logOut: function () {
            localStorage.setItem('idU', '');
            localStorage.setItem('idP', '');
            localStorage.setItem('sessionId', '');
            init.session.motraAmagaLogin(true);
        }
    },
    mapa: {
        mapaUbicacio: function(){
            try {
                var div = document.getElementById('mapa');
                console.log(div);
                window.mapa.setDiv(div);
                $.mobile.changePage("#oncapdepera-ubicacio", {transition: "slide"});
            } catch (e) {
                 error_('E INCID-316','carregaMapa', e);
            }
        },
        puntAlMapa: function(lat, long, text){
            var position_ = new plugin.google.maps.LatLng(lat, long);
            var request = {'position': position_};
            plugin.google.maps.Geocoder.geocode(request, function (results) {
                    if (position_) {
                        window.mapa.addMarker({
                            'position': position_,
                            'title': text
                        }, function (marker) {
                            marker.showInfoWindow();
                            window.mapa.addEventListenerOnce("MARKER_REMOVE", function () {
                                marker.remove();
                            });
                        });
                        window.mapa.animateCamera({
                            target: {
                                lat: lat,
                                lng: long
                            },
                            'duration': 1,
                            zoom: 18
                        });
                    } 
            });
            $.mobile.changePage("#oncapdepera-ubicacio");
        }
    },
    incidencia: {
        file: 'oncapdepera.class.php',
        enviaIncidencia: function () {

            var imageURI = document.getElementById('imgIncidenciaOnCap').getAttribute("src");
            if (imageURI === 'images/no-img-2.jpg') {
                var formData = new FormData($('#form-incidenciaOnCap')[0]);
                formData.append('lang', init.lang);
                var resp = init.sendAjax(formData, init.incidencia.file, true);
                if (resp.error == 0) {
                    alert('INCIDÈNCIA ENVIADA CORRECTAMENT');
                    $.mobile.changePage("#home", {transition: "slide", changeHash: false});
                }
            } else {
                try {
                    var parametros = {
                        adresaIncidencia: document.getElementById("adresaIncidenciaOnCap").value,
                        poblacioIncidencia: document.getElementById("poblacioIncidenciaOnCap").value,
                        assumpte: document.getElementById("assumpteOnCap").value,
                        descripcio: document.getElementById("descripcioOnCap").value,
                        longitutIncidencia: document.getElementById("longitutIncidenciaOnCap").value,
                        latitutIncidencia: document.getElementById("latitutIncidenciaOnCap").value,
                        email: document.getElementById("emailOnCap").value,
                        name: 'imgIncidenciaOnCap',
                        funcio: 'novaIncidenciaOnCap'
                    };
                    var options = new FileUploadOptions();
                    options.fileKey = "imgIncidenciaOnCap";
                    options.fileName = 'imgIncidenciaOnCap';
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.params = parametros;
                    var ft = new FileTransfer();
                    ft.onprogress = function (progressEvent) {
                        $('#loading').css('display', 'table');
                    };
                    ft.upload(imageURI, encodeURI(init.urlFunctions + init.incidencia.file), init.incidencia.win, init.incidencia.onFail, options);
                } catch (e) {
                    $('#loading').css('display', 'none');
                    init.error_('E 395', 'ERROR ENVIANT INCIDENCIA', e);
                }
            }

            return false;
        },
        onFail: function (message) {
            $('#loading').css('display', 'none');
            init.error_('E 611', 'ERROR ENVIANT INCIDENCIA', message);
        },
        win: function (data) {
            $('#loading').css('display', 'none');
            try {
                var resposta = JSON.parse(data.response);
                if (resposta.error == '1') {
                    init.error_('E FUNCTIONS-405', data.response, resposta.str);
                } else {
                    alert('INCIDÈNCIA ENVIADA CORRECTAMENT');
                    $.mobile.changePage("#home-nou", {transition: "slide", changeHash: false});
                }
            } catch (e) {
                init.error_('E 416', data, e);
            }
        }
    },
    img: {
        getImg: function () {
            navigator.camera.getPicture(init.img.onSuccess, init.img.onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                correctOrientation: true
            });
        },
        getImgLibrary: function () {
            navigator.camera.getPicture(init.img.onSuccess, init.img.onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                correctOrientation: true
            });
        },
        onSuccess: function (imageData) {
            var id = 'imgIncidenciaOnCap';
            var image = document.getElementById(id);
            image.src = imageData;
        },
        onFail: function (message) {
            //init.error_('E INCID-235','ERROR GET IMATGE', message);
        }
    },
    carregaPagExt: function (url) {
        var ref = window.open(url, '_system', 'location=yes');
    },
    openRadio: function () {
        init.carregaPagExt('http://capdeperaradio.com/radioendirecte/');
    },
    areYouSure: function (text2, button, callback, back_) {
        $("#sure .sure-2").text(text2);
        $("#sure .sure-do").text(button).on("click.sure", function () {
            $(this).off("click.sure");
            callback();
        });
        $.mobile.changePage("#sure");
    },
    htmlEntities: function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    openDeviceBrowser: function (externalLinkToOpen) {
        window.open(externalLinkToOpen, '_system', 'location=no');
    },
    error_: function (codi, json, error) {
        //$.post('', {funcio: 'appError', TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y', codi: codi, json: json, error: error}, function (data) {});
        console.log(codi);
        console.log(json);
        console.log(error);
        init.areYouSure('E BIT-73: No es pot accedir al serveis a n\'aquest moment', 'Aceptar', function () {});
    }
}


//$(document).ready(function(){init.initApp();});
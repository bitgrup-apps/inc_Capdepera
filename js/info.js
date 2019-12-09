// JavaScript Document

var init = {

    urlFunctions: 'http://gestcap.com/gestio/App/part-turistica/',
    lang: 'es',
    ipA: '',

    initApp: function () {
        init.initLangs();
        init.session.initSession();
        init.veurePartOperaris();
    },
    home: function () {
        $.mobile.changePage("#home-nou", {transition: "slide", reverse: true});
    },
    veurePartOperaris() {
        var formData = new FormData();
        formData.append('funcio', 'veure_part_operaris');
        var resp = init.sendAjax(formData, 'oncapdepera.class.php', false);
        if (resp.error == 0) {
            if (resp.veure_part_operaris == 1) {
                $('#login_home').css('display', 'block');
            } else {
                $('#login_home').css('display', 'none');
            }
        }
    },
    onCapdepera: {
        menuOk: false,
        file: 'oncapdepera.class.php',
        init: function () {
            init.onCapdepera.menu();
            init.sendEstadistica('oncapdepera');
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
                    $('#m-rutes-c').html(resp.ciclistes);

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
            init.sendEstadistica('esports');
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
    musica: {
        menuOk: false,
        file: 'musica.class.php',
        init: function () {
            init.musica.menu();
            init.sendEstadistica('musica');
        },
        menu: function () {
            var file = init.musica.file;
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniments');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#llista-musica').html(resp.str);
                $.mobile.changePage("#musica-home", {transition: "slide"});
            }
        },
        getFitxa: function (id) {
            var file = init.musica.file;
            var formData = new FormData();
            formData.append('funcio', 'getEsdeveniment');
            formData.append('id', id);
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#img-musica').css('background-image', 'url(' + resp.img + ')');
                $('#fitxa-musica').html(resp.str);
                $.mobile.changePage("#musica-fitxa", {transition: "slide"});
            }
        }
    },
    avisos: {
        menuOk: false,
        file: 'avisos.class.php',
        init: function () {
            init.avisos.menu();
            init.sendEstadistica('avisos');
        },
        menu: function () {
            var file = init.avisos.file;
            var formData = new FormData();
            formData.append('funcio', 'getAvisos');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#avisos-body').html(resp.str);
                $.mobile.changePage("#avisos", {transition: "slide"});
            }
        },
        getAvis: function (id) {
            var file = init.avisos.file;
            var formData = new FormData();
            formData.append('funcio', 'getAvis');
            formData.append('id', id);
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#avisos-fitxa-body').html(resp.str);
                $.mobile.changePage("#avisos-fitxa", {transition: "slide"});
            }
        }
    },
    noticies: {
        menuOk: false,
        file: 'notis.class.php',
        init: function () {
            init.noticies.menu();
            init.sendEstadistica('noticies');
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

    cine: {
        file: 'esdeveniments.class.php',
        init: function () {
            init.cine.menu();
            init.sendEstadistica('noticies');
        },
        menu: function () {
            init.sendEstadistica('cinema');
            var formData = new FormData();
            formData.append('funcio', 'getCine');
            formData.append('lang', init.lang);
            var resp = init.sendAjax(formData, init.esdeveniments.file, true);
            if (resp.error == 0) {
                $('#llista-cine').html(resp.str);
                $.mobile.changePage("#cine-home", {transition: "slide"});
            }
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
            init.sendEstadistica('agenda');
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
        },

    },
    reservaMarina: {
        menuOk: false,
        file: 'oncapdepera.class.php',

        init: function () {
            var file = init.reservaMarina.file;
            var formData = new FormData();
            formData.append('funcio', 'getFitxa');
            formData.append('tipus', 'reserva');
            formData.append('id', '0');
            formData.append('lang', 'es');
            var resp = init.sendAjax(formData, file, true);
            if (resp.error == 0) {
                $('#reservamarina-fitxa-body').html(resp.str);
                $.mobile.changePage("#reservamarina-fitxa", {transition: "slide"});
            } else {
                $('#reservamarina-fitxa-body').html(resp.error);
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
        if (lang != 'es' && lang != 'ca' && lang != 'en' && lang != 'de') {
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
                if ((typeof resposta) === 'string') {
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
                    init.areYouSure(jQuery.i18n.prop('msg_alert_1'), jQuery.i18n.prop('msg_acceptar'), function () {});
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
                        init.areYouSure(jQuery.i18n.prop('msg_alert_2'), jQuery.i18n.prop('msg_acceptar'), function () {});
                    } else if (intResp === 3) {
                        init.areYouSure(jQuery.i18n.prop('msg_alert_3'), jQuery.i18n.prop('msg_acceptar'), function () {});
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
       

        mapaUbicacio: function () {
            try {
                console.log('test mapaUbicacio');
                var div = document.getElementById('mapa');
                window.mapa.setDiv(div);
                $.mobile.changePage("#oncapdepera-ubicacio", {transition: "slide"});
            } catch (e) {
                error_('E INCID-316', 'carregaMapa', e);
            }
        },
        puntAlMapa: function (lat, long, text) {
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

    sugerencia: {
        file: 'oncapdepera.class.php',
        enviaSugerencia: function () {
            var formData = new FormData(); //$('#form-sugerencia')[0]
            formData.append('email', document.getElementById("emailSugerencia").value);
            formData.append('sugerencia', document.getElementById("sugerencia").value);
            formData.append('lang', init.lang);
            formData.append('funcio', 'novaSugerenciaOnCap');
            var resp = init.sendAjax(formData, init.sugerencia.file, true);
            if (resp.error == 0) {
                init.areYouSure(jQuery.i18n.prop('msg_sugerencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                init.sugerencia.reset();


            }
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
                    init.areYouSure(jQuery.i18n.prop('msg_sugerencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                    init.sugerencia.reset();
                }
            } catch (e) {
                init.error_('E 416', data, e);
            }
        },
        reset: function () {
            $('#emailSugerencia').val('');
            $('#sugerencia').val('');


        }
    },

    incidencia: {
        file: 'oncapdepera.class.php',
        enviaIncidencia: function () {
            if ($('#assumpteOnCap').val() != '') {
                var imageURI = document.getElementById('imgIncidenciaOnCap').getAttribute("src");
                if (imageURI === 'images/no-img-3.jpg') {
                    var formData = new FormData($('#form-incidenciaOnCap')[0]);
                    formData.append('lang', init.lang);
                    formData.append('funcio', 'novaIncidenciaOnCap');
                    var resp = init.sendAjax(formData, init.incidencia.file, true);
                    if (resp.error == 0) {
                        init.areYouSure(jQuery.i18n.prop('msg_incidencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                        init.incidencia.reset();
                    }
                } else {
                    try {
                        var parametros = {
                            adresaIncidenciaOnCap: document.getElementById("adresaIncidenciaOnCap").value,
                            poblacioIncidenciaOnCap: document.getElementById("poblacioIncidenciaOnCap").value,
                            assumpte: document.getElementById("assumpteOnCap").value,
                            descripcio: document.getElementById("descripcioOnCap").value,
                            longitutIncidenciaOnCap: document.getElementById("longitutIncidenciaOnCap").value,
                            latitutIncidenciaOnCap: document.getElementById("latitutIncidenciaOnCap").value,
                            email: document.getElementById("emailOnCap").value,
                            categoria: document.getElementById("valorCategoria").value,
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
                    init.areYouSure(jQuery.i18n.prop('msg_incidencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                    init.incidencia.reset();
                }
            } catch (e) {
                init.error_('E 416', data, e);
            }
        },
        reset: function () {
            $('#emailOnCap').val('');
            $('#assumpteOnCap').val('');
            $('#descripcioOnCap').val('');
            $('#imgIncidenciaOnCap').attr('src', 'images/no-img-3.jpg');

        },
        getNovaPosicio: function () {
            onMapInit();
        }
    },

    incidenciaDB: {
        file: 'oncapdepera.class.php',
        enviaIncidenciaDB: function () {
//           init.getIp();



            if ($('#assumpteOnCap').val() != '') {
                var imageURI = document.getElementById('imgIncidenciaOnCap').getAttribute("src");
                if (imageURI === 'images/no-img-3.jpg') {
                    var formData = new FormData($('#form-incidenciaOnCap')[0]);
                    formData.append('lang', init.lang);
                    formData.append('funcio', 'novaIncidenciaDB');
//                    formData.append('ip', init.ipA);
                    var resp = init.sendAjax(formData, init.incidenciaDB.file, true);
                    if (resp.error == 0) {
                        init.areYouSure(jQuery.i18n.prop('msg_incidencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                        init.incidencia.reset();
                    }
                } else {
                    try {
                        var parametros = {
                            adresaIncidenciaOnCap: document.getElementById("adresaIncidenciaOnCap").value,
                            poblacioIncidenciaOnCap: document.getElementById("poblacioIncidenciaOnCap").value,
                            assumpte: document.getElementById("assumpteOnCap").value,
                            descripcio: document.getElementById("descripcioOnCap").value,
                            longitutIncidenciaOnCap: document.getElementById("longitutIncidenciaOnCap").value,
                            latitutIncidenciaOnCap: document.getElementById("latitutIncidenciaOnCap").value,
                            email: document.getElementById("emailOnCap").value,
                            nom: document.getElementById("nom").value,
                            llinatges: document.getElementById("llinatges").value,
                            categoria: document.getElementById("valorCategoria").value,
//                            ip: init.ipA,
                            name: 'imgIncidenciaOnCap',
                            funcio: 'novaIncidenciaDB'
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
                    init.areYouSure(jQuery.i18n.prop('msg_incidencia_enviada'), jQuery.i18n.prop('msg_acceptar'), function () {}, 'success');
                    init.incidencia.reset();
                }
            } catch (e) {
                init.error_('E 416', data, e);
            }
        },
        reset: function () {
            $('#emailOnCap').val('');
            $('#assumpteOnCap').val('');
            $('#descripcioOnCap').val('');
            $('#imgIncidenciaOnCap').attr('src', 'images/no-img-3.jpg');

        },
        getNovaPosicio: function () {
            onMapInit();
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
        var ref = window.open(url, '_system', 'location=no');
    },
    radio: {

        status: 0,

        playStop: function () {
            //init.carregaPagExt('http://91.121.156.27:8010/stream');
            try {
                if (init.radio.status == 0) {
                    init.radio.play();
                } else {
                    init.radio.stop();
                }
            } catch (e) {
                console.log('radio no disponible');
            }
        },
        play: function () {
            $('#playStop i').addClass('ico-stop');
            $('#sound').show();
            init.radio.status = 1;
            var mediaElement = document.getElementById("radio_capdepera");
            mediaElement.pause();
            mediaElement.src = "http://91.121.156.27:8010/stream";
            mediaElement.play();
        },
        stop: function () {
            $('#playStop i').removeClass('ico-stop');
            $('#sound').hide();
            init.radio.status = 0;
            var mediaElement = document.getElementById("radio_capdepera");
            mediaElement.pause();
            mediaElement.src = "";
        },
        playBackground: function () {
            var mediaElement = document.getElementById("radio_capdepera");
            mediaElement.play();
        }
    },

    areYouSure: function (text2, button, callback, tipus) {
        if (tipus == 'avis') {
            $('#logo-AreYouSure').attr('src', 'icons/avis2.png');
        } else if (tipus == 'success') {
            $('#logo-AreYouSure').attr('src', 'icons/success2.png');
        } else {
            $('#logo-AreYouSure').attr('src', 'icons/alert2.png');
        }

        $("#sure .sure-2").html(text2);
        $("#sure .sure-do").text(button).on("click.sure", function () {
            $.mobile.back();
            $(this).off("click.sure");
            callback();
            callback = false;
        });

        $.mobile.changePage("#sure");
    },
    htmlEntities: function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    openDeviceBrowser: function (externalLinkToOpen) {
        window.open(externalLinkToOpen, '_system', 'location=no');
    },
    sendEstadistica: function (pagina) {
        var formData = new FormData();
        formData.append('funcio', 'putEstadistica');
        formData.append('lang', init.lang);
        formData.append('pagina', pagina);
        init.sendAjax(formData, 'estadistiques.class.php', false);
    },
    error_: function (codi, json, error) {
        //$.post('', {funcio: 'appError', TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y', codi: codi, json: json, error: error}, function (data) {});
        console.log(codi);
        console.log(json);
        console.log(error);
        init.areYouSure(jQuery.i18n.prop('msg_alert_4'), jQuery.i18n.prop('msg_acceptar'), function () {});
    }
};



//$(document).ready(function(){init.initApp();});
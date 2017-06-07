// JavaScript Document

var init = {

    urlFunctions: 'http://gestcap.com/gestio/App/part-turistica/',
    lang: 'es',

    initApp: function () {
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
                        if($(this).find('.sub-menu').is(":visible")){
                            var that = this;
                            $(this).find('.sub-menu').slideToggle('slow',function(){$(that).removeClass('open');});
                        }else{
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
            /*
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
             $(this).find('.sub-menu').slideToggle('slow');
             });
             init.onCapdepera.menuOk = true;
             }
             }*/
            $.mobile.changePage("#esports-home", {transition: "slide"});
        },
        getFitxa: function (id, tipus) {
            /*var file = init.onCapdepera.file;
             var formData = new FormData();
             formData.append('funcio', 'getFitxa');
             formData.append('tipus', tipus);
             formData.append('id', id);
             formData.append('lang', init.lang);
             var resp = init.sendAjax(formData, file, true);
             if (resp.error == 0) {
             $('#oncpd-html').html(resp.str);
             $.mobile.changePage("#oncapdepera-fitxa", {transition: "slide"});
             }*/
            $.mobile.changePage("#esports-fitxa", {transition: "slide"});
        }
    },
    noticies: {
        menuOk: false,
        file: 'noticies.class.php',
        init: function () {
            init.esports.menu();
        },
        menu: function () {
            /*
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
             $(this).find('.sub-menu').slideToggle('slow');
             });
             init.onCapdepera.menuOk = true;
             }
             }*/
            $.mobile.changePage("#noticies-home", {transition: "slide"});
        },
        getFitxa: function (id, tipus) {
            /*var file = init.onCapdepera.file;
             var formData = new FormData();
             formData.append('funcio', 'getFitxa');
             formData.append('tipus', tipus);
             formData.append('id', id);
             formData.append('lang', init.lang);
             var resp = init.sendAjax(formData, file, true);
             if (resp.error == 0) {
             $('#oncpd-html').html(resp.str);
             $.mobile.changePage("#oncapdepera-fitxa", {transition: "slide"});
             }*/
            $.mobile.changePage("#noticies-fitxa", {transition: "slide"});
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
        init.lang = lang;
    },
    setLiterals: function () {
        var literal = null;
        $('.literal').each(function () {
            literal = $(this).data('literal');
            $(this).text(jQuery.i18n.prop(literal));
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
                
                try {
                    if (resposta.error == 1) {
                        init.error_('E BIT-80', '', resposta.str);
                    } else {
                        json = resposta;
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
        initSession: function(){
            if (init.session.getSession()){
                init.session.motraAmagaLogin(false);
            }else{
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
                    var resposta = JSON.parse(init.sendAjax(formData, '', true));
                    var intResp = parseInt(resposta.error);
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

    carregaPagExt: function (url) {
        var ref = window.open(url, '_system', 'location=yes');
    },
    openRadio: function(){
        init.carregaPagExt('http://tunein.com/radio/Radio-Capdepera-1075-s113101/');
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



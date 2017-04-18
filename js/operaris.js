// JavaScript Document

function carregaLlistaOperari() {
    if (getSession()) {
        //canviam pagina del LOGIN
        $('#form-login').css('display', 'none');
        //MOSTRAM PAGINES OPERARIS
        $('.operaris').addClass('actiu');
        //carregam les incidencies
        carregaLlistaInOperaris();
    }
}


function carregaLlistaInOperaris() {
    try {
        //carregam les incidencies de l'operari
        var xml = '';
        var formData = new FormData();
        formData.append("funcio", "getIncidencies");
        formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
        formData.append("macAddress", window.MACadress);
        formData.append("idU", readCookie('idU'));
        formData.append("idP", readCookie('idP'));


        //#####################     INCIDENCIES CORRESPONENTS AL GRUP       ##########################
        $.ajax({
            url: 'http://gestcap.com/gestio/App/incidencies.php', type: 'POST', data: formData,
            cache: false, contentType: false, processData: false, async: false, dataType: "xml", beforeSend: function () {},
            success: function (data) {
                xml = data;
            },
            error: function (e) {
                alert('E OPER-34: ERROR DE CONEXIÓ AL SERVIDOR');
                error_('E OPER-34', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
            }
        });

        //LES POSAM AL DIV
        var inc = '';
        $(xml).find('incidencia').each(function (index, element) {
            var assignada = ($(this).find('estat').text() == '1') ? 'actiu' : '';
            var tramit = ($(this).find('estat').text() == '2') ? 'actiu' : '';
            var finalitzada = ($(this).find('estat').text() == '3') ? 'actiu' : '';
            inc = inc + '<div class="col-xs-12 incidencia prioritat_' + $(this).find('prioritat').text() + '" data-role="collapsible" data-filtertext="' + $(this).find('titol').text() + '">' +
             '<a class="col-xs-8" href="#veureIncidenciaOperari" onClick="idInc = ' + $(this).find('Id').text() + ';" data-transition="slide" data-role="none" >' +
             '<b>' + getTipusIncidencia($(this).find('tipus').text()) + '</b>' +
             '<p>Incidència creada el ' + $(this).find('fecha').text() + '</p>' +
             '<div class="col-xs-4 assignada estat-inc ' + assignada + ' "><span>Assignada</span></div><div class="col-xs-4 tramit estat-inc ' + tramit + ' "><span>Tràmit</span></div><div class="col-xs-4 finalitzada estat-inc ' + finalitzada + ' "><span>Finalitzada</span></div>' +
             '<div class="col-xs-12"><p class="desc">' + $(this).find('descripcio').text() + '</p></div>' +
             '</a>' +
             '<div class="col-xs-4 img" style="background-image:url(\'http://gestcap.com/gestio/img/incidencies/' + $(this).find('img').text() + '\');"></div>' +
             '</div>';


        });
        $('#collapsiblesetForFilterOperari').html(inc);
        
        

        //#####################     INCIDENCIES PER VERIFICAR       ##########################
        
        
        var verificador = readCookie('verificador');
        if (verificador == 1) {
            var formData_v = new FormData();
            formData_v.append("funcio", "getIncidenciesOperariPerVerificar");
            formData_v.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
            formData_v.append("macAddress", window.MACadress);
            formData_v.append("idU", readCookie('idU'));
            formData_v.append("idP", readCookie('idP'));
            $.ajax({
                url: 'http://gestcap.com/gestio/App/incidencies.php', type: 'POST', data: formData_v,
                cache: false, contentType: false, processData: false, async: false, dataType: "xml", beforeSend: function () {},
                success: function (data) {
                    xml = data;
                },
                error: function (e) {
                    alert('E OPER-76: ERROR DE CONEXIÓ AL SERVIDOR');
                    error_('E OPER-76', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
                }
            });

            //LES POSAM AL DIV
            var inc = '';
            $(xml).find('incidencia').each(function (index, element) {
                inc = inc + '<div class="col-xs-12 incidencia prioritat_' + $(this).find('prioritat').text() + '" data-role="collapsible" data-filtertext="' + $(this).find('titol').text() + '">' +
                 '<a class="col-xs-8" href="#veureIncidencia" onClick="idInc = ' + $(this).find('Id').text() + ';" data-transition="slide" data-role="none" >' +
                 '<b>' + getTipusIncidencia($(this).find('tipus').text()) + '</b>' +
                 '<p>Incidència creada el ' + $(this).find('fecha').text() + '</p>' +
                 '<p>' + $(this).find('titol').text() + '</p>' +
                 '</a>' +
                 '<div class="col-xs-4 img" style="background-image:url(\'http://gestcap.com/gestio/img/incidencies/' + $(this).find('img').text() + '\');"></div>' +
                 '</div>';


            });
            $('#collapsiblesetForFilterOperariPerVerificar').html(inc);
        }

    } catch (e) {
        error_('E OPER-55', 'ERROR LLISTA INCIDENCIES OPERARI', e);
    }
}


function mostraIncidenciaOperari() {
    $('#loading').css('display', 'table');
    $('#incidenciaResolta').prop('checked', false);
    $('#veureIncidenciaOperari .stoggler').removeClass('on');
    $('#veureIncidenciaOperari .stoggler').addClass('off');
    var Incide = window.idInc;
    var xml;
    var formData = new FormData();
    formData.append("funcio", "getIncidenciaOperari");
    formData.append("id", Incide);
    formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
    formData.append("macAddress", window.MACadress);
    formData.append("idU", readCookie('idU'));
    formData.append("idP", readCookie('idP'));

    $.ajax({
        url: 'http://gestcap.com/gestio/App/incidencies.php', type: 'POST', data: formData,
        cache: false, contentType: false, processData: false, async: false, dataType: "xml", beforeSend: function () {},
        success: function (data) {
            xml = data;
        },
        error: function (e) {
            alert('E OPER-83: ERROR DE CONEXIÓ AL SERVIDOR');
            error_('E OPER-83', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
        }
    });


    try {
        var tipus_ = getTipusIncidencia($(xml).find('tipus').text());
        $('#descIncidenciaP2Operari').html($(xml).find('descripcio').text());
        $('#tipusIncidenciaP2Operari').html(tipus_);
        $('#adresaIncidenciaP2Operari').html($(xml).find('adresa').text());
        $('#dataIncidenciaP2Operari').html($(xml).find('fecha').text());
        $('#comentariIncidenciaP2OperariAnteriors').html($(xml).find('text_operaris').text());
        $('#comentariIncidenciaP2Operari').val('');
        $('#verificaIncidencia').data('incidencia',$(xml).find('Id').text());
        //GET IMG 1
        if ($(xml).find('img').text() != '') {
            $('#imgIncidenciaZOperari').attr('src', 'http://gestcap.com/gestio/img/incidencies/' + $(xml).find('img').text());
        } else {
            $('#imgIncidenciaZOperari').attr('src', 'images/no-img-incid.png');
        }

        if (parseInt($(xml).find('estat').text()) > 1) {
            $('#incidenciaResolta').prop('checked', true);
            $('#veureIncidenciaOperari .stoggler').removeClass('off');
            $('#veureIncidenciaOperari .stoggler').addClass('on');
        }

        //$.mobile.changePage( "#veureIncidenciaOperari", { transition: "slide", changeHash: true });
    } catch (e) {
        error_('E OPER-34', 'ERROR MOSTRA INCIDENCIA OPERARI', e);
    }
    $('#loading').css('display', 'none');
}


function enviarActualitzacioIncidencia() {
    //miram si comentari
    if ($('#comentariIncidenciaP2Operari').val() == '') {
        $('#comentariIncidenciaP2Operari').addClass('obligatori');
        return false;
    } else {
        $('#comentariIncidenciaP2Operari').removeClass('obligatori');
        $('#loading').css('display', 'table');
        var formData = new FormData();
        var estat = 1;
        if ($('#incidenciaResolta').is(':checked'))
            estat = 2;
        formData.append("estat", estat);
        formData.append("descIncidenciaOperari", $('#comentariIncidenciaP2Operari').val());
        formData.append("macAddress", window.MACadress);
        formData.append("idU", readCookie('idU'));
        formData.append("idP", readCookie('idP'));
        formData.append("funcio", 'actualitzaIncidenciaOperari');
        formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
        formData.append("idInc", window.idInc);
        $.ajax({
            url: 'http://gestcap.com/gestio/App/incidencies.php', type: 'POST', data: formData,
            cache: false, contentType: false, processData: false, async: false, beforeSend: function () {},
            success: function (data) {
                $('#loading').css('display', 'none');
                try {
                    var resposta = JSON.parse(data);
                    if (resposta.error == '1') {
                        alert('E OPER-146: Ho sentim, hi ha un error. Proviu més tart');
                        error_('E OPER-146', data, resposta.str);
                    } else {
                        alert('Incidencia actualitzada');
                        carregaLlistaInOperaris();
                        window.history.back();
                    }
                } catch (e) {
                    error_('E OPER-153', data, e);
                    alert('E OPER-153: Ho sentim, hi ha un error. Proviu més tart');
                }
            },
            error: function (e) {
                alert('E OPER-159: Ho sentim, hi ha un error. Proviu més tart');
                error_('E OPER-159', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
            }
        });
        $('#loading').css('display', 'none');
    }
}

function refrescaIncidenciesOp() {
    $('#loading').css('display', 'table');
    try {
        carregaLlistaInOperaris();
    } catch (e) {
        alert("E OPER-172: ERROR DE CONEXIÓ AL SERVIDOR");
        error_('E OPER-172', 'ERROR REFRESCA INCIDENCIA OPERARI', e);
    }
    setTimeout("$('#loading').css('display','none')", 1500);
}

function verfificarIncidencia() {
    var incidencia = $('#verificaIncidencia').data('incidencia');

    if (confirm('Segur que vol verificar l\'incidència nº ' + incidencia + '?')) {
        $('#loading').css('display', 'table');
        var formData = new FormData();
        formData.append("incidencia", incidencia);
        formData.append("macAddress", window.MACadress);
        formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
        formData.append("idU", readCookie('idU'));
        formData.append("idP", readCookie('idP'));
        formData.append("funcio", 'verificaIncidencies');

        $.ajax({
            url: 'http://gestcap.com/gestio/App/incidencies.php', type: 'POST', data: formData,
            cache: false, contentType: false, processData: false, async: false, beforeSend: function () {},
            success: function (data) {
                $('#loading').css('display', 'none');
                try {
                    var resposta = JSON.parse(data);
                    if (resposta.error == '1') {
                        alert('E OPER-188: Ho sentim, hi ha un error. Proviu més tart');
                        error_('E OPER-188', data, resposta.str);
                    } else {
                        refrescaIncidencies();
                        refrescaIncidenciesOp();
                        window.history.back();
                    }
                } catch (e) {
                    error_('E OPER-194', data, e);
                    alert('E OPER-194: Ho sentim, hi ha un error. Proviu més tart');
                }
            },
            error: function (e) {
                $('#loading').css('display', 'none');
                alert('E OPER-199: Ho sentim, hi ha un error. Proviu més tart');
                error_('E OPER-200', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
            }
        });
    }
}
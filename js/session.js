/*
 set
 var sId = 'Klaljsdf874jd';
 writeCookie('sessionId', sId, 30);
 get
 var sId = readCookie('sessionId')
 */

function getSession() {
    var cookie = readCookie('sessionId');
    var code = md5(window.MACadress);
    if (cookie == code)
        return true;
    else
        return false;
}

function iniciaSessioInici() {
    if (getSession()) {
        carregaLlistaOperari();
        botoVerificar();
    }
}

function iniciaSessio() {
    var ok = true;
    //comprovam usuari
    if ($('#userLogin').val() == '') {
        $('#userLogin').addClass('obligatori');
        ok = false;
    } else {
        $('#userLogin').removeClass('obligatori');
    }
    //comprovam password
    if ($('#passwordLogin').val() == '') {
        $('#passwordLogin').addClass('obligatori');
        ok = false;
    } else {
        $('#passwordLogin').removeClass('obligatori');
    }

    if (ok) {
        $('#loading').css('display', 'table');
        var formData = new FormData($('#form-login-operari')[0]);
        formData.append("macAddress", window.MACadress);
        formData.append("funcio", 'loginOperari');
        formData.append("TOKEN", 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y');
        $.ajax({
            url: 'http://bitgrup.es/webtest/clickincidencies/App/incidencies.php', type: 'POST', data: formData,
            cache: false, contentType: false, processData: false, async: false, beforeSend: function () {},
            success: function (data) {
                $('#loading').css('display', 'none');
                try {
                    var resposta = JSON.parse(data);
                    if (resposta.error == '1') {
                        alert('E4: Ho sentim, hi ha un error. Proviu més tart');
                        error_('E SESSION-56',data, resposta.str);
                    } else if (resposta.error == '99') {//LOGIN OK
                        window.user = $('#userLogin').val();
                        window.pass = md5($('#passwordLogin').val());
                        writeCookie();
                        carregaLlistaOperari();
                        if (resposta.verificador == 1){
                            localStorage.setItem('verificador', 1 );
                        }else{
                            localStorage.setItem('verificador', 0 );
                        }
                        botoVerificar();
                        $.mobile.changePage("#incidenciesOperaris", {transition: "slide", changeHash: true});
                    } else if (resposta.error == '2') {
                        alert('Aquest dispositiu no està autoritzat');
                    } else if (resposta.error == '3') {
                        alert('Usuari i/o contrasenya incorrecte');
                    }
                } catch (e) {
                    error_('E SESSION-67', data, e);
                    alert('E SESSION-67: Ho sentim, hi ha un error. Proviu més tart');
                }
            },
            error: function (e) {
                alert('E3: Ho sentim, hi ha un error. Proviu més tart');
                error_('E SESSION-73', 'ERROR DE CONEXIÓ AL SERVIDOR', e);
            }
        });
        $('#loading').css('display', 'none');
    }
    return false;
}

function logOutOperari(){
    localStorage.setItem('sessionId', '' );
    localStorage.setItem('idU', '' );
    localStorage.setItem('idP', '' );
    $('.operaris').removeClass('actiu');
    $('#form-login').show();
    localStorage.setItem('verificador', 0 );
    botoVerificar();
}

function writeCookie() {
    //COOKIE SESSION
    var date, expires;
    var days = 30;
    var name = 'sessionId';
    var value = md5(window.MACadress);
    if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    //document.cookie = name + "=" + value + expires + "; path=/";
    localStorage.setItem(name, value );
    //COOKIE USER
    value = window.user;
    name = 'idU';
    //document.cookie = name + "=" + value + expires + "; path=/";
    localStorage.setItem(name, value );
    //COOKIE PASSWORD
    value = window.pass;
    name = 'idP';
    //document.cookie = name + "=" + value + expires + "; path=/";
    localStorage.setItem(name, value );
}

function readCookie(name) {
   /* var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return '';*/
    return localStorage.getItem(name);
}

function botoVerificar(){
    var mostrar = readCookie('verificador');
    if (mostrar == 1){
        $('#botoVeureIncidenciesPerVerificar').show();
        $('#verificaIncidencia').show();
        
    }else{
        $('#botoVeureIncidenciesPerVerificar').hide();
        $('#verificaIncidencia').hide();
    }
}


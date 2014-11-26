/**
 * Plugin de validaÃ§Ã£o para Jquery
 *
 * @author Emanuel Pontes
 * @since 03-05-2012
 * @version 1.0
 * @copyright  Copyright (c) 2011-2012 Evolutiva GestÃ£o e Tecnologia
 *
 * @includes jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 * 			qTip2 Jquery Plguin
 * http://craigsworks.com/projects/qtip2
 *
 */

/**
 * Motor de validaÃ§Ã£o.
 * Valida um ou mais elementos de acordo com as regras determinadas
 * Os elementos a serem validados devem possuir uma classe "isValid[[$rules1($param1,$param2)|$rule2($param1,$param2)]",
 * onde $rules sÃƒÂ£o as regras de validacao e $params sao os parametros para aquela regra.
 * Os parametros deve ser passados entre "()" e separados por ",".
 * Cada "rule" deve ser separada por "|".
 *
 * Se um campo possuir a regra "required" ele serÃ¡ obrigatorio e nÃ£o serÃƒÂ¡ aceito em branco.
 * Campos nÃƒÂ£o requiridos so serÃƒÂ£o validados em outras regras se nÃƒÂ£o estiverm em branco.
 *
 * Se um unico campo for selecionado para a validacao, ele serÃƒÂ¡ considerado com o requirido.
 *
 * Para adicionar regras ou modificalas basca criar um plugin em $.fn.validar.fn.rule = function(el,params), onde
 * el e o elemento puro html, e param sao os parametros passados para a regra na classe de validacao.
 *
 */
$.fn.validar = function(rule, callback) {

    this.erros = {};

    $el = $(this);

    if (!$el.is('input,select')) {
        $el = $el.find('*');
    }

    if (!$el.length)
        return true;

    //montar a lista de elementos e regras de validacao
    var validar = {};

    $el.each(function() {

        if ($(this).is('[class^="isValid"]')) {

            if ($(this).is(':disabled'))
                return;

            var classe = $(this).attr('class');
            var id = $(this).attr('id');
            var ii = classe.lastIndexOf('isValid[') + 8;
            var iz = classe.indexOf(']');
            var rules = classe.substring(ii, iz).split('|');
            var r = {};
            for (var i in rules) {
                var t = rules[i].split('(');
                for (n in t)
                    t[n] = t[n].replace(')', '');
                var rule = t.shift();
                r[rule] = t;
            }
            validar[id] = {'rules': r, el: this};
        }
    });


    //se somente um elemento for selecionado para validar, entao ele serÃƒÂ¡ requirido
    if (typeof(rule) === 'boolean') {
        if (rule) {
            for (var i in validar) {
                validar[i].rules.required = [];
            }
        }
    }

    if (typeof(rule) !== 'function') {//validacao customizada

        for (var i in validar) {

            //So irÃƒÂ¡ executar as outras validaÃƒÂ§oes de o campo for requirido ou nÃƒÂ£o for vazio
            var requirido = !(validar[i].rules.required == undefined);
            if (requirido) {
                var v = $.fn.validar.fn.required(validar[i].el, validar[i].rules.required.join(','), rule);
                if (v !== true) {
                    validar[i].rules = {required: validar[i].rules.required};
                }
            }
            //se for requirodo ou nao vazio entao valida demais regras
            for (var r in validar[i].rules) {
                var func = r;
                var p = validar[i].rules[r].join(',');

                if (typeof($.fn.validar.fn[func]) == 'function') {
                    var erro = $.fn.validar.fn[func](validar[i].el, p.toString(), rule);//executa funcao de validacao para cada regra
                    if (erro !== true) {
                        if (validar[i]['erros'] == undefined)
                            validar[i]['erros'] = new Array();
                        validar[i]['erros'].push(erro);
                    }
                }
            }
        }
    } else if (typeof(rule) === 'function') {

        var erro = rule();
        if (erro !== true && erro !== undefined) {
            for (var i in validar) {
                if (validar[i]['erros'] == undefined)
                    validar[i]['erros'] = new Array();
                validar[i]['erros'].push(erro);
            }
        }
    }


    //mostrar erro no elemento (tips)
    $('.valid_err').qtip('destroy');
    $('.valid_err').removeClass('valid_err');
    for (var i in validar) {
        if ($(validar[i].el).is('input[type=hidden]'))
            continue;
        if ($(validar[i].el).is(':disabled'))
            continue;
        if ($(validar[i].el).is('[readonly=readonly]'))
            continue;
        if (validar[i].erros != undefined) {

            this.erros[i] = validar[i].erros;

            //case exista callback nao mostrar erros
            if (callback)
                continue;

            var e = validar[i].erros.join('<br/>');
            $.fn.validar.qtip_config.content = e;

            if ($(validar[i].el).is('[type="radio"]')) {
                id = $(validar[i].el).attr('id');
                $('label[for="' + id + '"]').qtip($.fn.validar.qtip_config);
                $('label[for="' + id + '"]').addClass('valid_err');
            } else {
                $(validar[i].el).qtip($.fn.validar.qtip_config);
                $(validar[i].el).addClass('valid_err');
            }
        }
    }

    //mostrar erros em ui-tabs
    $('.ui_erros_tabs').remove();
    $('div.ui-tabs-panel').each(function(i, e) {
        var h = $('a[href="#' + this.id + '"]');
        var erros = $(this).find('.valid_err').length;
        if (erros)
            h.parent().append('<span class="ui_erros_tabs">' + erros);
    });

    setTimeout("$('.valid_err:visible').qtip('show')", 0);
    setTimeout("$('.valid_err').qtip('hide')", 2000);

    //contar erros
    var erro_count = 0;
    for (var i in validar) {
        if (validar[i].erros == undefined)
            continue;
        erro_count += validar[i].erros.length;
    }

    if (erro_count > 0 && callback) {
        callback(this.erros);
    }

    return !erro_count > 0;

    function log(el) {
        console.log(el);
    }

};

$.fn.validar.mostrarErros = function(obj) {

    $('.valid_err').qtip('destroy');
    $('.valid_err').removeClass('valid_err');

    for (var i in obj) {
        var el = $('#' + i);

        if (el == undefined)
            continue;
        //if(el.val()==undefined)continue;

        var e = obj[i];

        try {
            e = e.join('<br>');
        } catch (e) {
            e.toString();
        }

        $.fn.validar.qtip_config.content = e;
        if (el.is('[type="radio"]')) {
            id = $(el).attr('id');
            $('label[for="' + id + '"]').qtip($.fn.validar.qtip_config);
            $('label[for="' + id + '"]').addClass('valid_err');
        } else {
            el.qtip($.fn.validar.qtip_config);
            el.addClass('valid_err');
        }
    }

    //mostrar erros em ui-tabs
    $('.ui_erros_tabs').remove();
    $('div.ui-tabs-panel').each(function(i, e) {
        var h = $('a[href="#' + this.id + '"]');
        var erros = $(this).find('.valid_err').length;
        if (erros)
            h.parent().append('<span class="ui_erros_tabs">' + erros);
    });

    setTimeout("$('.valid_err:visible').qtip('show')", 0);
    setTimeout("$('.valid_err').qtip('hide')", 2000);

};

$.fn.validar.limparErros = function() {
    $('.valid_err').qtip('destroy');
    $('.ui_erros_tabs').remove();
    $('.valid_err').removeClass('valid_err');
};

/**
 * Configuracao padrao dos tips
 */
$.fn.validar.qtip_config = {
    content: '',
    position: {
        my: 'bottom left',
        at: 'top left'
    },
    viewport: $(window),
    style: {
        classes: 'doubleborder'
    }
};

/**
 * Mensagens de erro
 */
$.fn.validar.valid_msg = {
    
    required: 'Campo obrigat&oacute;rio',
    integer: 'Digite um n&uacute;mero inteiro',
    numero: 'Digite um n&uacute;mero',
    maxint: 'Este n&uacute;mero deve ser menor que ?',
    minint: 'Este n&uacute;mero deve ser maior que ?',
    letter: 'Digite somente letras de "?" a "!"',
    letterspace: 'Digite somente letras de "?" a "!" ou ESPA&Ccedil;OS',
    alphanum: 'Digite somente valores alfa-n&uacute;mericos',
    minlength: 'Digite no m&iacute;nimo "?" caracteres',
    maxlength: 'Digite no m&aacute;ximo "?" caracteres',
    justlength: 'Digite exatamente "?" caracteres',
    listenum: 'Valor inv&aacute;lido',
    email: 'Email inv&aacute;lido',
    data: 'Data inv&aacute;lida',
    url: 'URL inv&aacute;lida',
    past: 'A data deve ser inferior a ?',
    future: 'A data deve ser superior a ?',
    cpf: 'CPF inv&aacute;lido',
    hora:'Hora Invalida!',
    campoIgual:'Campo Hora Inicial não Pode ser Igual Campo Hora Final',
};


$.fn.validar.fn = {};


//Validadores

$.fn.validar.fn.required = function(el, params, rule) {
    if (params.indexOf(rule) !== -1)
        return true;
    //se for radio e nao estiver selecionado
    if ($(el).is('[type="radio"]')) {
        if ($(el).attr('checked') != undefined)
            return true;
        return $.fn.validar.valid_msg.required;
    }
    if ($(el).val())
        return true;
    return $.fn.validar.valid_msg.required;
};

$.fn.validar.fn.integer = function(el, params) {
    var valor = $(el).val();

    if (parseInt(valor) != 0)
        if ((valor % (parseInt(valor) / Number(valor)) !== 0)) {
            if (valor.length > 0)
                return $.fn.validar.valid_msg.integer;
        }
    return true;
};

/**
 * Validar se o elemento numero e um numero
 *
 * @param Object obj Elemento a ser validado
 * @method private numero
 * @return void
 */
$.fn.validar.fn.numero = function(obj) {
    var valor = $(obj).val();

    if (isNaN(Number(valor))) {
        if (($(obj).val().length > 0))
            return $.fn.validar.valid_msg.numero;
    }
    return true;
};

//Validar o elemento hora
$.fn.validar.fn.hora = function(obj){
    
    var valorH = $(obj).val().substring(0,2);
    var valorM = $(obj).val().substring(3,5);
    
    if(isNaN(Number(valorH)) && isNaN(Number(valorM))){
        return $.fn.validar.valid_msg.hora;
    }else{
        if((valorH < 00 || valorH > 23) && (valorM < 00 || valorM > 60)){
            return $.fn.validar.valid_msg.hora;
        }
    }
    
    return true;
};

/**
 * Validar se o elemento contem somente letras
 *
 * @param Object obj Elemento a ser validado
 * @method private letter
 * @return void
 */

$.fn.validar.fn.letter = function(obj) {
    var regex = /^[a-zA-ZÃƒÂ§Ãƒâ€¡ÃƒÂ©ÃƒÂºÃƒÂ­ÃƒÂ³ÃƒÂ¡Ãƒâ€°ÃƒÅ¡Ãƒï¿½Ãƒâ€œÃƒï¿½ÃƒÂ¨ÃƒÂ¹ÃƒÂ¬ÃƒÂ²ÃƒÂ ÃƒË†Ãƒâ„¢ÃƒÅ’Ãƒâ€™Ãƒâ‚¬ÃƒÂµÃƒÂ£Ãƒâ€¢ÃƒÆ’ÃƒÂªÃƒÂ»ÃƒÂ®ÃƒÂ´ÃƒÂ¢ÃƒÅ Ãƒâ€ºÃƒÅ½Ãƒâ€Ãƒâ€š]+$/gi;
    // /^[a-zA-ZÃƒÂ§Ãƒâ€¡ÃƒÂ©ÃƒÂºÃƒÂ­ÃƒÂ³ÃƒÂ¡Ãƒâ€°ÃƒÅ¡Ãƒï¿½Ãƒâ€œÃƒï¿½ÃƒÂ¨ÃƒÂ¹ÃƒÂ¬ÃƒÂ²ÃƒÂ ÃƒË†Ãƒâ„¢ÃƒÅ’Ãƒâ€™Ãƒâ‚¬ÃƒÂµÃƒÂ£Ãƒâ€¢ÃƒÆ’ÃƒÂªÃƒÂ»ÃƒÂ®ÃƒÂ´ÃƒÂ¢ÃƒÅ Ãƒâ€ºÃƒÅ½Ãƒâ€Ãƒâ€š]+$/
    // /^[a-z]+$/gi
    if (regex.exec($(obj).val()) == null) {
        if (($(obj).val().length > 0))
            'Digite somente letras de "?" a "!"';
        return($.fn.validar.valid_msg.letter.replace('?', 'A').replace('!', 'Z'));
    }
    return true;
};

/**
 * Validar se o elemento contem somente letras e espaco
 *
 * @param Object obj Elemento a ser validado
 * @method private letterspace
 * @return void
 */
$.fn.validar.fn.letterspace = function(obj) {
    var regex = /^[a-zA-ZÃƒÂ§Ãƒâ€¡ÃƒÂ©ÃƒÂºÃƒÂ­ÃƒÂ³ÃƒÂ¡Ãƒâ€°ÃƒÅ¡Ãƒï¿½Ãƒâ€œÃƒï¿½ÃƒÂ¨ÃƒÂ¹ÃƒÂ¬ÃƒÂ²ÃƒÂ ÃƒË†Ãƒâ„¢ÃƒÅ’Ãƒâ€™Ãƒâ‚¬ÃƒÂµÃƒÂ£Ãƒâ€¢ÃƒÆ’ÃƒÂªÃƒÂ»ÃƒÂ®ÃƒÂ´ÃƒÂ¢ÃƒÅ Ãƒâ€ºÃƒÅ½Ãƒâ€Ãƒâ€š\s]+$/gi;
    if (regex.exec($(obj).val()) == null) {
        if (($(obj).val().length > 0))
            return($.fn.validar.valid_msg.letterspace.replace('?', 'A').replace('!', 'Z'));
    }
    return true;
};

/**
 * Validar se o elemento contem somente caracteres alfa-nmericos
 *
 * @param Object obj Elemento a ser validado
 * @method private alphanum
 * @return void
 */

$.fn.validar.fn.alphanum = function(obj) {
    var regex = /^[0-9a-zA-ZÃƒÂ§Ãƒâ€¡ÃƒÂ©ÃƒÂºÃƒÂ­ÃƒÂ³ÃƒÂ¡Ãƒâ€°ÃƒÅ¡Ãƒï¿½Ãƒâ€œÃƒï¿½ÃƒÂ¨ÃƒÂ¹ÃƒÂ¬ÃƒÂ²ÃƒÂ ÃƒË†Ãƒâ„¢ÃƒÅ’Ãƒâ€™Ãƒâ‚¬ÃƒÂµÃƒÂ£Ãƒâ€¢ÃƒÆ’ÃƒÂªÃƒÂ»ÃƒÂ®ÃƒÂ´ÃƒÂ¢ÃƒÅ Ãƒâ€ºÃƒÅ½Ãƒâ€Ãƒâ€š_\s]+$/gi;
    //var regex = /^[a-z0-9_\s]+$/gi;
    if (regex.exec($(obj).val()) == null) {
        if (($(obj).val().length > 0))
            return $.fn.validar.valid_msg.alphanum;
    }
    return true;
};

/**
 * Validar se o elemento e um email
 *
 * @param Object obj Elemento a ser validado
 * @method private email
 * @return void
 */
$.fn.validar.fn.email = function(obj) {
    var regex = /^[\w-]+(\.[\w-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])$/g;
    if (regex.exec($(obj).val()) == null) {
        if (($(obj).val().length > 0))
            return($.fn.validar.valid_msg.email);
    }
    return true;
};

/**
 * Valida data no formato DD/MM/YYYY ou DD-MM-YYYY
 *
 * @param Object obj Elemento a ser validado
 * @method private data
 * @return Bool
 */
$.fn.validar.fn.data = function(obj) {
    var data = $(obj).val();
    if (data.indexOf('-') != -1)
        data = data.replace(/-/g, '/');

    var regex = /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/\d{4}$/g;
    if (regex.exec(data) == null) {
        if (($(obj).val().length > 0)) {
            return($.fn.validar.valid_msg.data);
        }
    }
    return true;
};

/**
 * Valida url se e uma url valida
 *
 * @param Object obj Elemento a ser validado
 * @method private url
 * @return Bool
 */
$.fn.validar.fn.url = function(obj) {
    var url = $(obj).val();

    var regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (regex.exec(url) == null) {
        if (($(obj).val().length > 0)) {
            return ($.fn.validar.valid_msg.url);
        }
    }
    return true;
};

/**
 * Valida se a data, no formato DD/MM/YYYY ou DD-MM-YYYY, esta no passado
 *
 * @param Object obj Elemento a ser validado
 * @param String interval data
 * @method private past
 * @return void
 */
$.fn.validar.fn.past = function(obj, interval) {

    if (obj.value) { // se for uma data
        var dia;
        var mes;
        var ano;

        if (interval == undefined) {
            tmpData = new Date(); // a data deve preceder a informada, caso nao informada pegar a data local

            dia = tmpData.getDate().toString();
            if (dia.length < 2)
                dia = '0' + dia;
            mes = (tmpData.getMonth() + 1).toString();
            if (mes.length < 2)
                mes = '0' + mes;
            ano = tmpData.getFullYear();
        }
        else {
            var tmpData = interval;
            if (tmpData.indexOf('-') != -1)
                tmpData = tmpData.replace(/-/g, '/');
            tmpData = tmpData.split('/');

            dia = tmpData[0];
            mes = tmpData[1];
            ano = tmpData[2];
        }

        var dataInformada = obj.value;
        if (dataInformada.indexOf('-') != -1)
            dataInformada = dataInformada.replace(/-/g, '/');

        dataInformada = dataInformada.split('/');
        dataInformada = parseInt(dataInformada[2] + '' + dataInformada[1] + '' + dataInformada[0]);

        if (isNaN(dataInformada) || dataInformada >= parseInt(ano + '' + mes + '' + dia)) {
            return $.fn.validar.valid_msg.past.replace('?', (dia + '/' + mes + '/' + ano));
        }
    }
    return true;
};

/**
 * Valida se a data, no formato DD/MM/YYYY ou DD-MM-YYYY, esta no futuro
 *
 * @param Object obj Elemento a ser validado
 * @param String interval data
 * @method private future
 * @return void
 */
$.fn.validar.fn.future = function(obj, interval) {
    true;
};


/**
 * Validar se o cpf enviado por parametro e um CPF valido
 *
 * @param Integer cpf Elemento a ser validado
 * @method private cpfIsvalid
 * @return Bool
 */
$.fn.validar.fn.cpfIsvalid = function(cpf) {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }

    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
    else
        return false;
};


/**
 * Validar se o elemento e um CPF valido
 *
 * @param Object obj Elemento a ser validado
 * @method private cpf
 * @return void
 */
$.fn.validar.fn.cpf = function(obj) {
    var cpf = $(obj).val();
    // se houver mascara remove
    if (cpf.indexOf('.') != -1) {
        cpf = cpf.replace(/\./g, '');
        cpf = cpf.replace('-', '');
    }
    // se o tamanho de cpf for menor que onze add zeros a esquerda
    if (cpf.length < 11) {
        var tamanho = cpf.length;
        for (var i = 0; i < (11 - tamanho); i++) // 0 < 2
            cpf = '0' + cpf;
    }

    var regex = /(\d{3})(\d{3})(\d{3})(\d{2})$/g;
    if (regex.exec(cpf) == null || !$.fn.validar.fn.cpfIsvalid(cpf)) {
        if (($(obj).val().length > 0))
            return $.fn.validar.valid_msg.cpf;
    }
    return true;
};


/**
 * Validar se o valor do elemento nao ultrapassa o definido em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Valor que nao deve ser ultrapassado
 * @method private maxint
 * @return void
 */
$.fn.validar.fn.maxint = function(obj, interval) {
    var valor = $(obj).val();

    if ($.isNumeric(valor)) {
        if (Number(valor) >= Number(interval)) {
            if ((valor.length > 0))
                return($.fn.validar.valid_msg.maxint.replace('?', interval));
        }
    }
    else {
        if ((valor.length > 0))
            return($.fn.validar.valid_msg.maxint.replace('?', interval));
    }
    return true;
};

/**
 * Validar se o valor do elemento nao e menor que o definido em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Valor padrao de parametro
 * @method private minint
 * @return void
 */
$.fn.validar.fn.minint = function(obj, interval) {
    var valor = $(obj).val();

    if ($.isNumeric(valor)) {
        if (parseInt(valor) <= parseInt(interval)) {
            if ((valor.length > 0))
                return($.fn.validar.valid_msg.minint.replace('?', interval));
        }
    }
    else {
        if ((valor.length > 0))
            return($.fn.validar.valid_msg.maxint.replace('?', interval));
    }
    return true;
};

/**
 * Validar se a quantidade de caracteres em obj nao e menor que o definido em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Valor padrao de parametro
 * @method private minlength
 * @return void
 */
$.fn.validar.fn.minlength = function(obj, interval) {
    if ($(obj).val().length < parseInt(interval)) {
        if (($(obj).val().length > 0))
            return($.fn.validar.valid_msg.minlength.replace('?', interval));
    }
    return true;
};

/**
 * Validar se a quantidade de caracteres em obj nao e maior que o definido em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Valor padrao de parametro
 * @method private maxlength
 * @return void
 */
$.fn.validar.fn.maxlength = function(obj, interval) {
    if ($(obj).val().length > parseInt(interval)) {
        if (($(obj).val().length > 0))
            return($.fn.validar.valid_msg.maxlength.replace('?', interval));
    }
    return true;
};

/**
 * Validar se a quantidade de caracteres em obj e exatamente igual a que o definido em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Valor padrao de parametro
 * @method private justlength
 * @return void
 */
$.fn.validar.fn.justlength = function(obj, interval) {

    if ($(obj).val().length != interval) {
        return($.fn.validar.valid_msg.justlength.replace('?', interval));
    }
    return true;
};

/**
 * Validar se o valor de obj esta contido na lista passada em interval
 *
 * @param Object obj Elemento a ser validado
 * @param Integer interval Lista de valores default
 * @method private listEnum
 * @return void
 */
$.fn.validar.fn.listEnum = function(obj, interval) {
    params = interval;
    if (interval.indexOf(',') != -1)
        params = interval.split(',').join('//');


    params = params.replace(/\'/gi, '').split('//');

    if (($(obj).val().length > 0)) {
        if (!in_array($(obj).val(), params))
            return($.fn.validar.valid_msg.listenum);
    }
    return true;
};

/**
 * Verificar se o valor de needle existe no array haystack
 *
 * @param String needle Valor a ser verificado a existencia em haystack
 * @param Array haystack Array com lista de valores defaults
 * @method private in_array
 * @return Bool
 */
$.fn.validar.fn.in_array = function(needle, haystack) {
    for (key in haystack) {
        if (haystack[key].toString() == needle.toString())
            return true;
    }
    return false;
};




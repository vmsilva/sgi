/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Verificar se o valor de needle existe no array haystack
 *
 * @param String needle Valor a ser verificado a existencia em haystack
 * @param Array haystack Array com lista de valores defaults
 * @method private in_array
 * @return Bool
 */
function in_array (needle, haystack) {
    for (key in haystack) {
        if (haystack[key].toString() == needle.toString())
            return true;
    }

    return false;
}

/*
 * Carrega html da url dentro de uma div
 * Chama dialog ui e configura a div para aparecer uma janela
 * @url url
 * @params params para serem enviados
 */

function abrirController(url,params,titulo){

    if(url.length != 9){
        alert('Url informada não é válida');
        return;
    }


    $( ".menuSuperior > ul" ).hide();
    titulo = titulo+' ('+url.substr(0, 3)+'/'+url.substr(4, 5)+')';
    url = url.substr(0, 3)+ '/view/' + url.substr(0, 3) + '_f' + url.substr(5, 4) + '.php';

    /**
     * Minimiza a janela
     * @param id Id da div da janela
     */
    function createButtonMinimize(id){

        $('#'+id).dialog('option','dialogClass','dialog-'+id)

        $('.dialog-'+id+' div.ui-dialog-titlebar')
        .append('<a role="button" title="Minimizar Janela" onclick=minimizarJanela(\''+id+'\') onmouseout="$(this).removeClass(\'ui-state-hover\')" onmouseover="$(this).addClass(\'ui-state-hover\')" class="ui-dialog-titlebar-minimize ui-corner-all" href="#" style="position: absolute;"><span class="ui-icon ui-icon-minus">close</span></a>')
    }

    /** Adiciona um botao referente a jenela na barra de tarefas
     * @param id Id da Janela
     */
    function addButtonOnTaskBar(id){
        
        $('#task-bar span.btn').removeClass('btn-primary');

        var title = titulo;

        var botao = $('<span class="btn btn-primary for-'+id+'" onclick=\'mostrarJanela("'+id+'")\'></span>');
        botao.append('<i class="icon-formulario"></i>');
        botao.append('<span class="label">'+title+'</span>');

        var botaoFechar = $('<span class="fechar"><i class="icon-close"></i></span>');

        botaoFechar.click(function(){
            botao.remove();
            fecharJanela(id);

        });

        botao.append(botaoFechar);

        $('#task-bar').append(botao);
    }

    /**Monta a janela
     *@param id Id da Janela */
    function construirJanela(id){

        /** Opçoes do jquery dialog UI*/
        var dialogOptions = {

            width:'auto',
            height:'auto',
            top:70,
            animation:'',
            position:['center',70],
            resizable:false,
            title:titulo,
            focus:function(){
                  
                try {
                /* executa quando a janela ganha o focus*/
                /** Desmarca status dos botoes da barra de tareras */
                $('#task-bar span.btn').removeClass('btn-primary');
                /** Marca o botao referente a janela na barra de tarefas */
                $('.for-'+this.id).addClass('btn-primary');
                /** Desmarca a ultima janela ativa */
                $('.janela-ativa').removeClass('janela-ativa');
                /** Marca como ativa a atual janela */
                $(this).dialog('widget').find('div.ui-dialog-titlebar').addClass('janela-ativa');
                }catch (erro){
                    console.log(erro);
                }

            },
            close:function(){

                /** Executa quando a janela fecha */

                /** Flag: diz quando � pra minimizar ou fechar */
                var tipoEvento = $('#'+id).data('event');

                /** se fechar entao destroi a janela */
                if(tipoEvento !== 'minimize'){
                    fecharJanela(id);
                    $('.for-'+id).remove();
                }
                /** reseta o flag */
                $('#'+id).data('event',null);

                /* Executa uma animação ao fechar a janela
                 * @see Jquery ui efetcs transfer */
                $('#'+id).dialog('widget').effect("transfer", {

                    to: ".for-"+id,
                    className: "ui-effects-transfer"

                }, 500);

            },
            create:function(){
                /** Exectua quando a janela � criada */

                /*Cria botao minimiar na barra titulo da janela */
                createButtonMinimize(id);
                /* Cria botao na barra tarefa */
                addButtonOnTaskBar(id);
                /* Torna janela transparente quando arrastada */
                $('#'+id).dialog('widget').draggable('option','opacity',0.4);
                /* Permite que a janela seja arastra para alem da area visivel da window */
                $('#'+id).dialog('widget').draggable( "option", "containment", [-2000,0,2000,2000] );
                
                //workaround - janela ativa
                $('#'+id).dialog('widget').click(function(){
                 // reset todas janelas ativas
                   $('.janela-ativa').removeClass('janela-ativa');
                /** Marca como ativa a atual janela */
                    $(this).find('div.ui-dialog-titlebar').addClass('janela-ativa');
                });
            },
            dragStart:function(){

                /* Executa quando a janela � arastrada */

                /** Remove scroll do body quando janela
                  arrastrada para alem do tamanho visivel */
                $('body').css({
                    overflow:'hidden'
                });
            }

        }
        //Cria a janela e seta as op��es
        $('#'+id).dialog(dialogOptions);
    }

    /** Carrega conteudo html da url via ajax*/
    function runAjax(){

        $.post(url,params,function(html){

            /** Pega id da janela */
            var id = $(html).attr('id');

            /* Se a janela j� existir ent�o a mesma ser� mostrada */
            if($('#'+id).val() !== undefined){
                
                $('#'+id).dialog('open');
                $('#'+id).dialog('moveToTop');

                return;
            }
            /** Faz o append do body */
            $('body').append(html);
            /** Cria a janela */
            construirJanela(id)
        })
    }

    runAjax();
}

/** Torna uma janela visivel
 * @paraam id Id da Janela
 */
function mostrarJanela (id){
    $('#'+id).dialog('open');
    $('#'+id).dialog('moveToTop');
    $(this).addClass('btn-primary');

    $('.for-'+id).effect("transfer", {
        to: "#"+id,
        className: "ui-effects-transfer"

    }, 500);
}

/***
 * Minimiza um janela
 * @param id Id da janela
 */
function minimizarJanela(id){
    $('#'+id).data('event','minimize')
    $('#'+id).dialog('close');
}

/** Fecha um janel
 * O conteudo e destrudo
 * @param id ID da janela
 **/
function fecharJanela(id){
    $('#'+id).dialog('destroy');
    $('#'+id).remove();
}

window.msg_aux = new Mensagens;
msg = window.msg_aux;

function Mensagens() {

    var timeOutId = null;

    function limpar() {

        if (timeOutId)
            clearTimeout(timeOutId);
        var $msg = $('.message');
        $msg.removeClass('message-sucess');
        $msg.removeClass('message-error');
        $msg.find('.message-content').html(null);
        $msg.hide();
    }
    
    this.limparMensagem = function(){
        limpar();
    }

    this.alertErro = function(texto) {
        limpar();
        var $msg = $('.message');
        $msg.addClass('message-error').removeClass('message-sucess');
        if (!$msg.is(':visible'))
            $msg.fadeIn();
        $msg.find('.message-content').html(texto);
        timeOutId = setTimeout('$(".message").fadeOut("slow")', 1000 * 6);
        $('.message-top-close').click(function() {
            $(this).parent().fadeOut();
        });
        return this;
    };

    this.alertSucesso = function(texto) {
        limpar();
        var $msg = $('.message');
        $msg.addClass('message-sucess').removeClass('message-error');
        if (!$msg.is(':visible'))
            $msg.fadeIn();
        $msg.find('.message-content').html(texto);
        timeOutId = setTimeout('$(".message").fadeOut("slow")', 1000 * 6);
        $('.message-top-close').click(function() {
            $(this).parent().fadeOut();
        });
        return this;

    };
}


function Formulario(){
    
    var self = this;

    this.requisicaoAjax = function(url, params, form, callback){

        if(url.length == '9'){
            var form = form.toLowerCase();
            url = url.substr(0, 3)+'/controll/'+url+'.php';
            $.ajaxSetup({
                async:false
            })
            $.post(url.toLowerCase(), params, function(ret){
                if(ret.ret == 'false'){
                    if(ret.mostra == 'true'){
                        msg.alertErro(ret.msg);
                    }
                    if(callback){
                        callback(false)
                    }
                    return false;
                }else{
                    if(ret.mostra == 'true'){
                        msg.alertSucesso(ret.msg);
                    }
                    self.preencheDadosFormulario(ret.dados, form);
                    if(callback){
                        callback(true)
                    }
                    return ret.dados;
                }
            },'json');
        }else{
            msg.alertErro('Url informada fora do padrão do Sistema!');
            return false;
        }
    }

    this.requisicaoAjaxRetornaValores = function(url, params, form, callback){

        if(url.length == '9'){
            var form = form.toLowerCase();
            url = url.substr(0, 3)+'/controll/'+url+'.php';
            $.ajaxSetup({
                async:false
            })
            $.post(url.toLowerCase(), params, function(ret){
                if(ret.ret == 'false'){
                    if(ret.mostra == 'true'){
                        msg.alertErro(ret.msg);
                    }
                    if(callback){
                        callback(false)
                    }
                    return false;
                }else{
                    if(ret.mostra == 'true'){
                        msg.alertSucesso(ret.msg);
                    }
                    if(callback){
                        callback(ret.dados)
                    }
                }
            },'json');
        }else{
            msg.alertErro('Url informada fora do padrão do Sistema!');
            return false;
        }
    }

    this.requisicaoDivModal = function(url, callback, params){

        if(url.length == '9'){
            url = url.substr(0, 3)+'/controll/'+url+'.php';
        
            $.post(url,params,function(html){

                //id unico para modal
                var id = 'id-modal-'+Math.floor(Math.random()*10000);

                /* Chamar o dialog */
                var $div = $('<div class="div-modal"></div>').html(html);
                $div.attr('id',id);

                this.configEventos = function(){
     
                    $("#"+id+' div.grid_corpo  table').trigger("update");

                    $("#"+id).find('table tbody tr').click(function(){

                        var data = $(this).data('data');
                        //chama funcao callback
                        if(callback ){
                            callback (data);
                            $('#'+id).dialog('destroy');
                        }
                    });
                }

                var _this = this;

                $.ajaxSetup({
                    async:false
                });

                /* Opções default */
                var defaultOptions = {
                    modal: true,
                    title: 'Envolverti',
                    resizable: false,
                    width: 'auto',
                    height: 'auto',
                    zIndex: 9999,
                    position: ['center', 100],
                    close:function(){
                        try{
                            $(this).dialog('destroy');
                        }catch(error){}
                    },
                    open: function(event, ui){
                        _this.configEventos();
                        $div.find('.divfiltrar input').keyup(function(){
                            $.ajaxSetup({
                                async:true
                            });

                            $.post(url,{
                                filtro: params,
                                texto: this.value,
                                'opr' : params.opr,
                                'url' : params.url,
                                'nm_campo_busca':params.nm_campo_busca
                            },function(tabela){

                                $div.find('table tbody').replaceWith($(tabela).find('table tbody'));

                                _this.configEventos();
                                $.ajaxSetup({
                                    async:false
                                });
                            })

                        });
                    }
                }

                $div.dialog(defaultOptions);
            })
        }else{
            msg.alertErro('Url informada fora do padrão do Sistema!');
            return false;
        }
    }

    this.prencheTabelaGrid = function(url, params, form){
    
        if(url.length == '9'){
            var form = form.toLowerCase();
            url = url.substr(0, 3)+'/controll/'+url+'.php';
            $.ajaxSetup({
                async:false
            })
            $.post(url,params,function(html){
                $('#'+params.form+'-tbl_result')
                .html(html)
                .tablesorter();
                $.ajaxSetup({
                    async:true
                })
            });
        }
    }

    var jsx = null;
    this.prencheTabelaGridNoAsync = function(url, params, form, pegaPaciente){
        if(url.length == '9'){
            var form = form.toLowerCase();
            url = url.substr(0, 3)+'/controll/'+url+'.php';
            $.ajaxSetup({
                async:true
            })
            if(jsx != null)jsx.abort();
            jsx = $.post(url,params,function(html){
                $('#'+params.form+'-tbl_result')
                .html(html)
                .find('table tbody.grid_corpo tr')
                .click(function(){
                    if(pegaPaciente)pegaPaciente($(this).data('data'));
                })
                .tablesorter();
                $.ajaxSetup({
                    async:false
                });
            });
            
        }
    }

    this.preencheDadosFormulario = function(dados, form){
        if(dados != ''){
            for(var i in dados){
                $('#'+form+'-'+i).val(dados[i]);
            }
        }
    }
}


$.fn.tamanhocolunatabela = function(){
    
    /** get width each colum of tbody */

    var $tbody = $(this).find('.grid_corpo');
    var $thead = $(this).find('.grid_cabecalho');

    $thead.find('tr').css({
        'white-space': 'nowrap'
    });
    $tbody.find('tbody tr').css({
        'white-space': 'nowrap'
    });
    var w = [];

    $tbody.find('tr:first-child td').each(function(i, e) {
        w.push($(this).width());
    });
   
    $tbody.find('tr').each(function() {
        $cels = $(this).find('td');
        $cels.each(function(i, e) {
            $(this).css({
                display:'inline-block',
                width: w[i]
            });
        });
    });

    /** seta o width de cada td do head */
    $thead.find('tr th').each(function(i, e) {
        $(this).css({
            display:'inline-block',
            width: w[i]
        });
    });
}


window.setInterval(function(){

    var target = $('.selecionavel:not(.has_selectable)');

    if(!target.length)return;

    var tables = target.find('table');
    tables.each(function(){
        if(!$(this).find('tr > td').length){
            return;
        }
        $(this).find('tbody tr').each(function(){
            if($(this).hasClass('has_selectable')) return;
            $(this).addClass('has_selectable');

            $(this).live('click',
                function(){
                    if($(this).hasClass('selecionado')){
                        $(this).removeClass('selecionado');
                        return;
                    }
                    $('.selecionado').removeClass('selecionado');
                    $(this).addClass('selecionado');
                }
            );
        });
    });

},1000);

$(function(){
    /* Quando houver digitação em componentes com a classe "number" */
    $(".number").keydown(function(event){
    /* Testar as teclas não numérica */
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)){
            return;
        }else{
            /* Testar acionamento de outras teclas */
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )){
                event.preventDefault();
            }
        }
    });
});

function impressao(content) {
    var ifrm = $('#dv_impressao')[0];
    ifrm.style.display = 'block';
    ifrm.style.width = 800 + "px";
    ifrm.style.height = 600 + "px";       
    ifrm.contentDocument.head.innerHTML = "<style>@media print{body{background:#fff}#dv_impressao{height:300px;width:400px;z-index:2000000;top:0;overflow:hidden}#dv_tabela_imp{width:400px;font-size:10px;font-weight:700;font-family:arial;display:inline-block}#dv_tabela_imp .linha #nr_solic{display:inline-block;width:50px;font-size:10px;font-weight:400}#dv_tabela_imp #dt_solic{display:inline-block;width:50px;font-size:10px;font-weight:400}#dv_tabela_imp #hr_solic{display:inline-block;width:50px;margin-left:10px;font-size:10px;font-weight:400}#dv_tabela_imp #nm_solic{display:inline-block;width:51px;font-size:10px;font-weight:400}#dv_tabela_imp #dt_atend{display:inline-block;width:50px;font-size:10px;font-weight:400}#dv_tabela_imp #hr_atend{display:inline-block;width:50px;margin-left:10px;font-size:10px;font-weight:400}#dv_tabela_imp #nm_atend{display:inline-block;width:51px;font-size:10px;font-weight:400}#dv_tabela_imp .linha table{margin-top:10px;font-size:10px}#dv_tabela_imp .linha table thead tr th{text-align:left}#dv_tabela_imp .linha table thead tr th:first-child{width:70px}#dv_tabela_imp .linha table tbody tr td{text-align:left;font-weight:400}}</style>";
    ifrm.contentDocument.body.innerHTML = content;
    ifrm.contentWindow.focus();
    ifrm.contentWindow.print();
}
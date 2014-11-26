$(function(){

    var self = this;

    $('#login-usuario').addClass('isValid[required|justlength(5)]').val('').setMask({mask:'a9999'}).focus();
    $('#login-senha').addClass('isValid[required]').val('');
    $('#login-usuario,#login-senha').validar.limparErros();

    self.login = function(){

       if(!$('#login-usuario,#login-senha').validar(true)) return;

       var url = 'login.php';
       var dados = {
           'login-usuario' : $('#login-usuario').val(),
           'login-senha' : $('#login-senha').val()
       };

       $.post(url,dados,function(retorno){
           if(retorno.ret == 'false'){
               $('#login-msg').html(retorno.msg);
               $('#login-usuario').val('');
               $('#login-senha').val('');
           }else{
               $('#login-msg').html('');
               if(retorno.url){
                   window.location = retorno.url;
               }
           }
       },'json');
    }

    localStorage.clear();
});
$(function(){
    
    var LGI001 = new pacote_Login.Login.logar();
    var self = this;
    
    
    self.Inicializar = function(){
        
        $("#ini_login_usu").mask("999.999.999-99");

        $('#btn_login').click(function(){
            self.Login();
        });
    };
    
    self.Login = function(){  
        
        $.post('src/scu/controller/scu_c0001.php',{
            in_login_usu : $('#ini_login_usu').val(),
            ini_senha_usu : $('#ini_senha_usu').val()
        },function(retorno){
            console.log(retorno);
        });
        
        
//        LGI001.getini_login_usu = $('#ini_login_usu').val();
//        LGI001.getini_senha_usu = $('#ini_senha_usu').val();
//        LGI001.Login();        
//        
    };
   
    self.Inicializar();
   
});


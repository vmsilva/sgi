var pacote_Login = {
    
    Login:{
        
        logar:function(){
            
            var ini_login_usu;
            var ini_senha_usu;
            var form;
            
            this.getini_login_usu = getini_login_usu;
            function getini_login_usu(){
                return ini_login_usu;
            }
            
            this.getini_senha_usu = getini_senha_usu;
            function getini_senha_usu(){
                return ini_senha_usu;
            }
            
            this.getform = getform;
            function getform(){
                return form;
            }            
            
            this.Login2 = function(){
                
                console.log("boboca"+this.getini_login_usu);
            };
            
            this.Login = function(){
                
               var url = 'src/scu/controller/scu_c0001.php';
               
               $.ajax({                   
                   type: "POST",
                    data: {
                        ini_login_usu: this.getini_login_usu,
                        ini_senha_usu: this.getini_senha_usu
                    },
                    url: url,
                    dataType: 'html',
                    success: function(data, textStatus, jqXHR) {
                        
                    },
                    beforeSend: function(xhr) {
                        
                    },
                    complete: function(jqXHR, textStatus) {
                        
                    }
               });
            };
            
        }
        
    }    
}; 

//pacote_Login.Login.prototype = new Formulario();
pacote_Login.Login.prototype;


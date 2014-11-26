$(function(){
    //Montar Menu
    getMenuModuloUsuario = function(cd_modulo){
        if(cd_modulo != ''){
            var dados = {
               'cd_modulo' : cd_modulo
           };
           $.post('sca/controll/menuModuloSuperior.php',dados,function(retorno){
                if(retorno.ret == 'false'){
                   $('#dv_menuSuperior').html('Menu não Informado!');
               }else{
                   $('#dv_menuSuperior').html(retorno);
                   $( ".menuSuperior > ul" ).menu({ icons: { submenu: "ui-icon-circle-triangle-e" } });
                   configMenu();
                   $("#frm" ).click(function(){
                        $( ".menuSuperior > ul" ).hide();
                    });
               }
           },'html');
        }
    }
});


function configMenu(){
   $('.menuSuperior > a').unbind().click(function(){
         $( ".menuSuperior > ul" ).hide();
       $(this).next().show();
   });
}
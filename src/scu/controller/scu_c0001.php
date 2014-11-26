<?php session_start();
    
include '../model/SCU_M0001.php';
//include '../../../authentic/model/Mecanismo.php';

    /* Ajuda a Localizar os erros do php*/
    error_reporting(E_ALL);
    ini_set("display_errors","on");
    
//echo $_SERVER['HTTP_HOST'];

    
//    $G_MEC = new Mecanismo();
    
//    $ini_login_usu = $G_MEC->recebePost($_POST, 'ini_login_usu');
//    $ini_senha_usu = $G_MEC->recebePost($_POST, 'ini_senha_usu');
    
    //SCU_M0001::set_cpf_usu('02805612108');
//    SCU_M0001::set_senha_usu($ini_senha_usu);
    
    $rs = SCU_M0001::buscar();   
    
    
    //var_dump($rs); 
    print_r($rs);

    exit();
?>


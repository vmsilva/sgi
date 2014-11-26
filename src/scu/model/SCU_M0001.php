<?php
  
include '../../../authentic/model/Mecanismo.php';

class SCU_M0001 extends Mecanismo{
  
      
    private static $cd_usu;
    private static $nm_usu;
    private static $email_usu;
    private static $senha_usu;
    private static $cpf_usu;
    private static $dt_nasc_usu;
    private static $fn_usu;
    private static $st_usu;
    
    public static function get_cd_usu() {
        return self::$cd_usu;
    }

    public static function get_nm_usu() {
        return self::$nm_usu;
    }

    public static function get_email_usu() {
        return self::$email_usu;
    }

    public static function get_senha_usu() {
        return self::$senha_usu;
    }

    public static function get_cpf_usu() {
        return self::$cpf_usu;
    }

    public static function get_dt_nasc_usu() {
        return self::$dt_nasc_usu;
    }

    public static function get_fn_usu() {
        return self::$fn_usu;
    }

    public static function get_st_usu() {
        return self::$st_usu;
    }

    public static function set_cd_usu($cd_usu) {
        self::$cd_usu = $cd_usu;
    }

    public static function set_nm_usu($nm_usu) {
        self::$nm_usu = $nm_usu;
    }

    public static function set_email_usu($email_usu) {
        self::$email_usu = $email_usu;
    }

    public static function set_senha_usu($senha_usu) {
        self::$senha_usu = $senha_usu;
    }

    public static function set_cpf_usu($cpf_usu) {
        self::$cpf_usu = $cpf_usu;
    }

    public static function set_dt_nasc_usu($dt_nasc_usu) {
        self::$dt_nasc_usu = $dt_nasc_usu;
    }

    public static function set_fn_usu($fn_usu) {
        self::$fn_usu = $fn_usu;
    }

    public static function set_st_usu($st_usu) {
        self::$st_usu = $st_usu;
    }
    
    
    Public Static Function Incluir(){
        
        $tabela = "SGI.scu_t0001";
        $oper = "INSERT";
        $dados['cd_usu'] = Mecanismo::geraMaximoCodigo('cd_usu', $tabela);
        $dados['nm_usu'] = 'boquete';
        $dados['email_usu'] = 'boquete@email.com';
        $dados['senha_usu'] = 'senha';
        $dados['cpf_usu'] = 'cpf';
        $dados['dt_nasc_usu'] = 'nascimento';
        $dados['fn_usu'] = '6234666';
        $dados['st_usu'] = '1';        
        
        return Mecanismo::ExecutaMetodo($oper, $tabela, $dados);
    }
    
    Public Static Function Excluir(){}
    Public Static Function Alterar(){}
    
    Public Static Function buscar(){
        
        $strsql  = "SELECT";
        $strsql .= " t0001.cd_usu,";
        $strsql .= " t0001.nm_usu,";
        $strsql .= " t0001.email_usu,";
        $strsql .= " t0001.senha_usu,";
        $strsql .= " t0001.cpf_usu,";
        $strsql .= " t0001.dt_nasc_usu,";
        $strsql .= " t0001.fn_usu,";
        $strsql .= " t0001.st_usu";
        $strsql .= " FROM SGI.scu_t0001 t0001";
    
//        print_r(Mecanismo::ConsultaMetodo($strsql));
//
//        exit();
      //$strsql .= " WHERE t0001.cd_usu =".self::$cd_usu;        
      //$strsql .= " WHERE t0001.cpf_usu =".self::$cpf_usu;
        
//        (is_numeric(self::$cd_usu))? $strsql.= " WHERE t0001.cd_usu = ".self::$cd_usu : '';
//        (is_numeric(self::$cpf_usu))? $strsql.= " and t0001.cpf_usu = ".self::$cpf_usu : '';
//        (is_numeric(self::$senha_usu))? $strsql.= " and t0001.senha_usu = ".self::$senha_usu : '';
        
        //$rs = Mecanismo::ConsultaMetodo($strsql);
        
        
        
        
        
        //print_r($rs);
        
        //return var_dump(Mecanismo::ConsultaMetodo($strsql));
        //return $strsql;
        //debug_print_backtrace();
        //(is_numeric(self::$cd_grp_consulta))? $strsql.= " and t0001.cd_grp_consulta = ".Mecanismo::TrataString(self::$cd_grp_consulta) : '';
        
        return $strsql;
        //return Mecanismo::ConsultaMetodo($strsql);
        //return Mecanismo::testeMecanismo();
        
        }  
}

?>

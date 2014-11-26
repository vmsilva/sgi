<?php
class __SCU_M0001 extends Mecanismo{
  
    private static $cd_usu;
    private static $nm_usu;
    private static $email_usu;
    private static $senha_usu;
    private static $cpf_usu;
    private static $dt_nasc_usu;
    private static $fn_usu;
    private static $st_usu;
    
    public static function getCd_usu() {
        return self::$cd_usu;
    }

    public static function getNm_usu() {
        return self::$nm_usu;
    }

    public static function getEmail_usu() {
        return self::$email_usu;
    }

    public static function getSenha_usu() {
        return self::$senha_usu;
    }

    public static function getCpf_usu() {
        return self::$cpf_usu;
    }

    public static function getDt_nasc_usu() {
        return self::$dt_nasc_usu;
    }

    public static function getFn_usu() {
        return self::$fn_usu;
    }

    public static function getSt_usu() {
        return self::$st_usu;
    }

    public static function setCd_usu($cd_usu) {
        self::$cd_usu = $cd_usu;
    }

    public static function setNm_usu($nm_usu) {
        self::$nm_usu = $nm_usu;
    }

    public static function setEmail_usu($email_usu) {
        self::$email_usu = $email_usu;
    }

    public static function setSenha_usu($senha_usu) {
        self::$senha_usu = $senha_usu;
    }

    public static function setCpf_usu($cpf_usu) {
        self::$cpf_usu = $cpf_usu;
    }

    public static function setDt_nasc_usu($dt_nasc_usu) {
        self::$dt_nasc_usu = $dt_nasc_usu;
    }

    public static function setFn_usu($fn_usu) {
        self::$fn_usu = $fn_usu;
    }

    public static function setSt_usu($st_usu) {
        self::$st_usu = $st_usu;
    }
    
    
    Public Static Function Incluir(){}
    Public Static Function Excluir(){}
    Public Static Function Alterar(){}
    Public Static Function Buscar(){
        
        $strsql = "Select ";
        $strsql .= " t0001.cd_usu,";
        $strsql .= " t0001.nm_usu,";
        $strsql .= " t0001.email_usu,";
        $strsql .= " t0001.senha_usu,";
        $strsql .= " t0001.cpf_usu,";
        $strsql .= " t0001.dt_nasc_usu,";
        $strsql .= " t0001.fn_usu,";
        $strsql .= " t0001.st_usu";
        $strsql .= " FROM SGI.scu_t0001 t0001";
        
      //$strsql .= " WHERE t0001.cd_usu =".self::$cd_usu;        
      //$strsql .= " WHERE t0001.cpf_usu =".self::$cpf_usu;
        
       // (is_numeric(self::$cd_usu))? $strsql.= " WHERE t0001.cd_usu = ".self::$cd_usu : '';
       // (is_numeric(self::$cpf_usu))? $strsql.= " and t0001.cpf_usu = ".self::$cpf_usu : '';
       // (is_numeric(self::$senha_usu))? $strsql.= " and t0001.senha_usu = ".self::$senha_usu : '';
        
        return $strsql;

      //(is_numeric(self::$cd_grp_consulta))? $strsql.= " and t0001.cd_grp_consulta = ".Mecanismo::TrataString(self::$cd_grp_consulta) : '';

    }
    
}

?>

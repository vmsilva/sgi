<?php
//if(getcwd() === '/var/www/sistema'){
//    define('BASE','./');
//}else{
//    define('BASE','./../../');
//}
//include BASE.'library/Zend/banco.php';
//include BASE.'authentic/model/funcoes.php';
include 'library/Zend/banco.php';
include 'authentic/model/funcoes.php';

//function __autoload($class_name) {
//
//    $classe = explode('_', $class_name);
//
//    switch ($classe[0]) {
//        case 'SCA': //Sistema Controle de Acesso
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        case 'SCP': //Sistema Controle de Prontuário Físico
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        case 'SGM': //Sistema Gerenciamento Municipal
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        case 'SMG': //Sistema Modulo Gerencial
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        case 'SGA': //Sistema Modulo Gerencial
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        case 'SMT': //Sistema Modulo Manutenção
//            require_once BASE.strtolower($classe[0]).'/model/'.$class_name.'.php';
//            break;
//        default:
//            return;
//            break;
//    }
//}

class ____Mecanismo extends Funcoes{

    Public static $db;

    Function __construct(){
        self::$db =  new Banco();
    }

    Public Static Function ConsultaMetodo($strsql){

        $select = explode(' ', $strsql);

        if(strtoupper($select[0]) === 'SELECT'){
            try{
                return self::$db->fetchAll($strsql);
            }  catch (Exception $e){
                echo 'Erro! Gerar Log';
            }
        }else{
            echo 'Erro! Método '.$select[0].' não Permitido para está Função!';
        }
    }

    Public Static Function ExecutaMetodo($oper, $tabela, $dados ,$where = null){
		
        $msg = '';
        switch (strtoupper(trim($oper))) {
            case 'INSERT':
                try{
                   return self::$db->insert($tabela,$dados);
                }  catch (Exception $e){
                    $msg = 'Erro! Gerar Log: '.$e->getMessage();
                    echo $msg;
                    return False;
                }
                break;
            case 'UPDATE':
                try {
                   return self::$db->update($tabela,$dados,$where);
                }  catch (Exception $e){
                    $msg = 'Erro! Gerar Log: '.$e->getMessage();
                    echo $msg;
                    return False;
                }
                break;
            case 'DELETE':
                try {
                    return self::$db->delete($tabela,$where);
                    //return TRUE;
                }  catch (Exception $e){
                    $msg = 'Erro! Gerar Log: '.$e->getMessage();
                    echo $msg;
                    return FALSE;
                }
                break;

            default:
                $msg = 'Erro: Método '.$oper.' não Permitido para está Função!';
                echo $msg;
                break;
        }
		if(trim($msg) !== '')  return $msg;
    }

    Public Static Function geraMaximoCodigo($codigo, $table, $where = null){

        $sql = 'Select max('.$codigo.') as codigo';
        $sql.= ' From '.$table;
        if($where){
            $sql.= ' Where '.$where;
        }

        $rsChave = Mecanismo::ConsultaMetodo($sql);
        if(count($rsChave)>0){
            foreach ($rsChave as $key => $value) {
                return (int)((int)$value['codigo'] + 1);
            }
        }else{
            return (int)1;
        }
    }

    Public Static Function geraMaximoCodigoAgenda($codigo, $table, $dt_atend){

        $sql = 'Select coalesce(max('.$codigo.'),0) as codigo';
        $sql.= ' From '.$table;
        $sql.= ' Where substr('.$codigo.',1,8) = '.self::TrataString($dt_atend);
        
        $rs = self::$db->fetchRow($sql);
        if($rs['codigo'] > 0){
            return (int)$rs['codigo']+1;
        }else{
            return (int)$dt_atend.'0001';
        } 
    }
    
    Public Static Function geraMaximoCodigoYYYYMM($codigo, $table, $dt_atend){

        $sql = 'Select coalesce(max('.$codigo.'),0) as codigo';
        $sql.= ' From '.$table;
        $sql.= ' Where substr('.$codigo.',1,6) = '.substr(self::TrataString($dt_atend),1,6);

        $rs = self::$db->fetchRow($sql);
        if($rs['codigo'] > 0){
            return (int)$rs['codigo']+1;
        }else{
            return (int)substr(self::TrataString($dt_atend),1,6).'0001';
        } 
    }

    Public Static Function TransacaoInicio(){
        
        self::$db->beginTransaction();
        
    }

    Public Static Function TransacaoFinaliza(){
        self::$db->commit();
    }

    Public Static Function TransacaoAborta(){

        self::$db->rollBack();
    }
}

class renderView {

    public function __construct() { 

    }

    public function renderGrid($dados, $headers,$inputBusca=true,$url=null,$idDivContainer=null) {

        $this->inputBusca = $inputBusca;
        $this->dados = $dados;
        $this->headers = $headers;
        $this->idDivContainer = $url.'-'.$idDivContainer;
        ob_start();
        include '../../default/view/grid.php';
        $out = ob_get_contents();
        ob_end_clean();
        return $out;
    }
}

CLASS GERAL_UPLOAD{

	Public $nm_arq_ori;
        Public $in_sigla;

	Public $nm_arq_dest;
	Public $nm_dir_dest;


        public function setnm_arq_ori($nm_arq_ori){
            $this->nm_arq_ori = $nm_arq_ori;
	}

        public function setin_sigla($in_sigla){
            $this->in_sigla = $in_sigla;
	}


	Public Function Salva(){
	
            $dir_sistema = '/var/www/sistema/'.$this->in_sigla.'/dados/';
            $nm_dir_tmp = $this->nm_dir_dest['tmp_name']['realupload'];
            $nm_arq_ori = $this->nm_dir_dest['name']['realupload'];

            if(!(file_exists($dir_sistema.$nm_arq_ori))){
                if (isset($nm_arq_ori)){
                    if($this->nm_dir_dest['type']['realupload'] === "text/plain"){
                        if (is_uploaded_file($nm_dir_tmp)){
                            return copy($nm_dir_tmp, $dir_sistema.$nm_arq_ori);
                        }else{
                            return false;
                        }
                    }
                }
            }else{
                unlink($dir_sistema.$nm_arq_ori);
                return false;
            }
	}
}

$G_UP = New GERAL_UPLOAD();
?>

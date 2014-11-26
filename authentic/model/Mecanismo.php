<?php


//include('../../library/Zend/Banco.php');
//class_exists('Banco.php');

include 'Funcoes.php';

if(getcwd() === '/var/www/SGI/src/scu/controller'){       
    include './../../../library/Zend/Banco.php';
    exit('buceta');
    include './../../../library/Zend/Teste.php';    
}else{
    exit('buceta');
    include './../../library/Zend/Banco.php';
    include './../../library/Zend/Teste.php';    
}

//include '../../library/Zend/Teste.php';
//include_once '../../src/scu/model/SCU_M0001.php';
//var_dump(file_exists('./../../../library/Zend/Db/Select.php'));
//exit('bosta');

class Mecanismo extends Funcoes{

    Public static $db ;
        
    function __construct(){
        self::$db = new Banco();
    }
    
    Public static Function testeMecanismo(){
        return Teste::teste();
    }
    
    Public Static Function ConsultaMetodo($strsql){
        
        $select = explode(' ', $strsql);

        if(strtoupper($select[0]) === 'SELECT'){
      
            try{
                exit('boga');
                return self::$db->fetchAll($strsql);                
            }  catch (Exception $e){
                echo  'Erro! Gerar Log' . $e;
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

?>

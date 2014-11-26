<?php

class Funcoes {

    Public Static Function TrataString($str = ''){

        $string = mysql_escape_string(trim($str));
        $string = strtoupper(strtr(preg_replace('/\'/', '',$string) ,"áéíóúâêôãõàèìòùç","ÁÉÍÓÚÂÊÔÃÕÀÈÌÒÙÇ"));

        if($string === ''){
            return 'null';
        }

        return '"'.substr($string,0,250).'"';
    }

    Public Static Function TrataStringMinusculo($str = ''){

        $string = mysql_escape_string(trim($str));
        $string = strtolower(strtr(preg_replace('/\'/', '',$string) ,"áéíóúâêôãõàèìòùç","ÁÉÍÓÚÂÊÔÃÕÀÈÌÒÙÇ"));

        if($string === ''){
            return 'null';
        }

        return '"'.substr($string,0,250).'"';
    }

    Public Static Function TrataStringEnum($str = ''){

        if(strlen(trim($str)) > 0){
            $string = explode('|', $str);
            $virg = '';
            $campo = '';
        
            foreach ($string as $value) {
                $campo.= $virg.'"'.$value.'"';
                $virg = ',';
            }
            return '('.$campo.')';
        }else{
            return 'null';
        }
    }

    Public Static Function recebePost($valor, $chave, $n = NULL){
	if(isset ($valor[trim($chave)]))
            return $valor[$chave];
	else
            return $n;
    }

    Public Static Function ValidaNumeroInteiro($int){
        return filter_var($int, FILTER_VALIDATE_INT);
    }

    Public Static Function DataHoje(){

        date_default_timezone_set('America/Sao_Paulo');
	$dt_aux = explode('/',date("d/m/Y"));
	$ano = $dt_aux[2];
	$mes = $dt_aux[1];
	$dia = $dt_aux[0];
	$data = $ano.$mes.$dia;
	return $data;
        
    }

    Public Static Function HoraHoje(){

        date_default_timezone_set('America/Sao_Paulo');

        $hora = date("Hi");
        return $hora;
        
    }

    Public Static Function FormataDatacomBarra($data){
        if(strlen(trim($data)) === 8 ){
            return substr($data,6,2).'/'.substr($data,4,2).'/'.substr($data,0,4);
        }else{
            return 'Formato data Inválido';
        }
    }
	
	Public Static Function FormataHora($hora){
        if(strlen(trim($hora)) === 4 ){
            return substr($hora,0,2).':'.substr($hora,2,2);
        }else{
            return 'Formato data Inválido';
        }
    }

    Public Static Function FormataDataTiraBarraInverte($data){
        if(strlen(trim($data)) === 10 ){
            $data_aux = explode('/', $data);
            return  $data_aux[2].$data_aux[1].$data_aux[0];
        }else{
            return 'Formato data Inválido';
        }
    }

    Public Static Function FormataDataVerificaMaior($data1, $data2){
        if((int)trim($data2) > (int)trim($data1)){
            return false;
        }else{
            return true;
        }
    }

    //A data deve vir no formato AAAAMMDD
    Public Static Function ValidaData($data){
        if(strlen(trim($data)) === 8){
            $year = substr($data, 0, 4);
            $month = substr($data, 4, 2);
            $day = substr($data, 6, 2);
            if(checkdate($month, $day, $year)){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    Public Static Function EnumSexo($sexo){

        if(strlen(trim($sexo)) === 1){
            switch ($sexo) {
                case 'F':
                    return 'Feminino';
                    break;
                case 'M':
                    return 'Masculino';
                    break;
                case 'I':
                    return 'Indefinido';
                    break;
                default:
                    return 'Sexo Inválido!';
                    break;
            }
        }else{
            return 'Formato Inválido!';
        }
    }
    
    Public Static Function EnumDiaSemana($dia_semana){

        if(strlen(trim($dia_semana)) === 1){
            switch ($dia_semana) {
                case '0':
                    return 'Domingo';
                    break;
                case '1':
                    return 'Segunda-feira';
                    break;
                case '2':
                    return 'Terça-feira';
                    break;
                case '3':
                    return 'Quarta-feira';
                    break;
                case '4':
                    return 'Quinta-feira';
                    break;
                case '5':
                    return 'Sexta-feira';
                    break;
                case '6':
                    return 'Sábado';
                    break;
                default:
                    return 'Dia Semana não informado!';
                    break;
            }
        }else{
            return 'Formato Inválido!';
        }
    }
    
    Public Static Function TirarMascara($texto){

        $chars = array(".","/","-","(",")",":");
        $texto = str_replace($chars,"",$texto);

        return $texto;
    }
    
    Public Static Function Formata_Fone_CEP_CPF_CNPJ($campo, $tipo){
        
        if(trim($tipo) !== ''){
            switch (strtoupper($tipo)) {
                case 'FONE':
                    if(strlen($campo) === 10){
                        return '('.substr($campo, 0, 2).')'.substr($campo, 2, 4).'-'.substr($campo, 6, 4);
                    }else{
                        return '';
                    }
                    break;
                case 'CEP':
                    if(strlen($campo) === 8){
                        return substr($campo, 0, 2).'.'.substr($campo, 2, 3).'-'.substr($campo, 5, 3);
                    }else{
                        return '';
                    }
                    break;
                case 'CPF':
                    if(strlen($campo) === 11){
                        return substr($campo, 0, 3).'.'.substr($campo, 3, 3).'.'.substr($campo, 6, 3).'-'.substr($campo, 9, 2);
                    }else{
                        return 'CPF Inválido';
                    }
                    break;
                case 'CNPJ':
                    if(strlen($campo) === 14){
                        return $campo;
                    }else{
                        return '';
                    }
                    break;
                default:
                    return 'Formato Invalido!';
                    break;
            }
        }
    }
    
    Public Static Function ValidarCPF($nr_cpf){
        
        $pattern = '/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/i';

        if(preg_match($pattern, $nr_cpf)){

            $cpf = preg_replace('/[^\d]+/i', '', $nr_cpf);
            switch ($cpf) {
                case '00000000000':
                case '11111111111':
                case '22222222222':
                case '33333333333':
                case '44444444444':
                case '55555555555':
                case '66666666666':
                case '77777777777':
                case '88888888888':
                case '99999999999':
                return false;
                break;

            }
            $NumDigPrim = 0;
            $NumDigSegun = 0;
            for($i=0; $i<9; $i++){
                $NumDigPrim+= $cpf{$i}*(10-$i);
                $NumDigSegun+= $cpf{$i}*(11-$i);
            }
            
            $NumDigPrim = (11-fmod($NumDigPrim,11));
            if($NumDigPrim >= 10){
                $NumDigPrim = 0;
            }
            
            $NumDigSegun = (11-fmod(($NumDigSegun + ($NumDigPrim*2)),11));
            if($NumDigSegun >= 10){
                $NumDigSegun = 0;
            }
            
            if((int)substr($cpf,9,2) == (int)($NumDigPrim.$NumDigSegun)){
                return true;
            }else{
                return false;
            }

        }else{
            return 'CPF Inválido';
        }
        exit();
    }
    
    // ------------------------------------------------------------------
    //  CalculaDigitoMod11(Dado, NumDig, LimMult)
    //  Retorna o(s) NumDig Dígitos de Controle Módulo 11 do NumDado
    //  limitando o Valor de Multiplicação em LimMult:
    // 
    //  Números Comuns:     NumDig     LimMult
    //       CPF               2           12
    //       CNPJ              2            9
    //       PIS,C/C,Age       1            9
    // ------------------------------------------------------------------
    Public Static Function CalculaDigitoMod11($NumDado, $NumDig, $LimMult){

            $Dado = $NumDado;
            for($n=1; $n<=$NumDig; $n++){
                    $Soma = 0;
                    $Mult = 2;
                    for($i=strlen($Dado) - 1; $i>=0; $i--){
                            $Soma += $Mult * intval(substr($Dado,$i,1));
                            if(++$Mult > $LimMult) $Mult = 2;
                    }
                    $Dado .= strval(fmod(fmod(($Soma * 10), 11), 10));
            }
            return substr($Dado, strlen($Dado)-$NumDig);
    }
}
?>
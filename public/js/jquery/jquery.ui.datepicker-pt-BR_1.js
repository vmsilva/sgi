/* Brazilian initialisation for the jQuery UI date picker plugin. */
jQuery(function($){
	$.datepicker.regional['pt-BR'] = {
		closeText: 'Fechar',
		//prevText: '&#x3c;Anterior',
		//nextText: 'Pr&oacute;ximo&#x3e;',
		currentText: 'Hoje',
		buttonImage: "",
		buttonImageOnly: false,
		monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho',
		'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
		dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
                yearRange: '1902:2062',
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['pt-BR']);
});
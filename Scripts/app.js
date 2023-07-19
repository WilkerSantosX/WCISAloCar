var dataDe, horaDe;
var qtdReserva = 0;
var map;

$(document).ready(function () {			 
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.tooltipped').tooltip();
    $('.select').formSelect();
    $('.tabs').tabs();

    $('input.autocomplete').autocomplete({
        data: {
            "Hotel - Hotel Jaguaré - Av. Corifeu de Azevedo Marques, 6090 - Jaguaré, São Paulo, SP": '',
            "Parque Villa Lobos - Avenida Professor Fonseca Rodrigues, (Alto de Pinheiros), São Paulo, SP": '',
        },
    });

    (async () => {
        getDateNow(new Date());
        await wait(1000);
        removeLoadingMain();
        updateCalendarioAte();
    })();

    horaDe = getHourNow(new Date());   
    $("#hora_retirada").val(horaDe);
    $("#hora_devolucao").val(horaDe);

    $('.datepicker-de').datepicker({
        autoClose: true,        
        format: "dd/mm/yyyy",
        //parse: null,
        defaultDate: new Date(moment().format('yyyy'), moment().format('M')-1, moment().format('DD')),     
        setDefaultDate: true,   
        disableWeekends: true,
        // disableDayFn: ((callbackDay) => {
        //     if(callbackDay.getDay() == 1 || callbackDay.getDay() == 2 || callbackDay.getDay() == 3) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }),
        firstDay: 0,
        minDate: new Date(moment().format('yyyy'), moment().format('M')-1, moment().format('DD')),
        maxDate: new Date(moment().format('yyyy'), moment().format('M')-1, moment().add(7, 'days').format('DD')),
        yearRange: 1,
        // minYear: 2023,
        // maxYear: 2025,
        // minMonth: 6,
        // maxMonth: 2,
        // startRange: null,
        // endRange: null,
        //isRTL: true,
        showMonthAfterYear: true,
        //showDaysInNextAndPreviousMonths: true,
        //container: null,
        showClearBtn: false,
        i18n: {
            cancel: '',
            clear: '',
            done: '',
            months: [ 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthsShort: [ 'Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            weekdays: [ 'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado' ],
            weekdaysShort: [ 'Dom','Seg','Ter','Qua','Qui','Sex','Sáb' ],
            weekdaysAbbrev: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ]
        },
        // events: [],
        onSelect: ((el) => {
            getDateNow(el);
            updateCalendarioAte();
        }),
        // onOpen: ((isOpen) => {console.log(isOpen)}),
        // onClose: ((date) => {console.log(date)}),
        // onDraw: ((options) => {console.log(options)})
    });   

    $('.timepicker-de').timepicker({
        //duration: 350,
        //showClearBtn: true,
        //defaultTime: '13:14',
        //fromNow: 20000,
        twelveHour: false,
        //vibrate: false,
        // onOpenStart: ((el) => {console.log(el)}),
        // onOpenEnd: ((time) => {console.log(time)}),
        // onCloseStart: ((isOpen) => {console.log(isOpen)}),
        onCloseEnd: (() => {CalcularTempoAluguel()}),
        // onSelect: ((time) => {console.log(time)}),
        i18n: {
            cancel: 'cancelar',
            clear: '',
            done: 'ok',
        },        
    });

    $('.timepicker-ate').timepicker({
        //duration: 350,
        //showClearBtn: true,
        //defaultTime: '13:14',
        //fromNow: 20000,
        twelveHour: false,
        //vibrate: false,
        // onOpenStart: ((el) => {console.log(el)}),
        // onOpenEnd: ((time) => {console.log(time)}),
        // onCloseStart: ((isOpen) => {console.log(isOpen)}),
        onCloseEnd: (() => {CalcularTempoAluguel()}),
        // onSelect: ((time) => {console.log(time)}),
        i18n: {
            cancel: 'cancelar',
            clear: '',
            done: 'ok',
        },        
    });

    //$('.timepicker').timepicker('open')
    //$('.timepicker').timepicker('_updateTimeFromInput', '10:30')
    M.updateTextFields();


    //Ações do usuário
    $('.green-text').click(function(){
        $(this).removeClass("green-text");
        $(this).addClass("orange-text"); 
        $("#btn_acao").removeClass("hide");
    });


    $('.historico-div').click(function(){
        setInterval(function () {
            $('#loading-historico').hide()
            $('#historico').show()
        }, 1000);
    });


    $("#agendamento_tipo").change(function(){    
        if(this.value == 'consulta' || this.value == 'estadia' || this.value == 'prestacao' || this.value == 'recebimento'){
            $('.div-devolucao').hide();
            $('#lblDataRetirada').text("Data");
            $('#lblHoraRetirada').text("Hora");
        } else{
            $('#lblDataRetirada').text("Data Retirada");
            $('#lblHoraRetirada').text("Hora Retirada");            
            $('.div-devolucao').show();
        }
    });

    $('.mais-rota').click(function(){    
        $(".row.rota-adicional").show();
    });
    $('#deleterota').click(function(){
        $(".row.rota-adicional:first").hide();
    });

    $('#salvar').click(function(){
        Swal.fire({
            icon: 'question',
            title: 'Deseja solicitar um carro?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: `Não`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Solicitado com sucesso!', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
    });

});

// function carregar(){
//     (async () => {
//         wait(10000);
//         $('.preloader-wrapper').hide(); 
//         $('#historico').show();
//     })();
// }

function abrirFormRota(id){
    $("#" + id).show();
}
function removerFormRota(id){
    $("#" + id).hide();
}

var avalicao;

function like(){   
    if(avalicao == "dislike"){
        $('#dislike').attr('src','Content/images/dislike.svg'); 
    }
    $('#like').attr('src','Content/images/like_click.svg');
    avalicao = "like";
}

function dislike(){     
    if(avalicao == "like"){
        $('#like').attr('src','Content/images/like.svg'); 
    }
    $('#dislike').attr('src','Content/images/dislike_click.svg'); 
    avalicao = "dislike";
}

var hasOpenFeedback = true;
function openFeedback(){
    if(hasOpenFeedback){
        $("#comentario").show();
        hasOpenFeedback = false;
    }else{
        $("#comentario").hide();
        hasOpenFeedback = true;
    }
}

function cancelarViagem(){
    Swal.fire({
        icon: 'question',
        title: 'Deseja realmente cancelar a viagem?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: `Não`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Solicitado com sucesso!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
}

function filtrarViagens(tipo){ 
    if(tipo == "c-aberto"){
        $(".c-pendente").hide();
        $(".c-encerrado").hide();
        $(".c-aberto").show();
    }
    if(tipo == "c-pendente"){
        $(".c-aberto").hide();
        $(".c-encerrado").hide();
        $(".c-pendente").show();
    }
    if(tipo == "c-encerrado"){
        $(".c-pendente").hide();
        $(".c-aberto").hide();
        $(".c-encerrado").show();
    }
    if(tipo == "c-todos"){
        $(".c-aberto").show();
        $(".c-pendente").show();
        $(".c-encerrado").show();
    }
}



var isMapaCarregado = false;
function IniciarMapa(){		
    if(!isMapaCarregado){
        (async () => {
            $("#loading-texto").text("Processando rota..."); 
            
            await wait(1500);
            $('#loading-mapa').hide(); 
            //Set visão do mapa
            map = L.map('map').setView([-23.550519562779346, -46.63364131951546], 16);
                
                //Instanciando o mapa via jquery e renderizando no HTML
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 4,   //Valor do scroll no zoom
                maxZoom: 19,  //Valor do scroll no zoom
                attribution: '© StreetMap'
            }).addTo(map);	
    
            L.Routing.control({
                waypoints: [
                  L.latLng(-23.550729332028578, -46.75741530803285),
                  L.latLng(-23.5416455843596, -46.730069541030566)
                ]
              }).addTo(map); 
            
            await wait(1500);
            $("#loading-texto").text("Dados carregados!");       
        })();
        isMapaCarregado = true;
    }   
}



function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function updateCalendarioAte(){
    $('.datepicker-ate').datepicker({
        autoClose: true,        
        format: "dd/mm/yyyy",
        //parse: null,
        defaultDate: dataDe,     
        setDefaultDate: true,   
        disableWeekends: true,
        // disableDayFn: ((callbackDay) => {
        //     if(callbackDay.getDay() == 1 || callbackDay.getDay() == 2 || callbackDay.getDay() == 3) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }),
        firstDay: 0,
        minDate: dataDe,
        maxDate: new Date(moment().format('yyyy'), moment().format('M')-1, moment().add(7, 'days').format('DD')),
        yearRange: 1,    
        // minYear: 2023,
        // maxYear: 2025,
        // minMonth: 6,
        // maxMonth: 2,
        // startRange: null,
        // endRange: null,
        //isRTL: true,
        showMonthAfterYear: true,
        //showDaysInNextAndPreviousMonths: true,
        //container: null,
        showClearBtn: false,
        i18n: {
            cancel: '',
            clear: '',
            done: '',
            months: [ 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthsShort: [ 'Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            weekdays: [ 'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado' ],
            weekdaysShort: [ 'Dom','Seg','Ter','Qua','Qui','Sex','Sáb' ],
            weekdaysAbbrev: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ]
        },
        // events: [],
        onSelect: ((el) => {    
        }),
        onOpen: ((isOpen) => {console.log(dataDe)}),
        // onClose: ((date) => {console.log(date)}),
        // onDraw: ((options) => {console.log(options)})
    });   
}

function getDateNow(value){ 
    const today = value;
    const yyyy = today.getFullYear();
    let mm = today.getMonth(); // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    //const formattedToday = dd + '/' + mm + '/' + yyyy; 
    dataDe = new Date(yyyy, mm, dd);  
}

function getHourNow(value){ 
    const today = value;
    var hh = today.getHours();
    var mm = today.getMinutes();

    if (hh < 10) hh = '0' + hh;
    if (mm < 10) mm = '0' + mm;

    return hh + ":" + mm;
}


function CalcularTempoAluguel(){    
    if($("#hora_devolucao").val() == '')
        return;

    let dformat1 = $("#data_retirada").val().split("/");
    let hformat1 = $("#hora_retirada").val();
    let aluguel = dformat1[2] + "-" + dformat1[1] + "-" + dformat1[0] + " " + hformat1;

    let dataAluguel = moment(aluguel, 'YYYY-MM-DD HH:mm:ss');
        
    let dformat2 = $("#data_devolucao").val().split("/");
    let hformat2 = $("#hora_devolucao").val();
    
    let devolucao = dformat2[2] + "-" + dformat2[1] + "-" + dformat2[0] + " " + hformat2;
    let dataDevolucao = moment(devolucao, 'YYYY-MM-DD HH:mm:ss');
    
    let duration = moment.duration(dataDevolucao.diff(dataAluguel));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes())-hours*60;

    $("#tempo_id").val(hours + ' hour(s) and '+ minutes+' minutes.');
}

function removeLoadingMain(){
    $('#loading-main').hide(); 
    $('#main').show();
}
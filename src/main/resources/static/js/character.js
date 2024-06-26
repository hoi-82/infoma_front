/* 캐릭터 정보 */

const character_base_url = window.location.origin+':8080/api/v1/char/basic/';
const character_level_statistics_url = window.location.origin+':8080/api/v1/statistics/char/level/';
let character_name = null;

let isReadyCharacterInfo = false;
let isReadyLevelInfo = false;
let isReadyEquipmentInfo = false;
let checkId = null;

$(document).ready(function() {
    character_name = $('#input_character_name').val();
    $('.character_loading_pop').addClass('open_pop');

    checkReadyInfo();
    setTotalTimeout();
    searchCharacter(character_name);
    searchEquipment(character_name);
});

$(document).on('click', '#equipment_open', function () {
    $('.equipment_pop').addClass('open_pop');
});

$(document).on('click', '#cash_equipment_open', function () {
    $('.cash_equipment_pop').addClass('open_pop');
});

$(document).on('click', '.popup_close_btn', function() {
    let all_pop = $('.popup');
    $.each(all_pop, function() {
        $(this).removeClass('open_pop');
    });
});

$(document).on('keydown', 'body', function(e) {
    if(e.keyCode == 69 && $('input:focus').attr('name') != 'search_name') {
        if($('.cash_equipment_pop').hasClass('open_pop')) {
            alert('캐시 장비 창이 켜져있습니다.');
            return;
        }
        $('.equipment_pop').toggleClass('open_pop');
    }

    if(e.keyCode == 67 && $('input:focus').attr('name') != 'search_name') {
        if($('.equipment_pop').hasClass('open_pop')) {
            alert('장비 창이 켜져있습니다.');
            return;
        }
        $('.cash_equipment_pop').toggleClass('open_pop');
    }

    if(e.keyCode == 27) {
        $('.popup').removeClass('open_pop');
    }
});

$(document).on('mouseover', '.item_box', function() {
    $(this).children('.item_detail').addClass('item_show');

    // console.log($(window).innerHeight());
    // console.log($(this).offset().top);
});

$(document).on('mouseleave', '.item_box', function() {
    $(this).children('.item_detail').removeClass('item_show');
});

function searchCharacter(character_name) {
    if(character_name == null || character_name == '') {
        alert('캐릭터 명을 검색할 수 없습니다.');
        return;
    }

    $.ajax({
        type: 'GET'
        , headers: json_header
        , url: character_base_url+character_name
        , data: {}
        , success: getCharacterBaseResponse
        , error: getCharacterBaseFail
    });
}

function getCharacterBaseResponse(res) {
    console.log(res);
    if(res.status) {
        const character_basic = res.data.character_basic_information;
        const character_dojang = res.data.dojang_record;
        const character_popularity = res.data.popularity;
        const character_propensity = res.data.propensity;

        $('.character_image').css('background', 'url("'+character_basic.character_image+'") center center no-repeat');
        $('.server_logo').attr('src', window.location.origin+'/vendor/server_logo/'+character_basic.world_name+'.png');

        $('#character_name').html(makeBasicTitle('캐릭터', character_basic.character_name));
        $('#character_class').html(makeBasicTitle('클래스', character_basic.character_class));
        $('#character_guild').html(makeBasicTitle('길드', isNullOrEmptyOrZero(character_basic.character_guild_name) ? '' : character_basic.character_guild_name));
        $('#character_level').html(makeBasicTitle('레벨', character_basic.character_level));
        $('#character_exp').html(makeBasicTitle('경험치', character_basic.character_exp_rate+"%"));

        $('#info_wrap').show();
        isReadyCharacterInfo = true;

        searchLevel(character_name);
    } else {
        getCharacterBaseFail();
    }

}

function makeBasicTitle(type, text) {
    return '<span class="info_title">'+type+' : </span><span class="info_text">'+text+'</span>';
}

function getCharacterBaseFail(e) {
    clearInterval(checkId);
    $('.character_loading_pop').removeClass('open_pop');
    $('.wrap').hide();
    $('#loading_fail_wrap').show();
}

function checkReadyInfo() {
    checkId = setInterval(() => {
        if(isReadyCharacterInfo && isReadyEquipmentInfo && isReadyLevelInfo) {
            clearInterval(checkId);
            $('.character_loading_pop').removeClass('open_pop');

            // 정보 wrap 표출
            $('.character_wrap').fadeIn(500);
            setTimeout(() => {$('.sub_info_tap').fadeIn(200); $('.symbol_wrap').fadeIn(500);}, 400);
            setTimeout(() => {$({val : 0}).animate({val : spent_meso}, {
                duration: 4000
                , easing: 'easeOutQuad'
                , step: function() {
                    $('#symbol_spent').html(numberToStringWithComma(Math.floor(this.val))+' 메소');
                }
                , complete: function() {
                    $('#symbol_spent').html(numberToStringWithComma(Math.floor(this.val))+' 메소');
                }
            })}, 900);
        }
    }, 500);
}

function setTotalTimeout() {
    setTimeout(() => {
        if(!isReadyCharacterInfo || !isReadyEquipmentInfo || !isReadyLevelInfo) {
            getCharacterBaseFail();
        }
    }, 1000*10);
}

function searchLevel(character_name) {
    $.ajax({
        type: 'GET'
        , headers: json_header
        , url: character_level_statistics_url+character_name
        , data: {}
        , success: getCharacterLevelResponse
        , error: getCharacterLevelFail
    });
}

function getCharacterLevelResponse(res) {
    console.log(res);
    if(res.status) {
        if(res.data == null || res.data.length == 0) return;
        let exp_data = [];
        let level_data = [];
        let labels = [];

        for(let i=0; i<res.data.length; i++) {
            exp_data.push(parseFloat(res.data[i].exp_rate));
            level_data.push(res.data[i].level);
            labels.push(res.data[i].date);
        }

        console.log(exp_data);
        console.log(level_data);
        console.log(labels);

        setTitleChart('exp_chart', exp_data, labels, '경험치 : ');
        setTitleChart('level_chart', level_data, labels, '레벨 : ');

        isReadyLevelInfo = true;
    } else {
        getCharacterLevelFail();
    }
}

function getCharacterLevelFail(e) {
    console.log(e);
}

function setTitleChart(chart_id, data, labels, label) {
    const ctx = document.getElementById(chart_id).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar'
        , data : {
            labels : labels
            , datasets: [{
                label: label
                , data: data
            }]
        }
        , options: {
            plugins: {
                legend: {
                    display: false
                }
            }
            , scales: {
                y: {
                   beginAtZero: false
                }
            }
        }
    });
}
/* 메인 쇼트 아이템 */

const short_list_url = window.location.origin+':8080/api/v1/char/short';
const class_1 = '히어로,팔라딘,다크나이트,소울마스터,미하일,블래스터,데몬슬레이어,데몬어벤져,아란,카이저,아델,제로';
const class_2 = '보우마스터,신궁,패스파인더,윈드브레이커,와일드헌터,메르세데스,카인';
const class_3 = '아크메이지(불,독),아크메이지(썬,콜),비숍,플레임위자드,배틀메이지,에반,루미너스,일리움,라라,키네시스';
const class_4 = '나이트로드,섀도어,듀얼블레이더,나이트워커,제논,팬텀,카데나,칼리,호영';
const class_5 = '바이퍼,캡틴,캐논마스터,스트라이커,메카닉,제논,은월,엔젤릭버스터,아크';

$(document).ready(function() {
    getShort(short_list_url);
});

$(document).on('click', '.short_card', function() {
    let character_name = $(this).attr('data-character-name');
    console.log(character_name);
    if(character_name != null && character_name != '') {
        location.href=window.location.origin+'/char/'+character_name;
    }
});

function getShort(url) {
    $.ajax({
        type: 'GET'
        , headers: json_header
        , url: short_list_url
        , data: {}
        , success: getShortResponse
        , error: getShortFail
    });
}

function getShortResponse(res) {
    console.log(res);
    if(res.status) {
        let short_list = '';
        for(let i=0; i<res.data.length; i++) {
            short_list += makeShort(res.data[i]);
        }

        if(short_list == '') {
            short_list = '<span>최근 검색된 캐릭터가 없습니다.</span>';
        }

        $('.short_area').html(short_list);
        if(res.data.length > 6) setShortFlow();
    }
}

function getShortFail(res, status, error) {
    console.log(res);
}

function makeShort(character) {
    const basic = character.character_basic_information;
    const dojang = character.dojang_record;
    const popularity = character.popularity;
    const propensity = character.propensity;

    let short = '';
    short += '<div class="short_card" data-character-name="'
        + basic.character_name
        + '">';
    short += '<div class="short_char_image" style="'+getShortCardColor(basic.character_class)+'">';
    short += '<img src="'+ basic.character_image+'">';
    short += '</div>';
    short += '<span class="short_character_name">'+basic.character_name+'</span>'
    short += '<div class="short_info">';
    short += makeShortOption(basic.character_class, '#5b9bfb');
    short += makeShortOption(basic.character_level+'레벨', '#5b9bfb');
    short += isPropensityAll100(propensity) ? makeShortOption('100 성향', '#5b9bfb') : '';
    short += makeShortOption(dojang.dojang_best_floor+'층', '#5b9bfb');
    short += '</div>';
    short += '</div>';

    return short;
}

function isPropensityAll100(propensity) {
    return propensity.charisma_level == 100 &&
    propensity.charm_level == 100 &&
    propensity.handicraft_level == 100 &&
    propensity.insight_level == 100 &&
    propensity.sensibility_level == 100 &&
    propensity.willingness_level == 100 ? true : false;
}

function makeShortOption(option, color) {
    if(option != null && option != '') return '<span class="short_option" style="background: '+color+'">'+option+'</span>';
    else return '';
}

function setShortFlow() {
    let roller = document.querySelector('.short_area');
    roller.id = 'roller1'; // 아이디부여

    let clone = roller.cloneNode(true);
    clone.id = 'roller2';
    document.querySelector('.short').appendChild(clone);

    roller.classList.add('original');
    clone.classList.add('clone');
}

function getShortCardColor(character_class) {
    if(class_1.indexOf(character_class) >= 0) return 'background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);';
    else if(class_2.indexOf(character_class) >= 0) return '';
    else if(class_3.indexOf(character_class) >= 0) return 'background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);';
    else if(class_4.indexOf(character_class) >= 0) return 'background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);';
    else if(class_5.indexOf(character_class) >= 0) return 'background-image: linear-gradient(45deg, #8baaaa 0%, #ae8b9c 100%);';
    else return '';
}
/* 메인 쇼트 아이템 */

const short_list_url = 'http://localhost:8080/api/v1/char/short';

$(document).ready(function() {getShort(short_list_url)});

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
    short += '<div class="short_char_image">';
    short += '<img src="'+ basic.character_image+'">';
    short += '</div>';
    short += '<div class="short_info">';
    short += makeShortOption(basic.character_class, '#F7AEF8');
    short += makeShortOption(basic.character_level+'레벨', '#B388EB');
    short += isPropensityAll100(propensity) ? makeShortOption('100 성향', '#8093F1') : '';
    short += makeShortOption(dojang.dojang_best_floor+'층', '#72DDF7');
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
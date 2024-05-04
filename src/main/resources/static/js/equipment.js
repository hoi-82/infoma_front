/* 캐릭터 장비 정보 */

const character_equipment_url = window.location.origin+':8080/api/v1/char/equipment/'

const potential_grade_map = {
    4 : 'legend'
    , 3 : 'unique'
    , 2 : 'epic'
    , 1 : 'rare'
}

function searchEquipment(character_name) {
    $.ajax({
        type: 'GET'
        , headers: json_header
        , url: character_equipment_url+character_name
        , data: {}
        , success: getCharacterEquipmentResponse
        , error: getCharacterBaseFail
    });
}

function getCharacterEquipmentResponse(res) {
    console.log(res);
    if(res.status) {
        setCharacterEquipment(res.data.character_item_equipment);
        setAndroidEquipment(res.data.android_equipment);
        setPets(res.data.character_pet_equipment);
        setSymbol(res.data.character_symbol_equipment);

        isReadyEquipmentInfo = true;
    } else {
        getCharacterEquipmentFail();
    }
}

function getCharacterEquipmentFail(e) {
    console.log(e);
}

/*********************************************************************************/
/***********************************장비 설정***************************************/
/*********************************************************************************/
/**
    캐릭터 장비 설정
*/
function setCharacterEquipment(equipment) {
    $.each(equipment.item_equipment, function(idx, item) {
        let slot = '';
        if(item.item_equipment_slot == '모자') slot = 'cap';
        else if(item.item_equipment_slot == '얼굴장식') slot = 'forehead';
        else if(item.item_equipment_slot == '눈장식') slot = 'eye_acc';
        else if(item.item_equipment_slot == '귀고리') slot = 'ear_acc';
        else if(item.item_equipment_slot == '상의') slot = 'clothes';
        else if(item.item_equipment_slot == '하의') slot = 'pants';
        else if(item.item_equipment_slot == '신발') slot = 'shoes';
        else if(item.item_equipment_slot == '장갑') slot = 'gloves';
        else if(item.item_equipment_slot == '망토') slot = 'cape';
        else if(item.item_equipment_slot == '보조무기') slot = 'sub_weapon';
        else if(item.item_equipment_slot == '무기') slot = 'weapon';
        else if(item.item_equipment_slot == '반지1') slot = 'ring';
        else if(item.item_equipment_slot == '반지2') slot = 'ring2';
        else if(item.item_equipment_slot == '반지3') slot = 'ring3';
        else if(item.item_equipment_slot == '반지4') slot = 'ring4';
        else if(item.item_equipment_slot == '펜던트') slot = 'pendant';
        else if(item.item_equipment_slot == '훈장') slot = 'medal';
        else if(item.item_equipment_slot == '벨트') slot = 'belt';
        else if(item.item_equipment_slot == '어깨장식') slot = 'shoulder';
        else if(item.item_equipment_slot == '포켓 아이템') slot = 'poket';
        else if(item.item_equipment_slot == '기계 심장') slot = 'heart';
        else if(item.item_equipment_slot == '뱃지') slot = 'badge';
        else if(item.item_equipment_slot == '엠블렘') slot = 'emblem';
        else if(item.item_equipment_slot == '펜던트2') slot = 'pendant2';

        setItem(slot, item);
    });
}

/**
    캐릭터 장비 > 각 아이템 설정
*/
function setItem(slot, item) {
    if(item == null) return;
    let target = $('#'+slot);
    // 아이템 아이콘
    target.css('background', 'url("'+item.item_icon+'") center center no-repeat');

    // 아이템 잠재능력 등급
    if((item.potential_option_grade != null && item.potential_option_grade != '')
        || (item.additional_potential_option_grade != null && item.additional_potential_option_grade != '')) {
        target.addClass('item_box_potential');
        if(target.hasClass('item_right_empty')) {
            target.removeClass('item_right_empty');
            target.addClass('item_potential_right_empty');
        }
    }

    let potential_grade = getPotentialGrade(item.potential_option_grade);
    let additional_grade = getPotentialGrade(item.additional_potential_option_grade);

    if(potential_grade != 0 || additional_grade != 0) {
        if(potential_grade >= additional_grade) target.addClass('outline_'+potential_grade_map[potential_grade]);
        else target.addClass('outline_'+potential_grade_map[additional_grade]);
    }

    // 아이템 hover 상세
    let item_detail = '<div class="item_detail">';

    // 스타포스
    item_detail += '<div class="starforce">';
    if(item.starforce > 0){
        item_detail += starGenerator(item.starforce, item.starforce_scroll_flag);
    }
    item_detail += '</div>';

    // 아이템 이름
    item_detail += '<div class="item_name">';
    item_detail += '<div class="soul_name">'+renameSoul(item.soul_name)+'</div>';
    item_detail += '<div class="equipment_name">'+item.item_name+scrollUpgrade(item.scroll_upgrade)+'</div>';
    item_detail += '</div>';

    // 아이템 등급
    item_detail += '<div class="item_grade_name">'+itemGrade(item.potential_option_grade)+'</div>'

    // 아이템 아이콘
    let icon_outline = '';
    if(potential_grade != 0) icon_outline = ' outline_'+potential_grade_map[potential_grade];

    item_detail += '<div class="item_icon_wrap"><div class="item_icon'+icon_outline+'">';
    item_detail += '<img class="equipment_icon" src="'+item.item_icon+'" /></div>';
    item_detail += '<div class="item_level">REQ LEV : '+item.item_base_option.base_equipment_level+'</div>'
    item_detail += '</div>';

    // 아이템 옵션
    item_detail += '<div class="item_option">';
    item_detail += '<div>장비분류 : '+item.item_equipment_part+'</div>';
    item_detail += optionGenerator(item.item_total_option, item.item_base_option, item.item_add_option, item.item_etc_option, item.item_starforce_option);
    item_detail += item.special_ring_level == 0 ? '' : '<div style="color: #ad8e00;">[특수 스킬 반지] '+item.item_name+' Lv.'+item.special_ring_level+'</div>';
    item_detail += '</div>';

    // 아이템 잠재능력
    if(potential_grade != 0) {
        item_detail += '<div class="item_potential_option">';
        item_detail += '<div class="potential_option_'+potential_grade_map[potential_grade]+'">잠재옵션</div>';
        item_detail += isNullOrEmptyOrZero(item.potential_option_1) ? '' : '<div>'+item.potential_option_1+'</div>';
        item_detail += isNullOrEmptyOrZero(item.potential_option_2) ? '' : '<div>'+item.potential_option_2+'</div>';
        item_detail += isNullOrEmptyOrZero(item.potential_option_3) ? '' : '<div>'+item.potential_option_3+'</div>';
        item_detail += '</div>';
    }

    // 아이템 에디셔널 잠재능력
    if(additional_grade != 0) {
        item_detail += '<div class="item_potential_option">';
        item_detail += '<div class="potential_option_'+potential_grade_map[additional_grade]+'">에디셔널 잠재옵션</div>';
        item_detail += isNullOrEmptyOrZero(item.additional_potential_option_1) ? '' : '<div>'+item.additional_potential_option_1+'</div>';
        item_detail += isNullOrEmptyOrZero(item.additional_potential_option_2) ? '' : '<div>'+item.additional_potential_option_2+'</div>';
        item_detail += isNullOrEmptyOrZero(item.additional_potential_option_3) ? '' : '<div>'+item.additional_potential_option_3+'</div>';
        item_detail += '</div>';
    }

    // 아이템 익셉셔널 잠재능력
    if(!isNullOrEmptyOrZero(item.item_exceptional_option.attack_power)) {
        item_detail += '<div class="item_potential_option">';
        item_detail += '<div class="potential_option_exceptional">익셉셔널</div>';
        item_detail += '<div>올스텟 : +'+item.item_exceptional_option.str+'</div>';
        item_detail += '<div>최대 HP / 최대 MP : +'+item.item_exceptional_option.max_hp+'</div>';
        item_detail += '<div>공격력 / 마력 : +'+item.item_exceptional_option.attack_power+'</div>';
        item_detail += '</div>';
    }

    if(!isNullOrEmptyOrZero(item.soul_name)) {
        item_detail += '<div class="item_potential_option">';
        item_detail += '<div style="color: #cdb548;">'+item.soul_name+'</div>';
        item_detail += '<div>'+item.soul_option+'</div>'
        item_detail += '</div>';
    }

    item_detail += '</div>';

    target.append(item_detail);

}

/**
    캐릭터 장비 > 각 아이템 설정 > 소울 이름 재설정
*/
function renameSoul(soul_name) {
    return soul_name == null ? '' : soul_name.replace('소울 적용', '');
}

/**
    캐릭터 장비 > 각 아이템 설정 > 장비 명 옆 업그레이드 횟수 설정
*/
function scrollUpgrade(scroll_upgrade) {
    return scroll_upgrade == null || scroll_upgrade == '0' ? '' : ' (+'+scroll_upgrade+')';
}

/**
    캐릭터 장비 > 각 아이템 설정 > 장비 명 및 잠재능력 등급 설정
*/
function itemGrade(potential_option_grade) {
    return potential_option_grade == null || potential_option_grade == '' ? '' : '('+potential_option_grade+' 아이템)';
}

/**
    캐릭터 장비 > 각 아이템 설정 > 스타포스 별 개수 설정
*/
function starGenerator(starforce, scroll_flag) {
    let star = '';

    let starCount = 15;
    let starColor = 'star_color_blue';
    if(scroll_flag == '미사용') {
        starCount = 25;
        starColor = 'star_color';
    }

    for(let i=1; i<=starCount; i++) {
        if(i%5 == 1) star += '<ul class="star_list">';

        if(i <= starforce) star += '<li class="'+starColor+'"></li>';
        else star += '<li class="star"></li>';

        if(i%5 == 0) star += '</ul>';
    }


    return star;
}

/**
    캐릭터 장비 > 각 아이템 설정 > 장비 옵션 설정
*/
function optionGenerator(total, base, add, etc, starforce) {
    let option = '';
    option += optionDetail('STR', total.str, base.str, add.str, etc.str, starforce.str);
    option += optionDetail('DEX', total.dex, base.dex, add.dex, etc.dex, starforce.dex);
    option += optionDetail('INT', total.int, base.int, add.int, etc.int, starforce.int);
    option += optionDetail('LUK', total.luk, base.luk, add.luk, etc.luk, starforce.luk);
    option += optionDetail('최대 HP', total.max_hp, base.max_hp, add.max_hp, etc.max_hp, starforce.max_hp);
    option += optionDetail('최대 HP', total.max_hp_rate, base.max_hp_rate, add.max_hp_rate, etc.max_hp_rate, starforce.max_hp_rate, true);
    option += optionDetail('최대 MP', total.max_mp, base.max_mp, add.max_mp, etc.max_mp, starforce.max_mp);
    option += optionDetail('최대 MP', total.max_mp_rate, base.max_mp_rate, add.max_mp_rate, etc.max_mp_rate, starforce.max_mp_rate, true);
    option += optionDetail('공격력', total.attack_power, base.attack_power, add.attack_power, etc.attack_power, starforce.attack_power);
    option += optionDetail('마력', total.magic_power, base.magic_power, add.magic_power, etc.magic_power, starforce.magic_power);
    option += optionDetail('방어력', total.armor, base.armor, add.armor, etc.armor, starforce.armor);
    option += optionDetail('이동속도', total.speed, base.speed, add.speed, etc.speed, starforce.speed);
    option += optionDetail('점프력', total.jump, base.jump, add.jump, etc.jump, starforce.jump);
    option += optionDetail('보스 몬스터 공격 시 데미지', total.boss_damage, base.boss_damage, add.boss_damage, etc.boss_damage, starforce.boss_damage, true);
    option += optionDetail('몬스터 방어율 무시', total.ignore_monster_armor, base.ignore_monster_armor, add.ignore_monster_armor, etc.ignore_monster_armor, starforce.ignore_monster_armor, true);
    option += optionDetail('데미지', total.damage, base.damage, add.damage, etc.damage, starforce.damage, true);
    option += optionDetail('올스텟', total.all_stat, base.all_stat, add.all_stat, etc.all_stat, starforce.all_stat, true);

    return option;
}

/**
    캐릭터 장비 > 각 아이템 설정 > 장비 옵션 설정 > 각 장비 옵션 생성
*/
function optionDetail(stat, total, base, add, etc, starforce, rate_flag) {
    if(total == '0') return '';
    let rate = '';
    if(rate_flag) rate = '%';

    let detail = '<div>';
    if(total == base) {
        detail += stat+' : +'+total+rate;
    } else {
        detail += '<font class="option_total">'+stat+' : +'+total+rate+'</font>';
        detail += ' ('+base+rate;
        detail += isNullOrEmptyOrZero(add) ? '' : '<font class="option_add"> +'+add+rate+'</font>';
        detail += isNullOrEmptyOrZero(etc) ? '' : '<font class="option_etc"> +'+etc+rate+'</font>';
        detail += isNullOrEmptyOrZero(starforce) ? '' : '<font class="option_starforce"> +'+starforce+'</font>';
        detail += ')';
    }
    detail += '</div>';

    return detail;
}

/**
    잠재능력 등급 넘버링
*/
function getPotentialGrade(grade) {
    let potential_grade = 0;

    if(grade == '레전드리') potential_grade = 4;
    else if(grade == '유니크') potential_grade = 3;
    else if(grade == '에픽') potential_grade = 2;
    else if(grade == '레어') potential_grade = 1;

    return potential_grade;
}

/*********************************************************************************/
/********************************안드로이드 설정*************************************/
/*********************************************************************************/
function setAndroidEquipment(android) {
    if(isNullOrEmptyOrZero(android.android_name)) return;

    // 안드로이드는 아이템 이미지 설정만
    $('#android').css('background', 'url("'+android.android_icon+'") center center no-repeat');
}

/*********************************************************************************/
/***********************************펫 설정****************************************/
/*********************************************************************************/
function setPets(pets) {
    for(let i=1; i<=3; i++) {
        setPet($('#pet'+i), pets['pet_'+i+'_icon'], pets['pet_'+i+'_name'], pets['pet_'+i+'_nickname'], pets['pet_'+i+'_description'], pets['pet_'+i+'_auto_skill']);
        setPetAcc($('#pet'+i+'_acc'), pets['pet_'+i+'_equipment'])
    }
}

function setPet(pet, icon, name, nickname, description, auto_skill) {
    if(isNullOrEmptyOrZero(name)) return '';

    pet.css('background', 'url("'+icon+'") center center no-repeat');

    // 아이템 hover 상세
    let item_detail = '<div class="item_detail">';

    // 아이템 이름
    item_detail += '<div class="item_name">';
    item_detail += '<div class="equipment_name" style="color: #c8ccda;">'+name+'('+nickname+')</div>';
    item_detail += '</div>';

    // 아이템 아이콘
    item_detail += '<div class="item_icon_wrap"><div class="item_icon">';
    item_detail += '<img class="equipment_icon" src="'+icon+'" /></div>';
    item_detail += '<div class="item_level">'+description+'</div>';
    item_detail += '</div>';

    // 오토 스킬
    item_detail += '<div class="item_auto_skill">';
    item_detail += '<div style="margin-bottom: 10px;">장착 오토 스킬</div>';
    for(let i=1; i<=2; i++) {
        if(!isNullOrEmptyOrZero(auto_skill['skill_'+i])) item_detail += '<img style="margin-right: 10px; width:70px;" src="'+auto_skill['skill_'+i+'_icon']+'" />';
    }
    item_detail += '</div>';

    pet.append(item_detail);
}

function setPetAcc(pet_acc, equipment) {
    if(isNullOrEmptyOrZero(equipment) || isNullOrEmptyOrZero(equipment.item_name)) return '';

    pet_acc.css('background', 'url("'+equipment.item_icon+'") center center no-repeat');

    // 아이템 hover 상세
    let item_detail = '<div class="item_detail">';

    // 아이템 이름
    item_detail += '<div class="item_name">';
    item_detail += '<div class="equipment_name" style="color: #c8ccda;">'+equipment.item_name+'</div>';
    item_detail += '</div>';

    // 아이템 아이콘
    item_detail += '<div class="item_icon_wrap"><div class="item_icon">';
    item_detail += '<img class="equipment_icon" src="'+equipment.item_icon+'" /></div>';
    item_detail += '<div class="item_level">REQ LEV : 0</div>';
    item_detail += '</div>';

    // 아이템 옵션
    item_detail += '<div class="item_option">';
    item_detail += '<div>장비분류 : 펫장비</div>';
    if(equipment.item_option != null) {
        for(let i=0; i<equipment.item_option.length; i++) {
            item_detail += '<div>'+equipment.item_option[i].option_type+' : +'+equipment.item_option[i].option_value+'</div>'
        }
        item_detail += '</div>';
    }
    pet_acc.append(item_detail);
}

/*********************************************************************************/
/********************************안드로이드 설정*************************************/
/*********************************************************************************/
let spent_meso = 0;
let symbol_meso = [];
function setSymbol(symbol_equipment) {
    let symbol_arc = '';
    let symbol_act = '';

    if(isNullOrEmptyOrZero(symbol_equipment)) return;

    $.each(symbol_equipment.symbol, function(idx, item) {
        if(item.symbol_name.indexOf('아케인') > -1) symbol_arc += symbolGenerator(item);
        else if(item.symbol_name.indexOf('어센틱') > -1) symbol_act += symbolGenerator(item);

        for(let i=0; i<=19; i++) {
            if(i == 0) symbol_meso.push(0);
            else if(i == 1) symbol_meso.push(getRequiredSymbolMeso(item.symbol_name, i));
            else symbol_meso.push(symbol_meso[i-1]+getRequiredSymbolMeso(item.symbol_name, i));

            if(item.symbol_level-1 == i) spent_meso += symbol_meso[i];
        }
        symbol_meso = [];
    });


    $('#symbol_arc').append(symbol_arc == '' ? '<div>장착된 아케인 심볼이 없습니다.</div>' : symbol_arc);
    $('#symbol_act').append(symbol_act == '' ? '<div>장착된 어센틱 심볼이 없습니다.</div>' : symbol_act);
}

const arc_symbol_required = [0, 12, 27, 47, 74, 110, 157, 217, 292, 384, 495, 627, 782, 962, 1169, 1405, 1672, 1972, 2307, 2679];
const act_symbol_required = [0, 29, 105, 246, 470, 795, 1239, 1820, 2556, 3465, 4565];
const arc_symbol_max_level = 20;
const act_symbol_max_level = 11;

const region_value = {
    '아케인심볼 : 소멸의 여로' : 1
    , '아케인심볼 : 츄츄 아일랜드' : 2
    , '아케인심볼 : 레헬른' : 3
    , '아케인심볼 : 아르카나' : 4
    , '아케인심볼 : 모라스' : 5
    , '아케인심볼 : 에스페라' : 6
    , '어센틱심볼 : 세르니움' : 1
    , '어센틱심볼 : 아르크스' : 2
    , '어센틱심볼 : 오디움' : 3
    , '어센틱심볼 : 도원경' : 4
    , '어센틱심볼 : 아르테리아' : 5
    , '어센틱심볼 : 카르시온' : 6
}

function symbolGenerator(symbol) {
    let symbol_required = [];
    let symbol_max_level = 0;
    if(symbol.symbol_name.indexOf('아케인') > -1) {
        symbol_required = arc_symbol_required;
        symbol_max_level = arc_symbol_max_level;
    }
    else if(symbol.symbol_name.indexOf('어센틱') > -1) {
        symbol_required = act_symbol_required;
        symbol_max_level = act_symbol_max_level;
    }

    let now_symbol_count = symbol_required[symbol.symbol_level-1]+symbol.symbol_growth_count;
    let data_key = Math.random().toString(36).substring(2, 11);

    let symbol_unit = '<div class="symbol_unit">';
    symbol_unit += '<div class="symbol_icon"><img src="'+symbol.symbol_icon+'"/></div>';
    symbol_unit += '<div class="symbol_progress">';
    symbol_unit += '<div class="symbol_progress_proceed" style="width: calc(100% * '+now_symbol_count/symbol_required[symbol_required.length-1]+'"></div>';
    for(let i=0; i<symbol_required.length; i++) {
        symbol_unit += '<div class="symbol_dot" style="margin-left: calc(100% * '+symbol_required[i]/symbol_required[symbol_required.length-1]+')"></div>';
    }
    symbol_unit += '</div>';
    symbol_unit += '<div class="symbol_info">';
    if(symbol.symbol_level == symbol_max_level) {
        symbol_unit += 'MAX';
    } else {
        symbol_unit += 'Lv.'+symbol.symbol_level;
        symbol_unit += '<span class="symbol_arrow symbol_info_down_arrow" symbol-data-key="'+data_key+'" symbol-data-state="down"></span>'
    }
    symbol_unit += '</div>';
    symbol_unit += '</div>';
    symbol_unit += '<div id="symbol_'+data_key+'" class="symbol_analyze">';
    symbol_unit += '<div class="symbol_name">'+symbol.symbol_name+' Lv.'+symbol.symbol_level+(symbol.symbol_level == symbol_max_level ? '' : ' ('+numberToStringWithComma(symbol.symbol_growth_count)+'/'+numberToStringWithComma(symbol.symbol_require_growth_count)+')')+'</div>'
    if(symbol.symbol_level < symbol_max_level) {

        symbol_unit += '<div class="symbol_remain">'+'- 다음 레벨까지 남은 심볼 개수 : '+numberToStringWithComma(minusToZero((symbol_required[symbol.symbol_level]-now_symbol_count)))+' 개</div>';
        symbol_unit += '<div class="symbol_remain_to_max">'+'- 만랩까지 남은 심볼 개수 : '+numberToStringWithComma((symbol_required[symbol_required.length-1]-now_symbol_count))+' 개</div>';
        symbol_unit += '<div class="symbol_remain_to_max">'+'- 다음 레벨 필요 메소 : '+numberToStringWithComma(getRequiredSymbolMeso(symbol.symbol_name, symbol.symbol_level))+' 메소</div>';
        let SymbolMeso = 0;
        for(let i=symbol.symbol_level; i<symbol_max_level; i++) {
            SymbolMeso += getRequiredSymbolMeso(symbol.symbol_name, i);
        }
        symbol_unit += '<div class="symbol_remain_to_max">'+'- 만랩까지 필요 메소 : '+numberToStringWithComma(SymbolMeso)+' 메소</div>';
    }
    symbol_unit += '</div>';

    return symbol_unit;
}

function getRequiredSymbolMeso(symbol_name, symbol_level) {
    if(symbol_level < 1) return 0;

    if(symbol_name.indexOf('아케인') > -1 && symbol_level <= 20) {
        return Math.floor( (Math.pow(symbol_level, 2) + 11) * 2 * ( (region_value[symbol_name]+3) + (symbol_level*0.05) ) ) * 10000;
    }
    else if(symbol_name.indexOf('어센틱') > -1 && symbol_level <= 11) return Math.floor( ( (9 * Math.pow(symbol_level, 2)) + (20 * symbol_level) ) * 1.8 * ( (region_value[symbol_name]+6) - ((symbol_level - 1) / 3)) ) * 100000;
    else return 0;
}

$(document).on('click', '.symbol_arrow', function() {
    let state = $(this).attr('symbol-data-state');
    if(state == 'down') {
        $(this).addClass('symbol_info_up_arrow');
        $(this).removeClass('symbol_info_down_arrow');
        $(this).attr('symbol-data-state', 'up');

        $('#symbol_'+$(this).attr('symbol-data-key')).show();
    } else if(state == 'up') {
        $(this).addClass('symbol_info_down_arrow');
        $(this).removeClass('symbol_info_up_arrow');
        $(this).attr('symbol-data-state', 'down');

        $('#symbol_'+$(this).attr('symbol-data-key')).hide();
    }
});

$(document).on('click', '.open_all_symbol_btn', function () {
    let down = $('.symbol_info_down_arrow');
    $.each(down, function () {
        $(this).click();
    });
});
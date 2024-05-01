/* 캐릭터 정보 */

const character_base_url = 'http://localhost:8080/api/v1/char/basic/'
const character_equipment_url = 'http://localhost:8080/api/v1/char/equipment/'
let character_name = null;

const potential_grade_map = {
    4 : 'legend'
    , 3 : 'unique'
    , 2 : 'epic'
    , 1 : 'rare'
}

$(document).ready(function() {
    character_name = $('#input_character_name').val();
    searchCharacter(character_name);
    searchEquipment(character_name);
});

$(document).on('keydown', 'body', function(e) {
    if(e.keyCode == 69 && $('input:focus').attr('name') != 'search_name') {
        $('.equipment_pop').toggleClass('open_pop');
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

        $('.character_image').css('background', 'url('+character_basic.character_image+') no-repeat');
    } else {
        getCharacterBaseFail();
    }

}

function getCharacterBaseFail(e) {
    console.log(e);
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
    } else {
        getCharacterEquipmentFail();
    }
}

function getCharacterEquipmentFail(e) {
    console.log(e);
}

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

function renameSoul(soul_name) {
    return soul_name == null ? '' : soul_name.replace('소울 적용', '');
}

function scrollUpgrade(scroll_upgrade) {
    return scroll_upgrade == null || scroll_upgrade == '0' ? '' : ' (+'+scroll_upgrade+')';
}

function itemGrade(potential_option_grade) {
    return potential_option_grade == null || potential_option_grade == '' ? '' : '('+potential_option_grade+' 아이템)';
}

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

function optionDetail(stat, total, base, add, etc, starforce, rate_flag) {
    if(total == '0') return '';
    let rate = '';
    if(rate_flag) rate = '%';

    let detail = '<div>';
    if(total == base) {
        detail += stat+' : +'+total+rate;
    } else {
        detail += '<font class="option_total">'+stat+' : +'+total+rate+'</font>';
        detail += ' ('+base;
        detail += isNullOrEmptyOrZero(add) ? '' : '<font class="option_add"> +'+add+'</font>';
        detail += isNullOrEmptyOrZero(etc) ? '' : '<font class="option_etc"> +'+etc+'</font>';
        detail += isNullOrEmptyOrZero(starforce) ? '' : '<font class="option_starforce"> +'+starforce+'</font>';
        detail += ')';
    }
    detail += '</div>';

    return detail;
}

function isNullOrEmptyOrZero(target) {
    return target == null || target == '' || target == '0' || target == 0;
}

function getPotentialGrade(grade) {
    let potential_grade = 0;

    if(grade == '레전드리') potential_grade = 4;
    else if(grade == '유니크') potential_grade = 3;
    else if(grade == '에픽') potential_grade = 2;
    else if(grade == '레어') potential_grade = 1;

    return potential_grade;
}
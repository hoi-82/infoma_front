/* 캐릭터 정보 */

const character_base_url = 'http://localhost:8080/api/v1/char/basic/'
let character_name = null;

$(document).ready(function() {
    character_name = $('#input_character_name').val();
    searchCharacter(character_name);
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
}

function getCharacterBaseFail(e) {
    console.log(e);
}
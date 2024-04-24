$(document).on('keyup', 'input[name="search_name"]', btnSearch);

function btnSearch(e) {
    if(e.keyCode == 13) search();
}

function search() {
    let characterName = $("input[name='search_name']").val();
    if(characterName == null || characterName == '') {
        alert('캐릭터 명을 입력해주세요.');
    } else {
        location.href=window.location.origin + "/char/"+ characterName;
    }
}
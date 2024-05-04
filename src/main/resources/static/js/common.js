/* 공통 JS */
const json_header = {
    'Accept': 'application/json'
    , 'Content-Type': 'application/json;charset=UTF-8'
}

/**
    비어있거나 0인 객체 탐색
*/
function isNullOrEmptyOrZero(target) {
    return target == null || target == '' || target == '0' || target == 0;
}

/**
    숫자 콤마 변경
*/
function numberToStringWithComma(number) {
    return number.toString()
                   .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

/**
    음수 to 0
*/
function minusToZero(number) {
    return number < 0 ? 0 : number;
}
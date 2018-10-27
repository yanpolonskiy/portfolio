/**
 * Проверяет необходимо ли подгрузить фильмы (скролл находится ниже 200 пикселей от низа)
 */

export function isNeedToLoad() {
    let B = document.body; //сокрещание body
    let DE = document.documentElement; //сокращение document.element
    let O = Math.min(B.clientHeight, DE.clientHeight);     // уточнение значения
    if (!O) O = B.clientHeight;
    let S = Math.max(B.scrollTop, DE.scrollTop, window.pageYOffset); //положение скролла
    let C = Math.max(B.scrollHeight, DE.scrollHeight); // высота скролла
    if (O + S < C-200)
    return false;
    return true;
}

/**
 * форматирует вывод числа в строку по 3 знака
 * @param {*} str 
 */
export function formatNum(numToFormat) {
    let numInString = '' + numToFormat;
    numInString = numInString.replace(/(\.(.*))/g, '');
    let charArray = numInString.split('');
    let numInString_temp = '';
    if (numInString.length > 3) {
        for (let i = charArray.length - 1, j = 1; i >= 0; i--, j++) {
            numInString_temp = charArray[i] + numInString_temp;
            if (j % 3 == 0) {
                numInString_temp = ' ' + numInString_temp;
            }
        }
        return numInString_temp;
    } else {
        return numInString;
    }
}

/**
 * отключает скролл
 */

export function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

/**
 * Включает скролл
 */

export function enableScrolling(){
    window.onscroll=function(){};
}


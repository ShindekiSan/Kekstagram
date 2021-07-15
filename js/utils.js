'use strict';

(function () {
    const ESC_KEYCODE = 27;
    const ENTER_KEYCODE = 13;

    window.utils = {
        getRandomInteger: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomElementFromList: function(list) {
            return list[utils.getRandomInteger(0, list.length - 1)];
        },
        removeElementsFromList: function(list) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            };
        },
        isEscKeycode: function(evt) {
            return evt.keyCode === ESC_KEYCODE;
        },
        isEnterKeycode: function(evt) {
            return evt.keyCode === ENTER_KEYCODE;
        },
    }
})();
'use strict';

(function () {
    const ESC_KEY = 'Escape';
    const ENTER_KEY = 'Enter';
    const DEBOUNCE_INTERVAL = 500;
    let lastTimeout = null;

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
        isEscKey: function(evt, callback) {
            if (evt.key === ESC_KEY) {
                evt.preventDefault();
                callback();
            }
        },
        isEnterKey: function(evt, callback) {
            if (evt.key === ENTER_KEY) {
                callback();
            }
        },
        debounce: function(action) {
            if (lastTimeout) {
                clearTimeout(lastTimeout);
            };
            
            lastTimeout = setTimeout(action, DEBOUNCE_INTERVAL);
        },
    }
})();
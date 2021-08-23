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

            lastTimeout = setTimeout(action, DEBOUNCE_INTERVAL)
        },
        renderPhoto: (template, photoInfo) => {
            const photosElement = template.cloneNode(true);
            photosElement.querySelector('.picture__img').setAttribute('src', photoInfo.url);
            photosElement.querySelector('.picture__likes').textContent = photoInfo.likes;
            photosElement.querySelector('.picture__comments').textContent = photoInfo.comments.length;
            return photosElement;
        },
        appendPhotos: (template, photosList, photosInfo) => {
            const photosFragment = document.createDocumentFragment();

            photosInfo.forEach((elem, index) => {
                const renderedPicture = window.utils.renderPhoto(template, elem);
                renderedPicture.dataset.number = index;

            photosFragment.appendChild(renderedPicture);
            });

            photosList.appendChild(photosFragment);
        },
    }
})();
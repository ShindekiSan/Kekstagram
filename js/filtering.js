'use strict';

(function () {
    const NEW_PHOTOS_COUNT = 10;
    const SPLICE_LENGTH = 1;
    const filters = document.querySelector('.img-filters');
    const filterButtons = filters.querySelectorAll('.img-filters__button');
    const popularPhotosFilter = document.querySelector('#filter-popular');
    const newPhotosFilter = document.querySelector('#filter-new');
    const discussedPhotosFilter = document.querySelector('#filter-discussed');
    
    filters.classList.remove('img-filters--inactive');

    const buttonId = {
        POPULAR: popularPhotosFilter.id,
        DISCUSSED: discussedPhotosFilter.id,
        NEW: newPhotosFilter.id,
    };

    const Filter = {
        POPULAR: function(photos) {
            return photos;
        },
        DISCUSSED: function () {
            const localPhotosCopy = [...window.photos];
            localPhotosCopy.sort((a,b) => b.comments.length > a.comments.length ? 1 : -1);
            return localPhotosCopy;
        },
        NEW: function () {
            const localPhotosCopy = [...window.photos];
            let newPhotosList = [];
            while (newPhotosList.length < NEW_PHOTOS_COUNT) {
                let randomElement = window.utils.getRandomElementFromList(localPhotosCopy);
                let photo = localPhotosCopy.splice(randomElement.id, SPLICE_LENGTH);
                newPhotosList = newPhotosList.concat(photo);
            }
            return newPhotosList;
        },
    };

    const clearActiveButton = () => {
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove('img-filters__button--active');
        });
    };

    window.filterPhotos = (clickedButtonId) => {
        let filteredPhotos = [];

        clearActiveButton();

        switch (clickedButtonId) {
            case buttonId.POPULAR:
                filteredPhotos = [...Filter.POPULAR(window.photos)]; 
                break;
            case buttonId.DISCUSSED:
                filteredPhotos = [...Filter.DISCUSSED(window.photos)];
                break;
            case buttonId.NEW:
                filteredPhotos = [...Filter.NEW(window.photos)];
                break;
        };
        return filteredPhotos;
    };
})();

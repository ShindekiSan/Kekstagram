'use strict';

(function () {
    const NEW_PHOTOS_COUNT = 10;
    const SPLICE_LENGTH = 1;
    const filters = document.querySelector('.img-filters');
    const filterButtons = filters.querySelectorAll('.img-filters__button');
    
    filters.classList.remove('img-filters--inactive');

    const buttonId = {
        POPULAR: 'filter-popular',
        DISCUSSED: 'filter-discussed',
        NEW: 'filter-new',
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
            const newPhotosList = [];
            while (newPhotosList.length < NEW_PHOTOS_COUNT) {
                let randomElementIndex = window.utils.getRandomInteger(0, localPhotosCopy.length - 1);
                newPhotosList.push(localPhotosCopy.splice(randomElementIndex, SPLICE_LENGTH)[0]);
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
        return filteredPhotos
    };

        
    const onFilterButtonClick = (evt) => {
        const photos = window.filterPhotos(evt.target.id);
        evt.target.classList.add('img-filters__button--active');
        window.utils.debounce(() => window.appendPhotos(photos));
    };
    
    const setFilterButtonsEventListeners = () => {
        filterButtons.forEach((button) => {
            button.addEventListener('click', onFilterButtonClick);
        });
    };

    setFilterButtonsEventListeners();
})();

'use strict';

(function () {
    const NEW_PHOTOS_COUNT = 10;
    const filterButtons = document.querySelectorAll('.img-filters__button');
    const popularPhotosFilter = document.querySelector('#filter-popular');
    const newPhotosFilter = document.querySelector('#filter-new');
    const discussedPhotosFilter = document.querySelector('#filter-discussed');
    const photosList = document.querySelector('.pictures');

    const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

    const filtering = {
        popularPhotos: function(photos) {
            window.utils.appendPhotos(photosListElementTemplate, photosList, photos)
        },
        discussedPhotos: function (photos) {
            let localPhotosCopy = [];
            localPhotosCopy = localPhotosCopy.concat(photos);
            localPhotosCopy.sort((a,b) => b.comments.length > a.comments.length ? 1 : -1)
            return localPhotosCopy
        },
        newPhotos: function (photos) {
            const newPhotosList = [];
            while (newPhotosList.length < NEW_PHOTOS_COUNT) {
                let photo = window.utils.getRandomElementFromList(photos);
                if (newPhotosList.indexOf(photo) === -1) {
                    newPhotosList.push(photo);
                };
            };
            return newPhotosList
        },
    };

    const clearActiveButton = () => {
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove('img-filters__button--active');
        });
    };

    const removePhotosFromPage = () => {
        document.querySelectorAll('.picture').forEach((miniature) => {
            miniature.parentNode.removeChild(miniature);
        });
    }

    const filterPhotos = (clickedButtonId) => {
        let filteredPhotos = [];

        clearActiveButton();
        removePhotosFromPage();

        switch (clickedButtonId) {
            case popularPhotosFilter.id:
                filtering.popularPhotos(window.downloadedPhotosCopy);
                popularPhotosFilter.classList.add('img-filters__button--active'); 
                break;
            case discussedPhotosFilter.id:
                filteredPhotos = filteredPhotos.concat(filtering.discussedPhotos(window.downloadedPhotosCopy));
                window.utils.appendPhotos(photosListElementTemplate, photosList, filteredPhotos);
                discussedPhotosFilter.classList.add('img-filters__button--active');
                break;
            case newPhotosFilter.id:
                filteredPhotos = filteredPhotos.concat(filtering.newPhotos(window.downloadedPhotosCopy));
                window.utils.appendPhotos(photosListElementTemplate, photosList, filteredPhotos);
                newPhotosFilter.classList.add('img-filters__button--active');
                break;
        };
    };

    const onFilterButtonClick = (evt) => {
        window.utils.debounce(filterPhotos(evt.target.id));
    };

    for (let i=0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', onFilterButtonClick);
    };
})();
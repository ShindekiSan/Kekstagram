'use strict';

(function () {
    let bigPicturePhotoIndex = 0;
    
    let photos = [];

    const filterButtons = document.querySelectorAll('.img-filters__button');

    // User photos miniatures

    const photosList = document.querySelector('.pictures');
    const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // Show photos 
    
    const getPhotos = async (callback) => {
        let promise = window.backend.downloadData(window.downloadHandlers.SUCCESS, window.downloadHandlers.ERROR);
        let result = await promise;
        photos = photos.concat(result);
        callback();
    };

    const removePhotosFromPage = () => {
        document.querySelectorAll('.picture').forEach((miniature) => {
            miniature.remove();
        });
    };

    const renderPhoto = (template, photoInfo) => {
        const photosElement = template.cloneNode(true);
        photosElement.querySelector('.picture__img').setAttribute('src', photoInfo.url);
        photosElement.querySelector('.picture__likes').textContent = photoInfo.likes;
        photosElement.querySelector('.picture__comments').textContent = photoInfo.comments.length;
        return photosElement;
    };
    
    const setPhotoEventListeners = () => {
        photosList.querySelectorAll('.picture').forEach((miniature) => {
            miniature.addEventListener('click', onPhotosListElementClick);
            miniature.addEventListener('keydown', onPhotosListElementEnterPress);
        });
    };

    const onPhotosListElementClick = (evt) => {
        window.showBigPicture(photos[evt.target.parentNode.dataset.number]);
        evt.target.parentNode.blur();
    };

    const onPhotosListElementEnterPress = (evt) => {
        window.utils.isEnterKey(evt, () => {
            window.showBigPicture(photos[evt.target.dataset.number]);
            evt.target.blur();
        });      
    };

    const appendPhotos = () => {
        const photosFragment = document.createDocumentFragment();

        removePhotosFromPage();

        photos.forEach((elem, index) => {
            const renderedPicture = renderPhoto(photosListElementTemplate, elem);
            renderedPicture.dataset.number = index;

            photosFragment.appendChild(renderedPicture);
        });

        photosList.appendChild(photosFragment);
        
        setPhotoEventListeners();
    };

    
    // show filtered photos
    
    const onFilterButtonClick = (evt) => {
        photos = window.filterPhotos(evt.target.id);
        evt.target.classList.add('img-filters__button--active');
        window.utils.debounce(appendPhotos);
    };
    
    const setFilterButtonsEventListeners = () => {
        filterButtons.forEach((button) => {
            button.addEventListener('click', onFilterButtonClick);
        });
    };
    
    getPhotos(appendPhotos);
    setFilterButtonsEventListeners();
})();

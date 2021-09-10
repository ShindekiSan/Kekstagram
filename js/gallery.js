'use strict';

(function () {
    
    let photos = [];

    // User photos miniatures

    const photosList = document.querySelector('.pictures');
    const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // Show photos 

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

    window.appendPhotos = (photosData) => {
        const photosFragment = document.createDocumentFragment();

        removePhotosFromPage();

        photosData.forEach((elem, index) => {
            const renderedPicture = renderPhoto(photosListElementTemplate, elem);
            renderedPicture.dataset.number = index;

            photosFragment.appendChild(renderedPicture);
        });

        photosList.appendChild(photosFragment);
        
        setPhotoEventListeners();
    };

    const getPhotos = async () => {
        const promise = window.backend.downloadData(window.downloadHandlers.SUCCESS, window.downloadHandlers.ERROR);
        const result = await promise;
        photos = photos.concat(result);
        window.appendPhotos(photos);
    };
    
    getPhotos();
})();

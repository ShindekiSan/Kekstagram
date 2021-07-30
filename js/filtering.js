'use strict';

(function () {
    const NEW_PHOTOS_COUNT = 10;

    window.filtering = {
        popularPhotos: function(photos) {
            photos.sort((a,b) => a.id > b.id ? 1 : -1);
            return photos
        },
        discussedPhotos: function (photos) {
            photos.sort((a,b) => b.comments.length > a.comments.length ? 1 : -1)
            return photos
        },
        newPhotos: function (photos) {
            const newPhotosList = [];
            const newPhotosIdList = [];
            let photo = window.utils.getRandomElementFromList(photos);
            newPhotosIdList.push(photo.id)
            newPhotosList.push(photo);
            while (newPhotosList.length < NEW_PHOTOS_COUNT) {
                photo = window.utils.getRandomElementFromList(photos);
                if (newPhotosIdList.indexOf(photo.id) === -1) {
                    newPhotosList.push(photo);
                    newPhotosIdList.push(photo.id);
                } 
            }
            return newPhotosList
        }
    }
})();
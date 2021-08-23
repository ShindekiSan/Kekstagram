'use strict';

(function () {
    window.downloadedPhotosCopy = [];
    
    const MIN_AVATAR_NUMBER = 1;
    const MAX_AVATAR_NUMBER = 6;
    const BIG_PICTURE_COMMENTS_COUNT = 5;
    const BIG_PICTURE_NEW_COMMENTS_COUNT = 5;

    let photos = [];

    let bigPicturePhotoIndex = 0;

    const photoBigPicture = document.querySelector('.big-picture');
    const socialCommentsSection = photoBigPicture.querySelector('.social__comments');
    const socialPhotoDescription = photoBigPicture.querySelector('.social__header');
    const socialComment = socialCommentsSection.querySelector('.social__comment');
    const bigPictureCloseButton = photoBigPicture.querySelector('.big-picture__cancel');
    const socialCommentsAmount = photoBigPicture.querySelector('.social__comment-count');
    const socialCommentsLoader = photoBigPicture.querySelector('.social__comments-loader');
    
    const photosFilters = document.querySelector('.img-filters');

    const errorTemplate = document.querySelector('#error').content.querySelector('.error');

    // User photos miniatures

    const photosList = document.querySelector('.pictures');
    const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // Show photos 

    const onPhotosListElementClick = (evt) => {
        bigPicturePhotoIndex = evt.target.parentNode.dataset.number;
        showBigPicture();
        evt.target.parentNode.blur();
    };

    const onPhotosListElementEnterPress = (evt) => {
        window.utils.isEnterKey(evt, () => {
            bigPicturePhotoIndex = evt.target.dataset.number;
            showBigPicture();
            evt.target.blur();
        });      
    };


    const onErrorHandlerTryAgainButtonClick = () => {
        document.location.reload();
    }

    const successHandler = (photosData) => {
        photos = photos.concat(photosData);
        window.utils.appendPhotos(photosListElementTemplate, photosList, photos);

        photosList.querySelectorAll('.picture').forEach((photo) => {
            photo.addEventListener('click', onPhotosListElementClick);
            photo.addEventListener('keydown', onPhotosListElementEnterPress)
        });

        window.downloadedPhotosCopy = window.downloadedPhotosCopy.concat(photos);
        photosFilters.classList.remove('img-filters--inactive');
    };

    const errorHandler = (errorMessage) => {
        const errorNode = errorTemplate.cloneNode(true);
        errorNode.querySelector('.error__title').textContent = errorMessage;
        document.querySelector('main').insertAdjacentElement('afterbegin', errorNode);

        document.querySelectorAll('.error__button')[0].addEventListener('click', onErrorHandlerTryAgainButtonClick);
        document.querySelectorAll('.error__button')[1].classList.add('hidden');
    };

    window.backend.downloadData(successHandler, errorHandler);

    // User photo big picture

    const showBigPicture = () => {

        // Big picture

        photoBigPicture.classList.remove('hidden');
        photoBigPicture.querySelector('.big-picture__img img').src = photos[bigPicturePhotoIndex].url;
        photoBigPicture.querySelector('.likes-count').textContent = photos[bigPicturePhotoIndex].likes;

        let commentsAmount = photos[bigPicturePhotoIndex].comments.length;
        if (photos[bigPicturePhotoIndex].comments.length <= BIG_PICTURE_COMMENTS_COUNT) {
            socialCommentsAmount.textContent = `${commentsAmount} из ${commentsAmount} комментариев`;
            socialCommentsLoader.classList.add('hidden');
        } else {
            socialCommentsAmount.textContent = `${BIG_PICTURE_COMMENTS_COUNT} из ${commentsAmount} комментариев`;
            socialCommentsLoader.classList.remove('hidden');
        }

        const showSocialComment = (photoComment, commentsSection) => {
            const newSocialComment = socialComment.cloneNode(true);
            newSocialComment.querySelector('.social__picture').src = photoComment.avatar;
            newSocialComment.querySelector('.social__text').textContent = photoComment.message;
            commentsSection.appendChild(newSocialComment);
        }

        // Photo Description

        socialPhotoDescription.querySelector('.social__picture').src = `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)}.svg`;
        socialPhotoDescription.querySelector('.social__caption').textContent = photos[bigPicturePhotoIndex].description;

        // Remove HTML Comments

        window.utils.removeElementsFromList(socialCommentsSection);

        let maxCommentNumber = Math.min(photos[bigPicturePhotoIndex].comments.length, BIG_PICTURE_COMMENTS_COUNT);
        for (let i=0; i < maxCommentNumber; i++) {
            showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
        };

        // In case where photo has more than 5 comments

        let currentCommentIndex = BIG_PICTURE_COMMENTS_COUNT;
        let maxCommentIndex = Math.min(currentCommentIndex + BIG_PICTURE_NEW_COMMENTS_COUNT, commentsAmount);
        const onSocialCommentsLoaderClick = () => {
            for (let i = currentCommentIndex; i < maxCommentIndex; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };

            currentCommentIndex = maxCommentIndex;
            socialCommentsAmount.textContent = `${currentCommentIndex} из ${commentsAmount} комментариев`;

            maxCommentIndex = Math.min(currentCommentIndex + BIG_PICTURE_NEW_COMMENTS_COUNT, commentsAmount);
            if (currentCommentIndex === commentsAmount) {
                socialCommentsLoader.classList.add('hidden');
            }
        };

        const closeBigPicture = () => {
            photoBigPicture.classList.add('hidden');
    
            socialCommentsLoader.removeEventListener('click', onSocialCommentsLoaderClick);
            document.removeEventListener('keypress', onBigPictureEscPress);
            bigPictureCloseButton.removeEventListener('click', onBigPictureCloseButtonClick);
        };
    
        const onBigPictureCloseButtonClick = () => {
            closeBigPicture();
        }
    
        const onBigPictureEscPress = (evt) => {
            window.utils.isEscKey(evt, closeBigPicture);
        };

        socialCommentsLoader.addEventListener('click', onSocialCommentsLoaderClick);
        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };
})();
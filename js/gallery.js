'use strict';

(function () {
    const COMMENTS = [
        'Всё отлично!',
        'В целом всё неплохо. Но не всё.',
        'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
        'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
        'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
        'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
    ];
    
    const DESCRIPTION = [
        'Тестим новую камеру!',
        'Затусили с друзьями на море',
        'Как же круто тут кормят',
        'Отдыхаем...',
        'Цените каждое мгновенье. Цените тех, кто рядом с вами',
        'и отгоняйте все сомненья. Не обижайте всех словами......',
        'Вот это тачка!',
    ];
    
    const NAMES = ['Владимир', 'Катя', 'Настя', 'Макс', 'Кирилл', 'Ришард', 'Адольф'];

    const MIN_AVATAR_NUMBER = 1;
    const MAX_AVATAR_NUMBER = 6;
    const PHOTOS_COUNT = 25;
    const BIG_PICTURE_COMMENTS_COUNT = 5;

    const photos = [];
    let bigPicturePhotoIndex = 0;

    // User photos miniatures

    const createPhotosList = () => {
        const photosList = document.querySelector('.pictures');
        const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

        // Show photos

        const renderPhoto = (photoInfo) => {
            photosListElementTemplate.querySelector('.picture__img').setAttribute('src', photoInfo.url);
            photosListElementTemplate.querySelector('.picture__likes').textContent = photoInfo.likes;
            photosListElementTemplate.querySelector('.picture__comments').textContent = photoInfo.comments.length;
            let photosElement = photosListElementTemplate.cloneNode(true);
            return photosElement;
        };

        const successHandler = (photosData) => {
            const photosFragment = document.createDocumentFragment();

            for (let i=0; i < PHOTOS_COUNT; i++) {
                photosFragment.appendChild(renderPhoto(photosData[i]));
                photos.push(photosData[i]);
            };

            photosList.appendChild(photosFragment);
        };

        const errorHandler = (errorMessage) => {
            let errorNode = document.createElement('div');
            errorNode.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red';
            errorNode.style.position = 'absolute';
            errorNode.style.left = 0;
            errorNode.style.right = 0;
            errorNode.style.fontSize = '20px';

            errorNode.textContent = errorMessage;
            document.body.insertAdjacentElement('afterbegin',errorNode);

            console.log(errorMessage);
        };

        window.serverRequests.downloadData(successHandler, errorHandler);

        // Show big picture

        const onPhotosListElementClick = (evt) => {
            for (let i=0; i < PHOTOS_COUNT; i++) {
                if (evt.target.getAttribute('src') === photos[i].url) {
                    bigPicturePhotoIndex = i;
                    showBigPicture();
                    evt.target.parentNode.blur();
                };
            };
        };

        const onPhotosListElementEnterPress = (evt) => {
            if (window.utils.isEnterKeycode(evt) && evt.target.tagName === 'A') {  
                for (let i=0; i < PHOTOS_COUNT; i++) {
                    if (evt.target.firstElementChild.getAttribute('src') === photos[i].url) {
                        bigPicturePhotoIndex = i;
                        showBigPicture();
                        evt.target.blur();
                    };
                };
            };  
        };

        photosList.addEventListener('click', onPhotosListElementClick);
        photosList.addEventListener('keydown', onPhotosListElementEnterPress);
    };   

    // User photo big picture

    const photoBigPicture = document.querySelector('.big-picture');
    const socialCommentsSection = document.querySelector('.social__comments');
    const socialPhotoDescription = document.querySelector('.social__header');
    const socialComment = document.querySelector('.social__comment');
    const bigPictureCloseButton = document.querySelector('.big-picture__cancel');

    const closeBigPicture = () => {
        photoBigPicture.classList.add('hidden');

        document.removeEventListener('keypress', onBigPictureEscPress);
        bigPictureCloseButton.removeEventListener('click', onBigPictureCloseButtonClick);
    };

    const onBigPictureCloseButtonClick = () => {
        closeBigPicture();
    }

    const onBigPictureEscPress = (evt) => {
        if (window.utils.isEscKeycode(evt)) {
            closeBigPicture();
        };
    };

    const showBigPicture = () => {
        // Big picture

        photoBigPicture.classList.remove('hidden');
        photoBigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', photos[bigPicturePhotoIndex].url);
        photoBigPicture.querySelector('.likes-count').textContent = photos[bigPicturePhotoIndex].likes;
        photoBigPicture.querySelector('.comments-count').textContent = photos[bigPicturePhotoIndex].comment;

        // Hide comments count and loader

        document.querySelector('.social__comment-count').classList.add('visually-hidden');
        document.querySelector('.comments-loader').classList.add('visually-hidden');

        // Photo Description

        socialPhotoDescription.querySelector('.social__picture').setAttribute('src', `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)}.svg`);
        socialPhotoDescription.querySelector('.social__caption').textContent = photos[bigPicturePhotoIndex].description;

        // Remove HTML Comments

        window.utils.removeElementsFromList(socialCommentsSection);

        // Comments

        const showSocialComment = (photoComment, commentsSection) => {
            let newSocialComment = socialComment.cloneNode(true);
            newSocialComment.querySelector('.social__picture').setAttribute('src', photoComment.avatar);
            newSocialComment.querySelector('.social__text').textContent = photoComment.message;
            commentsSection.appendChild(newSocialComment);
        }

        if (photos[bigPicturePhotoIndex].comments.length > BIG_PICTURE_COMMENTS_COUNT) {
            for (let i=0; i < BIG_PICTURE_COMMENTS_COUNT; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };
        } else {
            for (let i=0; i < photos[bigPicturePhotoIndex].comments.length; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };
        };
        
        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };

    createPhotosList();

})();
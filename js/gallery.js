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
    const DEBOUNCE_INTERVAL = 500;

    const photos = [];
    let bigPicturePhotoIndex = 0;

    const photoBigPicture = document.querySelector('.big-picture');
    const socialCommentsSection = document.querySelector('.social__comments');
    const socialPhotoDescription = document.querySelector('.social__header');
    const socialComment = document.querySelector('.social__comment');
    const bigPictureCloseButton = document.querySelector('.big-picture__cancel');
    const socialCommentsAmount = document.querySelector('.social__comment-count')
    const socialCommentsCount = document.querySelector('.comments-count');
    const socialCommentsLoader = document.querySelector('.social__comments-loader');

    const photosFilters = document.querySelector('.img-filters');
    const popularPhotosFilter = document.querySelector('#filter-popular');
    const newPhotosFilter = document.querySelector('#filter-new');
    const discussedPhotosFilter = document.querySelector('#filter-discussed');

    // User photos miniatures

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

    const appendPhotos = (photosInfo) => {
        const photosFragment = document.createDocumentFragment();

        for (let i=0; i < photosInfo.length; i++) {
            photosFragment.appendChild(renderPhoto(photosInfo[i]));
        };

        photosList.appendChild(photosFragment);
    }

    const successHandler = (photosData) => {
        for (let i=0; i < PHOTOS_COUNT; i++) {
            photos.push(photosData[i]);
        }
        appendPhotos(photos);
        photosFilters.classList.remove('img-filters--inactive');
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

    window.backend.downloadData(successHandler, errorHandler);

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

    // User photo big picture

    const showBigPicture = () => {

        // Big picture

        photoBigPicture.classList.remove('hidden');
        photoBigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', photos[bigPicturePhotoIndex].url);
        photoBigPicture.querySelector('.likes-count').textContent = photos[bigPicturePhotoIndex].likes;
        let commentsAmount = photos[bigPicturePhotoIndex].comments.length;
        if (photos[bigPicturePhotoIndex].comments.length <= 5) {
            socialCommentsAmount.textContent = `${commentsAmount} из ${commentsAmount} комментариев`;
            socialCommentsLoader.classList.add('hidden');
        } else {
            socialCommentsAmount.textContent = `${BIG_PICTURE_COMMENTS_COUNT} из ${commentsAmount} комментариев`;
            if (socialCommentsLoader.classList.contains('hidden')) {
                socialCommentsLoader.classList.remove('hidden');
            }
        }

        const showSocialComment = (photoComment, commentsSection) => {
            let newSocialComment = socialComment.cloneNode(true);
            newSocialComment.querySelector('.social__picture').setAttribute('src', photoComment.avatar);
            newSocialComment.querySelector('.social__text').textContent = photoComment.message;
            commentsSection.appendChild(newSocialComment);
        }

        // Photo Description

        socialPhotoDescription.querySelector('.social__picture').setAttribute('src', `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)}.svg`);
        socialPhotoDescription.querySelector('.social__caption').textContent = photos[bigPicturePhotoIndex].description;

        // Remove HTML Comments

        window.utils.removeElementsFromList(socialCommentsSection);

        if (photos[bigPicturePhotoIndex].comments.length > BIG_PICTURE_COMMENTS_COUNT) {
            for (let i=0; i < BIG_PICTURE_COMMENTS_COUNT; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };
        } else {
            for (let i=0; i < photos[bigPicturePhotoIndex].comments.length; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };
        };

        
        const loadComments = (commentsNumber) => {
            for (let i = BIG_PICTURE_COMMENTS_COUNT; i < commentsNumber; i++) {
                showSocialComment(photos[bigPicturePhotoIndex].comments[i], socialCommentsSection);
            };
        };

        const onSocialCommentsLoaderClick = () => {
            loadComments(commentsAmount);
            socialCommentsLoader.classList.add('hidden');
            socialCommentsAmount.textContent = `${commentsAmount} из ${commentsAmount} комментариев`;
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
            if (window.utils.isEscKeycode(evt)) {
                closeBigPicture();
            };
        };

        socialCommentsLoader.addEventListener('click', onSocialCommentsLoaderClick);
        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };

    const filterPhotos = (filteredPhotos) => {
        document.querySelectorAll('.picture').forEach((c) => {
            c.parentNode.removeChild(c);
        });

        appendPhotos(filteredPhotos);
    }
    
    const discussedPhotosFiltering = () => {
        filterPhotos(window.filtering.discussedPhotos(photos));
        discussedPhotosFilter.classList.add('img-filters__button--active');

        if (popularPhotosFilter.classList.contains('img-filters__button--active')) {
            popularPhotosFilter.classList.remove('img-filters__button--active');
        } else if (newPhotosFilter.classList.contains('img-filters__button--active')) {
            newPhotosFilter.classList.remove('img-filters__button--active');
        }
    }
    
    const popularPhotosFiltering = () => {
        filterPhotos(window.filtering.popularPhotos(photos));
        popularPhotosFilter.classList.add('img-filters__button--active');

        if (discussedPhotosFilter.classList.contains('img-filters__button--active')) {
            discussedPhotosFilter.classList.remove('img-filters__button--active');
        } else if (newPhotosFilter.classList.contains('img-filters__button--active')) {
            newPhotosFilter.classList.remove('img-filters__button--active');
        }
    }

    const newPhotosFiltering = () => {
        filterPhotos(window.filtering.newPhotos(photos));
        newPhotosFilter.classList.add('img-filters__button--active');

        if (discussedPhotosFilter.classList.contains('img-filters__button--active')) {
            discussedPhotosFilter.classList.remove('img-filters__button--active');
        } else if (popularPhotosFilter.classList.contains('img-filters__button--active')) {
            popularPhotosFilter.classList.remove('img-filters__button--active');
        }
    }

    const onDiscussedPhotosButtonClick = () => {
        discussedPhotosFiltering();
    }

    const onNewPhotosButtonClick = () => {
        newPhotosFiltering();
    }

    const onPopularPhotosButtonClick = () => {
        popularPhotosFiltering()
    }

    popularPhotosFilter.addEventListener('click', window.utils.debounce(DEBOUNCE_INTERVAL, onPopularPhotosButtonClick));
    newPhotosFilter.addEventListener('click', window.utils.debounce(DEBOUNCE_INTERVAL, onNewPhotosButtonClick));
    discussedPhotosFilter.addEventListener('click', window.utils.debounce(DEBOUNCE_INTERVAL, onDiscussedPhotosButtonClick));
})();
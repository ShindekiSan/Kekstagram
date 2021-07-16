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

    const MIN_LIKES_COUNT = 15;
    const MAX_LIKES_COUNT = 200;
    const MIN_COMMENTS_COUNT = 6;
    const MAX_COMMENTS_COUNT = 15;
    const MIN_AVATAR_COUNT = 1;
    const MAX_AVATAR_COUNT = 6;
    const PHOTOS_COUNT = 25;
    const BIG_PICTURE_COMMENTS_COUNT = 5;

    const photos = [];
    const socialComments = [];

    let bigPicturePhotoIndex = 0;

    // User photos miniatures

    const generateSocialComments = (photoIndex) => {
        const maxCommentsAmount = window.utils.getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

    var photoComments = [];
        for (let i=0; i < maxCommentsAmount; i++) {
            photoComments.push({
                index: photoIndex,
                avatar: `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
                text: window.utils.getRandomElementFromList(COMMENTS),
                name: window.utils.getRandomElementFromList(NAMES),
            });
        };
        socialComments.push(photoComments);
        return maxCommentsAmount;
    };

    const createPhotosList = () => {
        const photosFragment = document.createDocumentFragment();
        const photosList = document.querySelector('.pictures');
        const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

        // Generate photos
    
        for (let i=0; i < PHOTOS_COUNT; i++) {
            photos.push({
                url: `photos/${i+1}.jpg`,
                likes: window.utils.getRandomInteger(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
                comments: generateSocialComments(i),
                authorAvatar: `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
                description: window.utils.getRandomElementFromList(DESCRIPTION),
            });
        };

        // Show photos

        for(let i=0; i < photos.length; i++) {
            photosListElementTemplate.querySelector('.picture__img').setAttribute('src', photos[i].url);
            photosListElementTemplate.querySelector('.picture__likes').textContent = photos[i].likes;
            photosListElementTemplate.querySelector('.picture__comments').textContent = photos[i].comments;
            let photosElement = photosListElementTemplate.cloneNode(true);
            photosFragment.appendChild(photosElement);
        };

        photosList.appendChild(photosFragment);

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

        socialPhotoDescription.querySelector('.social__picture').setAttribute('src', photos[bigPicturePhotoIndex].authorAvatar);
        socialPhotoDescription.querySelector('.social__caption').textContent = photos[bigPicturePhotoIndex].description;

        // Remove HTML Comments

        window.utils.removeElementsFromList(socialCommentsSection);

        // Comments
        for (let i=0; i < BIG_PICTURE_COMMENTS_COUNT; i++) {
            let newSocialComment = socialComment.cloneNode(true);
            newSocialComment.querySelector('.social__picture').setAttribute('src', socialComments[bigPicturePhotoIndex][i].avatar);
            newSocialComment.querySelector('.social__text').textContent = socialComments[bigPicturePhotoIndex][i].text;
            socialCommentsSection.appendChild(newSocialComment);
        };

        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };

createPhotosList();

})();
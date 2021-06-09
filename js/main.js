'use strict';

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

const NAMES = ['Владимир', 'Катя', 'Настя', 'Макс', 'Кирилл', 'Ришард', 'Адольф']

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

const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomElementFromList = (list) => {
   return list[getRandomInteger(0, list.length - 1)]
}

const removeElementsFromList = (list) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild)
    }
}

const generateSocialComments = () => {
    const maxCommentsAmount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

    for (var i=0; i < maxCommentsAmount; i++) {
        socialComments.push({
            avatar: `img/avatar-${getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
            text: getRandomElementFromList(COMMENTS),
            name: getRandomElementFromList(NAMES),
        })
    }
    return maxCommentsAmount;
}

const createPhotosList = () => {
    const photosFragment = document.createDocumentFragment();
    const photosList = document.querySelector('.pictures');
    const photosListElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // Generate photos
    
    for (var i=0; i < PHOTOS_COUNT; i++) {
        photos.push({
            url: `photos/${i+1}.jpg`,
            likes: getRandomInteger(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
            comments: generateSocialComments(),
            description: getRandomElementFromList(DESCRIPTION),
        })
    }

    // Show photos

    for(var i=0; i < photos.length; i++) {
        photosListElementTemplate.querySelector('.picture__img').setAttribute('src', photos[i].url);
        photosListElementTemplate.querySelector('.picture__likes').textContent = photos[i].likes;
        photosListElementTemplate.querySelector('.picture__comments').textContent = photos[i].comments;
        var photosElement = photosListElementTemplate.cloneNode(true);
        photosFragment.appendChild(photosElement);
    }

    photosList.appendChild(photosFragment)
}

const showBigPicture = () => {
    const socialCommentsSection = document.querySelector('.social__comments');
    const socialPhotoDescription = document.querySelector('.social__header');
    const photoBigPicture = document.querySelector('.big-picture');
    const socialComment = document.querySelector('.social__comment');

    // Big picture

    photoBigPicture.classList.remove('hidden');
    photoBigPicture.querySelector('.big-picture__img').querySelector('img').setAttribute('src', photos[0].url);
    photoBigPicture.querySelector('.likes-count').textContent = photos[0].likes;
    photoBigPicture.querySelector('.comments-count').textContent = photos[0].comment;

    // Hide comments count and loader

    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.comments-loader').classList.add('visually-hidden');

    // Photo Description

    socialPhotoDescription.querySelector('.social__picture').setAttribute('src', getRandomElementFromList(socialComments).avatar);
    socialPhotoDescription.querySelector('.social__caption').textContent = getRandomElementFromList(DESCRIPTION);

    // Remove HTML Comments

    removeElementsFromList(socialCommentsSection);

    // Comments

    for (var i=0; i < BIG_PICTURE_COMMENTS_COUNT; i++) {
        var newSocialComment = socialComment.cloneNode(true);
        newSocialComment.querySelector('.social__picture').setAttribute('src', socialComments[i].avatar);
        newSocialComment.querySelector('.social__text').textContent = socialComments[i].text;
        socialCommentsSection.appendChild(newSocialComment);
    }
}

createPhotosList();













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
const MAX_EFFECT_POSITION = 100;

const photos = [];
const socialComments = [];

const effects = {
    none: {
        filterName: 'none',
        minValue: 0,
        maxValue: 0,
        format: '',
    },
    chrome: {
        filterName: 'grayscale',
        minValue: 0,
        maxValue: 1,
        format: '',
    },
    sepia: {
        filterName: 'sepia',
        minValue: 0,
        maxValue: 1,
        format: '',
    },
    marvin: {
        filterName: 'invert',
        minValue: 0,
        maxValue: 100,
        format: '%',
    },
    phobos: {
        filterName: 'blur',
        minValue: 0,
        maxValue: 5,
        format: 'px',
    },
    heat: {
        filterName: 'brightness',
        minValue: 0,
        maxValue: 3,
        format: '',
    },
}

let bigPicturePhotoIndex = 0;

let currentEffectLevel = 0;
let currentEffect = 'none';
let currentEffectPinPosition = MAX_EFFECT_POSITION;

let hashTags = [];

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

const generateSocialComments = (photoIndex) => {
    const maxCommentsAmount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

    var photoComments = []
    for (var i=0; i < maxCommentsAmount; i++) {
        photoComments.push({
            index: photoIndex,
            avatar: `img/avatar-${getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
            text: getRandomElementFromList(COMMENTS),
            name: getRandomElementFromList(NAMES),
        })
    }
    socialComments.push(photoComments);
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
            comments: generateSocialComments(i),
            authorAvatar: `img/avatar-${getRandomInteger(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT)}.svg`,
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

    photosList.appendChild(photosFragment);

    const onPhotosListElementClick = (evt) => {
        for (var i=0; i < PHOTOS_COUNT; i++) {
            if (evt.target.getAttribute('src') === photos[i].url) {
                bigPicturePhotoIndex = i;
                showBigPicture();
                evt.target.parentNode.blur();
            }
        }
    }

    const onPhotosListElementEnterPress = (evt) => {
        if (evt.keyCode === 13 && evt.target.tagName === 'A') {  
            for (var i=0; i < PHOTOS_COUNT; i++) {
                if (evt.target.firstElementChild.getAttribute('src') === photos[i].url) {
                    bigPicturePhotoIndex = i;
                    showBigPicture();
                    evt.target.blur();
                }
            }
        }   
    }

    photosList.addEventListener('click', onPhotosListElementClick);
    photosList.addEventListener('keydown', onPhotosListElementEnterPress);
}

const photoBigPicture = document.querySelector('.big-picture');
const socialCommentsSection = document.querySelector('.social__comments');
const socialPhotoDescription = document.querySelector('.social__header');
const socialComment = document.querySelector('.social__comment');
const bigPictureCloseButton = document.querySelector('.big-picture__cancel');

const closeBigPicture = () => {
    photoBigPicture.classList.add('hidden');

    document.removeEventListener('keypress', onBigPictureEscPress);
    bigPictureCloseButton.removeEventListener('click', onBigPictureCloseButtonClick);
}

const onBigPictureCloseButtonClick = () => {
    closeBigPicture();
}

const onBigPictureEscPress = (evt) => {
    if (evt.keyCode === 27) {
        closeBigPicture();
    }
}

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
    socialPhotoDescription.querySelector('.social__caption').textContent = photos[bigPicturePhotoIndex].description

    // Remove HTML Comments

    removeElementsFromList(socialCommentsSection);

    // Comments
    for (var j=0; j < BIG_PICTURE_COMMENTS_COUNT; j++) {
        var newSocialComment = socialComment.cloneNode(true);
        newSocialComment.querySelector('.social__picture').setAttribute('src', socialComments[bigPicturePhotoIndex][j].avatar);
        newSocialComment.querySelector('.social__text').textContent = socialComments[bigPicturePhotoIndex][j].text;
        socialCommentsSection.appendChild(newSocialComment);
    }

    document.addEventListener('keydown', onBigPictureEscPress);
    bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
}

createPhotosList();


const uploadForm = document.querySelector('.img-upload__form')
const uploadPhotoButton = document.querySelector('.img-upload__input');
const uploadPhotoOverlay = document.querySelector('.img-upload__overlay');
const uploadPhotoOverlayPostButton = document.querySelector('.img-upload__submit');
const uploadInput = document.querySelector('#upload__file');
const uploadPhotoOverlayCloseButton = uploadPhotoOverlay.querySelector('.img-upload__cancel');

const effectPin = document.querySelector('.effect-level__pin');
const effectsList = document.querySelector('.effects__list');
const effectsRadio = document.getElementsByName('effect');
const effectLevelPanel = document.querySelector('.img-upload__effect-level');

const uploadImage = document.querySelector('.img-upload__preview').querySelector('img');

const uploadPhotoComment = document.querySelector('.text__description');
const uploadPhotoHashTags = document.querySelector('.text__hashtags');

const effectLevel = () => {
    currentEffectLevel = ((effects[currentEffect].maxValue - effects[currentEffect].minValue)/MAX_EFFECT_POSITION) * currentEffectPinPosition + effects[currentEffect].minValue;
}

const getEffect = () => {
    for (var i=0; i < effectsRadio.length; i++) {
        if (effectsRadio[i].checked) {
            if (effectsRadio[i].getAttribute('value') === 'none') {
                effectLevelPanel.classList.add('hidden');
                currentEffect = effectsRadio[i].getAttribute('value');
                setEffect();
            }
            else {
                if (effectsRadio[i].getAttribute('value') !== currentEffect && effectsRadio[i].getAttribute('value') !== 'none') {
                    if (effectLevelPanel.classList.contains('hidden')) {
                        effectLevelPanel.classList.remove('hidden');
                    }
                    currentEffect = effectsRadio[i].getAttribute('value');
                    if (currentEffectPinPosition !== MAX_EFFECT_POSITION) {
                        currentEffectPinPosition  = MAX_EFFECT_POSITION;
                    };
                    effectLevel();
                }
            }
        }
    }
}

const setEffect = () => {
    if (currentEffect === 'none') {
        uploadImage.style.filter = currentEffect;
    }
    else {
        uploadImage.style.filter = `${effects[currentEffect].filterName}(${currentEffectLevel}${effects[currentEffect].format})`;
    }
}

const onUploadPhotoOverlayCloseButtonClick = () => {
    closeUploadOverlay();
}

const onUploadPhotoOverlayEscPress = (evt) => {
    if (evt.keyCode === 27) {
        if (uploadPhotoHashTags === document.activeElement || uploadPhotoComment === document.activeElement) {
            document.activeElement.blur();
        } else {
            closeUploadOverlay();
        }
    }
}

const onUploadButtonEnterPress = (evt) => {
    if (evt.keyCode === 13) {
        showUploadOverlay();
    };
};

const onUploadButtonClick = () => {
    showUploadOverlay();
};

const showUploadOverlay = () => {
    uploadPhotoOverlay.classList.remove('hidden'); 
    uploadPhotoButton.blur();
    
    document.addEventListener('keydown', onUploadPhotoOverlayEscPress);
    uploadPhotoOverlayCloseButton.addEventListener('click', onUploadPhotoOverlayCloseButtonClick);
    effectsList.addEventListener('click', getEffect);
    effectPin.addEventListener('mouseup', setEffect);
};

uploadPhotoButton.addEventListener('keydown', onUploadButtonEnterPress);
uploadPhotoButton.addEventListener('click', onUploadButtonClick);

const closeUploadOverlay = () => {
    uploadPhotoOverlay.classList.add('hidden');
    uploadImage.style.filter = '';
    hashTags = [];
    uploadPhotoHashTags.value = '';

    document.removeEventListener('keydown', onUploadPhotoOverlayEscPress);
    
    document.removeEventListener('click', onUploadPhotoOverlayCloseButtonClick);
};

const onHashTagsChange = () => {
    hashTags = uploadPhotoHashTags.value.split(' '); 
    for (var i=0; i < hashTags.length; i++) {
        if (hashTags[i] === '') {
            hashTags.splice(i,1);
        } else {
            hashTags[i] = hashTags[i].toLowerCase();
        }
    } 
    console.log(hashTags); 
}

const countHashTags = (hashTag) => {
    var count = 0
    for (var i=0; i < hashTags.length; i++) {
        if (hashTags[i] === hashTag) {
            count = count + 1;
        }
    }
    return count
}

const hashTagsValidityChecking = () => {
    if (hashTags.length > 5) {
        uploadPhotoHashTags.setCustomValidity('Не может быть больше 5 хэш-тегов');
    } else if (hashTags.length === 0) {
        uploadPhotoHashTags.setCustomValidity('');
    } else {
        for (var i=0; i < hashTags.length; i++) {
            if (hashTags[i][0] !== '#') {
                uploadPhotoHashTags.setCustomValidity('Хэш-теги должны начинаться с решётки');
            } else if (hashTags[i] === '#') {
                uploadPhotoHashTags.setCustomValidity('Хэш-теги не могут состоять только из решетки');
            } else if ((hashTags[i].split('#').length - 1) > 1) {
                uploadPhotoHashTags.setCustomValidity('Хэш-теги должны разделяться пробелами');
            } else if (hashTags[i].length > 20) {
                uploadPhotoHashTags.setCustomValidity('Хэш-тег не должен быть длиннее 20 символов');
            } else if (countHashTags(hashTags[i]) > 1 ) {
                uploadPhotoHashTags.setCustomValidity('Не должно быть повторяющихся хэш-тегов(#ХэшТег = #хэштег)');
            } else {
                uploadPhotoHashTags.setCustomValidity('');
            }
        }
    }
}

uploadPhotoHashTags.addEventListener('change', onHashTagsChange);
uploadPhotoOverlayPostButton.addEventListener('click', hashTagsValidityChecking);























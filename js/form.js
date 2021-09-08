'use strict';

(function () {
    const MAX_EFFECT_POSITION = 100;
    const MAX_SCALE_PERCENTAGE = 100;
    const MIN_SCALE_PERCENTAGE = 25;
    const SCALE_RESIZE_PERCENTAGE = 25;
    const SCALE_COEFFICIENT = 100;
    const MAX_HASH_TAGS_NUMBER = 5;
    const MAX_HASH_TAG_LENGTH = 20;

    const EFFECTS = {
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
            maxValue: 3,
            format: 'px',
        },
        heat: {
            filterName: 'brightness',
            minValue: 0,
            maxValue: 3,
            format: '',
        },
    };

    const hashTagsValidity = {
        moreThanMaxTagsNumber: `Не может быть больше ${MAX_HASH_TAGS_NUMBER} хэш-тегов`,
        biggerThanMaxLength: `Хэш-тег не должен быть длиннее ${MAX_HASH_TAG_LENGTH} символов`,
        containsOnlyTag: `Хэш-теги не могут состоять только из решетки`,
        containsNoTag: `Хэш-теги должны начинаться с решётки`,
        noSpacesBetweenHashTags: `Хэш-теги должны разделяться пробелами`,
        sameHashTags: `Не должно быть повторяющихся хэш-тегов(#ХэшТег = #хэштег)`,
    };

    let currentEffectLevel = 0;
    let currentEffect = 'none';
    let currentEffectPinPosition = MAX_EFFECT_POSITION;
    let pinOffset = 0;
    let depthWidth = 0;
    let scaleValue = 1;
    let currentScalePercentage = 0;

    let hashTags = [];

    const uploadForm = document.querySelector('.img-upload__form');
    const uploadPhotoInput = uploadForm.querySelector('.img-upload__input');
    const uploadPhotoOverlay = uploadForm.querySelector('.img-upload__overlay');
    const uploadPhotoOverlayPostButton = uploadForm.querySelector('.img-upload__submit');
    const uploadPhotoOverlayCloseButton = uploadPhotoOverlay.querySelector('.img-upload__cancel');

    const effectLevelPanel = document.querySelector('.img-upload__effect-level');
    const effectPin = effectLevelPanel.querySelector('.effect-level__pin');
    const effectDepth = effectLevelPanel.querySelector('.effect-level__depth');
    const effectValue = effectLevelPanel.querySelector('.effect-level__value');
    const effectsList = uploadPhotoOverlay.querySelector('.effects__list');
    const effectsRadio = document.querySelectorAll('.effects__item');

    const uploadImagePreview = uploadPhotoOverlay.querySelector('.img-upload__preview')
    const uploadImage = uploadImagePreview.querySelector('img');

    const imageScaleSmallerButton = uploadPhotoOverlay.querySelector('.scale__control--smaller');
    const imageScaleBiggerButton = uploadPhotoOverlay.querySelector('.scale__control--bigger');
    const imageScalePercentage = uploadPhotoOverlay.querySelector('.scale__control--value');

    const uploadPhotoComment = uploadPhotoOverlay.querySelector('.text__description');
    const uploadPhotoHashTags = uploadPhotoOverlay.querySelector('.text__hashtags');

    const errorTemplate = document.querySelector('#error').content.querySelector('.error');
    const successTemplate = document.querySelector('#success').content.querySelector('.success');

    const onUploadPhotoOverlayCloseButtonClick = () => {
        closeUploadOverlay();
    };

    // Show/Hide upload overlay

    const onUploadPhotoOverlayEscPress = (evt) => {
        window.utils.isEscKey(evt, () => {
            if (uploadPhotoHashTags === document.activeElement || uploadPhotoComment === document.activeElement) {
                return;
            } else {
                closeUploadOverlay();
            };
        });
    };

    const showUploadPhotoOverlay = () => {
        uploadPhotoOverlay.classList.remove('hidden');
        effectLevelPanel.classList.add('visually-hidden');
        
        if (document.activeElement === uploadPhotoInput) {
            uploadPhotoInput.blur();
        }

        currentScalePercentage = parseInt(imageScalePercentage.value);
        uploadImagePreview.style.transform = `scale(${scaleValue})`;
        pinOffset = effectPin.offsetLeft;
        depthWidth = effectDepth.clientWidth;
    
        document.addEventListener('keydown', onUploadPhotoOverlayEscPress);
        uploadPhotoOverlayCloseButton.addEventListener('click', onUploadPhotoOverlayCloseButtonClick);
        effectsList.addEventListener('click', getEffect);
    };

    uploadPhotoInput.addEventListener('change', showUploadPhotoOverlay);

    const resetScale = () => {
        imageScalePercentage.value = `${currentScalePercentage}%`;
        scaleValue = currentScalePercentage / SCALE_COEFFICIENT;
        uploadImagePreview.style.transform = `scale(${scaleValue})` 
    }


    const closeUploadOverlay = () => {
        uploadPhotoInput.value = '';
        uploadPhotoOverlay.classList.add('hidden');
        uploadImage.style.filter = '';
        hashTags = [];
        uploadPhotoHashTags.value = '';
        currentScalePercentage = MAX_SCALE_PERCENTAGE;
        resetScale();
        effectsRadio.forEach((elem) => {
            if (elem.querySelector('input').checked) {
                elem.querySelector('input').checked = false;
            }
        })

        document.removeEventListener('keydown', onUploadPhotoOverlayEscPress);
        document.removeEventListener('click', onUploadPhotoOverlayCloseButtonClick);
    };

    // Image scale change

    const onScaleBiggerButtonClick = () => {
        if  (currentScalePercentage < MAX_SCALE_PERCENTAGE) {
            currentScalePercentage = currentScalePercentage + SCALE_RESIZE_PERCENTAGE;
            resetScale();
        };
    };

    const onScaleSmallerButtonClick = () => {
        if (currentScalePercentage > MIN_SCALE_PERCENTAGE) {
            currentScalePercentage = currentScalePercentage - SCALE_RESIZE_PERCENTAGE;
            resetScale();
        };
    };

    imageScaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
    imageScaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);

    // Hash-tags validation

    const onHashTagsChange = () => {
        hashTags = uploadPhotoHashTags.value.split(' '); 
        hashTags.forEach((elem, index) => {
            console.log(elem,index);
            if (elem === '') {
                hashTags.splice(index, 1);
            } else {
                hashTags[index] = elem.toLowerCase();
            };
        });
        console.log(hashTags);
    };

    const countHashTags = (hashTag) => {
        let count = 0;
        hashTags.forEach((elem) => {
            if (elem === hashTag) {
                count = count + 1;
            };
        });
        return count;
    };

    const hashTagsValidityChecking = () => {
        if (hashTags.length > MAX_HASH_TAGS_NUMBER) {
            uploadPhotoHashTags.setCustomValidity(hashTagsValidity.moreThanMaxTagsNumber);
        } else if (hashTags.length === 0) {
            uploadPhotoHashTags.setCustomValidity('');
        } else {
            hashTags.forEach((elem) => {
                if (elem[0] !== '#') {
                    uploadPhotoHashTags.setCustomValidity(hashTagsValidity.containsNoTag);
                } else if (elem === '#') {
                    uploadPhotoHashTags.setCustomValidity(hashTagsValidity.containsOnlyTag);
                } else if ((elem.split('#').length - 1) > 1) {
                    uploadPhotoHashTags.setCustomValidity(hashTagsValidity.noSpacesBetweenHashTags);
                } else if (elem.length > MAX_HASH_TAG_LENGTH) {
                    uploadPhotoHashTags.setCustomValidity(hashTagsValidity.biggerThanMaxLength);
                } else if (countHashTags(elem) > 1 ) {
                    uploadPhotoHashTags.setCustomValidity(hashTagsValidity.sameHashTags);
                } else {
                    uploadPhotoHashTags.setCustomValidity('');
                };
            });
        };
    };

    uploadPhotoHashTags.addEventListener('change', onHashTagsChange);
    uploadPhotoOverlayPostButton.addEventListener('click', hashTagsValidityChecking);

    // Effect calculation

    const effectLevel = () => {
        currentEffectLevel = ((EFFECTS[currentEffect].maxValue - EFFECTS[currentEffect].minValue)/MAX_EFFECT_POSITION) * currentEffectPinPosition + EFFECTS[currentEffect].minValue;
    };

    const getEffect = () => {
        effectsRadio.forEach((elem) => {
            if (elem.querySelector('input').checked) {
                if (elem.querySelector('input').getAttribute('value') === 'none') {
                    effectLevelPanel.classList.add('visually-hidden');
                    currentEffect = elem.querySelector('input').getAttribute('value');
                    effectValue.setAttribute('value', `${EFFECTS[currentEffect].filterName}`);
                }
                else {
                    if (elem.querySelector('input').getAttribute('value') !== currentEffect && elem.querySelector('input').getAttribute('value') !== 'none') {
                        if (effectLevelPanel.classList.contains('visually-hidden')) {
                            effectLevelPanel.classList.remove('visually-hidden');
                        }
                        currentEffect = elem.querySelector('input').getAttribute('value');
                        if (currentEffectPinPosition !== MAX_EFFECT_POSITION) {
                            currentEffectPinPosition  = MAX_EFFECT_POSITION;
                        };
                        effectPin.style.left = pinOffset + 'px';
                        effectDepth.style.width = depthWidth + 'px';
                        effectLevel();
                        effectValue.setAttribute('value', `${EFFECTS[currentEffect].filterName}(${EFFECTS[currentEffect].maxValue})`);
                    };
                };
            };
        });
        setEffect();
    };

    const setEffect = () => {
        if (currentEffect === 'none') {
            uploadImage.style.filter = currentEffect;
        }
        else {
            uploadImage.style.filter = `${EFFECTS[currentEffect].filterName}(${currentEffectLevel}${EFFECTS[currentEffect].format})`;
        };
    };

    // Drag-n-drop for effect pin

    const onMouseDown = (evt) => {
        evt.preventDefault();
        let pinCoords = evt.clientX;

        const onPinMouseMove = (moveEvt) => {
            moveEvt.preventDefault();
            let pinShift = pinCoords - moveEvt.clientX;

            pinCoords = moveEvt.clientX;

            let currentOffset = effectPin.offsetLeft - pinShift;
            let currentDepthWidth = effectDepth.clientWidth - pinShift;

            effectPin.style.left = currentOffset + 'px';
            effectDepth.style.width = currentDepthWidth + 'px';
            if (currentOffset < 0) {
                effectPin.style.left = '0px';
                effectDepth.style.width = '0px';
            } else if (currentOffset > pinOffset) {
                effectPin.style.left = pinOffset + 'px';
                effectDepth.style.width = depthWidth + 'px';
                currentOffset = pinOffset;
                currentDepthWidth = depthWidth;
            };

            currentEffectPinPosition = currentOffset / (pinOffset / MAX_EFFECT_POSITION);
            effectLevel();
            setEffect();

            effectValue.setAttribute('value',`${uploadImage.style.filter}`);
        };

        const onPinMouseUp = (moveEvt) => {
            moveEvt.preventDefault();
            let pinShift = pinCoords - moveEvt.clientX;

            pinCoords = moveEvt.clientX;

            let currentOffset = effectPin.offsetLeft - pinShift;
            let currentDepthWidth = effectDepth.clientWidth - pinShift;

            effectPin.style.left = currentOffset + 'px';
            effectDepth.style.width = currentDepthWidth + 'px';

            currentEffectPinPosition = currentOffset / (pinOffset / MAX_EFFECT_POSITION);
            effectLevel();
            setEffect();

            effectValue.setAttribute('value',`${uploadImage.style.filter}`);

            document.removeEventListener('mousemove', onPinMouseMove);
            document.removeEventListener('mouseup', onPinMouseUp);
            document.removeEventListener('mouseup', setEffect);
        };

        document.addEventListener('mouseup', setEffect);
        document.addEventListener('mousemove', onPinMouseMove);
        document.addEventListener('mouseup', onPinMouseUp);
    };

    effectPin.addEventListener('mousedown', onMouseDown);

    const onUploadSuccessEscPress = (evt) => {
        window.utils.isEscKey(evt, () => {
            if (document.querySelector('.success')) {
                document.querySelector('.success').remove();
            }
        });
    };

    const onUploadSuccessButtonClick = () => {
        document.querySelector('.success').remove();
    };

    const onUploadErrorEscPress = (evt) => {
        window.utils.isEscKey(evt, () => {
            if (document.querySelector('.error')) {
                document.querySelector('.error').remove();
            }
        });
    };

    const onUploadErrorTryAgainButtonClick = () => {
        document.querySelector('.error').remove();
        currentScalePercentage = MAX_SCALE_PERCENTAGE;
        resetScale();
        showUploadPhotoOverlay();
    };

    const onUploadErrorUploadNewFileButtonClick = () => {
        document.querySelector('.error').remove();
        uploadPhotoInput.value = '';
        currentScalePercentage = MAX_SCALE_PERCENTAGE;
        resetScale();
        uploadPhotoInput.click();
    };
    
    const successHandler = () => {
        closeUploadOverlay();
        const successMessage = successTemplate.cloneNode(true);
        document.querySelector('main').insertAdjacentElement('afterbegin', successMessage);

        document.addEventListener('keydown', onUploadSuccessEscPress);
        document.querySelector('.success__button').addEventListener('click', onUploadSuccessButtonClick);
    };

    const errorHandler = (errorText) => {
        uploadPhotoOverlay.classList.add('hidden');
        const errorMessage = errorTemplate.cloneNode(true);
        errorMessage.querySelector('.error__title').textContent = errorText;
        document.querySelector('main').insertAdjacentElement('afterbegin', errorMessage);
        const errorButtons = document.querySelectorAll('.error__button');

        document.addEventListener('keydown', onUploadErrorEscPress);
        errorButtons[0].addEventListener('click', onUploadErrorTryAgainButtonClick)
        errorButtons[1].addEventListener('click', onUploadErrorUploadNewFileButtonClick)
    };

    uploadForm.addEventListener('submit', (evt) => {
        window.backend.uploadData(new FormData(uploadForm), successHandler, errorHandler);
        evt.preventDefault();
    });
    
})();
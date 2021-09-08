'use strict';

(function () {
    const MAX_EFFECT_POSITION = 100;
    const MAX_SCALE_PERCENTAGE = 100;
    const MIN_SCALE_PERCENTAGE = 25;
    const SCALE_RESIZE_PERCENTAGE = 25;
    const SCALE_COEFFICIENT = 100;

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
        imageScalePercentage.value = `${MAX_SCALE_PERCENTAGE}%`;
        scaleValue = MAX_SCALE_PERCENTAGE / SCALE_COEFFICIENT;
        uploadImagePreview.style.transform = `scale(${scaleValue})` 
    }


    const closeUploadOverlay = () => {
        uploadPhotoInput.value = '';
        uploadPhotoOverlay.classList.add('hidden');
        uploadImage.style.filter = '';
        hashTags = [];
        uploadPhotoHashTags.value = '';
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
            scaleValue = currentScalePercentage / SCALE_COEFFICIENT;
            uploadImagePreview.style.transform = `scale(${scaleValue})`;
            imageScalePercentage.value = `${currentScalePercentage}%`;
        };
    };

    const onScaleSmallerButtonClick = () => {
        if (currentScalePercentage > MIN_SCALE_PERCENTAGE) {
            currentScalePercentage = currentScalePercentage - SCALE_RESIZE_PERCENTAGE;
            scaleValue = currentScalePercentage / SCALE_COEFFICIENT;
            uploadImagePreview.style.transform = `scale(${scaleValue})`;
            imageScalePercentage.value = `${currentScalePercentage}%`;
        };
    };

    imageScaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
    imageScaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);

    // Hash-tags validation

    const onHashTagsChange = () => {
        hashTags = uploadPhotoHashTags.value.split(' '); 
        hashTags.forEach((elem, index) => {
            if (elem === '') {
                hashTags.splice(index,1);
            } else {
                elem = elem.toLowerCase();
            };
        });
    };

    const countHashTags = (hashTag) => {
        let count = 0;
        hashTags.forEach((elem) => {
            if (elem === hashTag) {
                count = count + 1;
            };
        })
        return count;
    };

    const hashTagsValidityChecking = () => {
        if (hashTags.length > 5) {
            uploadPhotoHashTags.setCustomValidity('Не может быть больше 5 хэш-тегов');
        } else if (hashTags.length === 0) {
            uploadPhotoHashTags.setCustomValidity('');
        } else {
            hashTags.forEach((elem) => {
                if (elem[0] !== '#') {
                    uploadPhotoHashTags.setCustomValidity('Хэш-теги должны начинаться с решётки');
                } else if (elem === '#') {
                    uploadPhotoHashTags.setCustomValidity('Хэш-теги не могут состоять только из решетки');
                } else if ((elem.split('#').length - 1) > 1) {
                    uploadPhotoHashTags.setCustomValidity('Хэш-теги должны разделяться пробелами');
                } else if (elem.length > 20) {
                    uploadPhotoHashTags.setCustomValidity('Хэш-тег не должен быть длиннее 20 символов');
                } else if (countHashTags(elem) > 1 ) {
                    uploadPhotoHashTags.setCustomValidity('Не должно быть повторяющихся хэш-тегов(#ХэшТег = #хэштег)');
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
        resetScale();
        showUploadPhotoOverlay();
    };

    const onUploadErrorUploadNewFileButtonClick = () => {
        document.querySelector('.error').remove();
        uploadPhotoInput.value = '';
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
        const errorButtons = document.querySelectorAll('.error__button');
        errorMessage.querySelector('.error__title').textContent = errorText;
        document.querySelector('main').insertAdjacentElement('afterbegin', errorMessage);

        document.addEventListener('keydown', onUploadErrorEscPress);
        errorButtons[0].addEventListener('click', onUploadErrorTryAgainButtonClick)
        errorButtons[1].querySelectorAll('.error__button')[1].addEventListener('click', onUploadErrorUploadNewFileButtonClick)
    };

    uploadForm.addEventListener('submit', (evt) => {
        window.backend.uploadData(new FormData(uploadForm), successHandler, errorHandler);
        evt.preventDefault();
    });
    
})();
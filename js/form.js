'use strict';

(function () {
    const MAX_EFFECT_POSITION = 100;

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
    };

    let currentEffectLevel = 0;
    let currentEffect = 'none';
    let currentEffectPinPosition = MAX_EFFECT_POSITION;
    let pinOffset = 0;
    let depthWidth = 0;
    let scaleValue = 1;
    let currentScalePercentage = 0;
    let maxScalePercentage = 100;
    let minScalePercentage = 25;
    let scaleResizePercentage = 25;
    let scaleCoefficient = 100;

    let hashTags = [];

    const uploadForm = document.querySelector('.img-upload__form');
    const uploadPhotoInput = document.querySelector('.img-upload__input');
    const uploadPhotoOverlay = document.querySelector('.img-upload__overlay');
    const uploadPhotoOverlayPostButton = document.querySelector('.img-upload__submit');
    const uploadPhotoOverlayCloseButton = uploadPhotoOverlay.querySelector('.img-upload__cancel');

    const effectPin = document.querySelector('.effect-level__pin');
    const effectDepth = document.querySelector('.effect-level__depth');
    const effectValue = document.querySelector('.effect-level__value');
    const effectsList = document.querySelector('.effects__list');
    const effectsRadio = document.getElementsByName('effect');
    const effectLevelPanel = document.querySelector('.img-upload__effect-level');

    const uploadImagePreview = document.querySelector('.img-upload__preview')
    const uploadImage = uploadImagePreview.querySelector('img');

    const imageScaleSmallerButton = document.querySelector('.scale__control--smaller');
    const imageScaleBiggerButton = document.querySelector('.scale__control--bigger');
    const imageScalePercentage = document.querySelector('.scale__control--value');

    const uploadPhotoComment = document.querySelector('.text__description');
    const uploadPhotoHashTags = document.querySelector('.text__hashtags');

    const errorTemplate = document.querySelector('#error').content.querySelector('.error');
    const successTemplate = document.querySelector('#success').content.querySelector('.success');

    const onUploadPhotoOverlayCloseButtonClick = () => {
        closeUploadOverlay();
    };

    // Show/Hide upload overlay

    const onUploadPhotoOverlayEscPress = (evt) => {
        if (window.utils.isEscKeycode(evt)) {
            if (uploadPhotoHashTags === document.activeElement || uploadPhotoComment === document.activeElement) {
                document.activeElement.blur();
            } else {
                closeUploadOverlay();
            };
        };
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

    uploadPhotoInput.addEventListener('change', showUploadPhotoOverlay)

    const closeUploadOverlay = () => {
        uploadPhotoInput.value = '';
        uploadPhotoOverlay.classList.add('hidden');
        uploadImage.style.filter = '';
        hashTags = [];
        uploadPhotoHashTags.value = '';
        resetScale();
        for (let i=0; i < effectsRadio.length; i++) {
            if (effectsRadio[i].checked) {
                effectsRadio[i].checked = false;
            };
        };

        document.removeEventListener('keydown', onUploadPhotoOverlayEscPress);
        document.removeEventListener('click', onUploadPhotoOverlayCloseButtonClick);
    };

    // Image scale change

    const resetScale = () => {
        imageScalePercentage.value = `${maxScalePercentage}%`;
        scaleValue = maxScalePercentage / scaleCoefficient;
        uploadImagePreview.style.transform = `scale(${scaleValue})` 
    }

    const onScaleBiggerButtonClick = () => {
        if  (currentScalePercentage < maxScalePercentage) {
            currentScalePercentage = currentScalePercentage + scaleResizePercentage;
            scaleValue = currentScalePercentage / scaleCoefficient;
            uploadImagePreview.style.transform = `scale(${scaleValue})`;
            imageScalePercentage.value = `${currentScalePercentage}%`;
        };
    };

    const onScaleSmallerButtonClick = () => {
        if (currentScalePercentage > minScalePercentage) {
            currentScalePercentage = currentScalePercentage - scaleResizePercentage;
            scaleValue = currentScalePercentage / scaleCoefficient;
            uploadImagePreview.style.transform = `scale(${scaleValue})`;
            imageScalePercentage.value = `${currentScalePercentage}%`;
        };
    };

    imageScaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
    imageScaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);

    // Hash-tags validation

    const onHashTagsChange = () => {
        hashTags = uploadPhotoHashTags.value.split(' '); 
        for (let i=0; i < hashTags.length; i++) {
            if (hashTags[i] === '') {
                hashTags.splice(i,1);
            } else {
                hashTags[i] = hashTags[i].toLowerCase();
            };
        };
    };

    const countHashTags = (hashTag) => {
        let count = 0;
        for (let i=0; i < hashTags.length; i++) {
            if (hashTags[i] === hashTag) {
                count = count + 1;
            };
        };
        return count;
    };

    const hashTagsValidityChecking = () => {
        if (hashTags.length > 5) {
            uploadPhotoHashTags.setCustomValidity('Не может быть больше 5 хэш-тегов');
        } else if (hashTags.length === 0) {
            uploadPhotoHashTags.setCustomValidity('');
        } else {
            for (let i=0; i < hashTags.length; i++) {
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
                };
            };
        };
    };

    uploadPhotoHashTags.addEventListener('change', onHashTagsChange);
    uploadPhotoOverlayPostButton.addEventListener('click', hashTagsValidityChecking);

    // Effect calculation

    const effectLevel = () => {
        currentEffectLevel = ((effects[currentEffect].maxValue - effects[currentEffect].minValue)/MAX_EFFECT_POSITION) * currentEffectPinPosition + effects[currentEffect].minValue;
    };

    const getEffect = () => {
        for (let i=0; i < effectsRadio.length; i++) {
            if (effectsRadio[i].checked) {
                if (effectsRadio[i].getAttribute('value') === 'none') {
                    effectLevelPanel.classList.add('visually-hidden');
                    currentEffect = effectsRadio[i].getAttribute('value');
                    effectValue.setAttribute('value', `${effects[currentEffect].filterName}`);
                }
                else {
                    if (effectsRadio[i].getAttribute('value') !== currentEffect && effectsRadio[i].getAttribute('value') !== 'none') {
                        if (effectLevelPanel.classList.contains('visually-hidden')) {
                            effectLevelPanel.classList.remove('visually-hidden');
                        }
                        currentEffect = effectsRadio[i].getAttribute('value');
                        if (currentEffectPinPosition !== MAX_EFFECT_POSITION) {
                            currentEffectPinPosition  = MAX_EFFECT_POSITION;
                        };
                        effectPin.style.left = pinOffset + 'px';
                        effectDepth.style.width = depthWidth + 'px';
                        effectLevel();
                        effectValue.setAttribute('value', `${effects[currentEffect].filterName}(${effects[currentEffect].maxValue})`);
                    };
                };
            };
        };
        setEffect();
    };

    const setEffect = () => {
        if (currentEffect === 'none') {
            uploadImage.style.filter = currentEffect;
        }
        else {
            uploadImage.style.filter = `${effects[currentEffect].filterName}(${currentEffectLevel}${effects[currentEffect].format})`;
        };
    };

    // Drag-n-drop for effect pin

    const onMouseDown = (evt) => {
        let pinCoords = evt.clientX;

        const onPinMouseMove = (moveEvt) => {
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
        if (window.utils.isEscKeycode(evt)) {
            if (document.querySelector('.success')) {
                document.querySelector('.success').remove();
            }
        }
    }

    const onUploadSuccessButtonClick = () => {
        document.querySelector('.success').remove();
    }

    const onUploadErrorEscPress = (evt) => {
        if (window.utils.isEscKeycode(evt)) {
            if (document.querySelector('.error') !== null) {
                document.querySelector('.error').remove();
            }
        }
    }

    const onUploadErrorTryAgainButtonClick = () => {
        document.querySelector('.error').remove();
        resetScale();
        showUploadPhotoOverlay();
    }

    const onUploadErrorUploadNewFileButtonClick = () => {
        document.querySelector('.error').remove();
        uploadPhotoInput.value = '';
        resetScale();
        uploadPhotoInput.click();
    }
    
    const successHandler = () => {
        closeUploadOverlay();
        uploadPhotoOverlay.classList.add('hidden');
        let successMessage = successTemplate.cloneNode(true);
        document.querySelector('main').insertAdjacentElement('afterbegin', successMessage);

        document.addEventListener('keydown', onUploadSuccessEscPress);
        document.querySelector('.success__button').addEventListener('click', onUploadSuccessButtonClick);
    }

    const errorHandler = (errorText) => {
        uploadPhotoOverlay.classList.add('hidden');
        errorTemplate.querySelector('.error__title').textContent = errorText;
        let errorMessage = errorTemplate.cloneNode(true);
        document.querySelector('main').insertAdjacentElement('afterbegin', errorMessage);

        document.addEventListener('keydown', onUploadErrorEscPress);
        document.querySelectorAll('.error__button')[0].addEventListener('click', onUploadErrorTryAgainButtonClick)
        document.querySelectorAll('.error__button')[1].addEventListener('click', onUploadErrorUploadNewFileButtonClick)
    }

    uploadForm.addEventListener('submit', (evt) => {
        window.backend.uploadData(new FormData(uploadForm), successHandler, errorHandler);
        evt.preventDefault();
    })
    
})();
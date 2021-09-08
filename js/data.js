'use strict';

(function () {
    const errorTemplate = document.querySelector('#error').content.querySelector('.error');

    const onErrorHandlerTryAgainButtonClick = () => {
        document.location.reload();
    };
    
    const setErrorButtonEventListener = () => {
        const errorButtons = document.querySelectorAll('.error__button');
    
        errorButtons[0].addEventListener('click', onErrorHandlerTryAgainButtonClick);
        errorButtons[1].classList.add('hidden');
    };
    
    window.downloadHandlers = {
        SUCCESS: function(photosData) {
            window.photos = photosData;
        },
        ERROR: function(errorMessage) {
            const errorNode = errorTemplate.cloneNode(true);
            errorNode.querySelector('.error__title').textContent = errorMessage;
            document.querySelector('main').insertAdjacentElement('afterbegin', errorNode);
            
            setErrorButtonEventListener();
        },
    };
})();

'use strict';

(function() {
    const MIN_AVATAR_NUMBER = 1;
    const MAX_AVATAR_NUMBER = 6;
    const BIG_PICTURE_COMMENTS_COUNT = 5;
    const BIG_PICTURE_NEW_COMMENTS_COUNT = 5;

    const photoBigPicture = document.querySelector('.big-picture');
    const socialCommentsSection = photoBigPicture.querySelector('.social__comments');
    const socialPhotoDescription = photoBigPicture.querySelector('.social__header');
    const socialComment = socialCommentsSection.querySelector('.social__comment');
    const bigPictureCloseButton = photoBigPicture.querySelector('.big-picture__cancel');
    const socialCommentsLoader = photoBigPicture.querySelector('.social__comments-loader');
    const socialCommentsAmount = photoBigPicture.querySelector('.social__comment-count');
    const socialCommentsAmountNumber = socialCommentsAmount.querySelector('.comments-count');

    const closeBigPicture = () => {
        photoBigPicture.classList.add('hidden');

        document.removeEventListener('keypress', onBigPictureEscPress);
        bigPictureCloseButton.removeEventListener('click', onBigPictureCloseButtonClick);
    };

    const onBigPictureCloseButtonClick = () => {
        closeBigPicture();
    };

    const onBigPictureEscPress = (evt) => {
        window.utils.isEscKey(evt, closeBigPicture);
    };
    
    const showSocialComment = (photoComment) => {
        const newSocialComment = socialComment.cloneNode(true);
        newSocialComment.querySelector('.social__picture').src = photoComment.avatar;
        newSocialComment.querySelector('.social__text').textContent = photoComment.message;
        return newSocialComment
    };

    window.showBigPicture = (picture) => {
        photoBigPicture.classList.remove('hidden');
        photoBigPicture.querySelector('.big-picture__img img').src = picture.url;
        photoBigPicture.querySelector('.likes-count').textContent = picture.likes;

        const commentsAmount = picture.comments.length;

        // Photo Description

        socialPhotoDescription.querySelector('.social__picture')
        .src = `img/avatar-${window.utils.getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)}.svg`;
        
        socialPhotoDescription.querySelector('.social__caption').textContent = picture.description;

        const showComments = () => {
            window.utils.removeElementsFromList(socialCommentsSection);

            socialCommentsAmountNumber.textContent = commentsAmount;
            const comments = picture.comments;

            let currentCommentIndex = 0;
            let maxCommentIndex = Math.min(currentCommentIndex + BIG_PICTURE_COMMENTS_COUNT, commentsAmount);

            const showMoreComments = () => {
                const commentsFragment = document.createDocumentFragment();
            
                comments.slice(currentCommentIndex, maxCommentIndex).
                forEach(comment => commentsFragment.appendChild(showSocialComment(comment)));

                socialCommentsSection.appendChild(commentsFragment);
    
                currentCommentIndex = maxCommentIndex;
                socialCommentsAmount.firstChild.textContent = `${currentCommentIndex} из `;
    
                maxCommentIndex = Math.min(currentCommentIndex + BIG_PICTURE_NEW_COMMENTS_COUNT, commentsAmount);
                if (currentCommentIndex === commentsAmount) {
                    socialCommentsLoader.classList.add('hidden');
                };
            };

            const onSocialCommentsLoaderClick = () => {
                showMoreComments();
            };

            if (commentsAmount <= BIG_PICTURE_COMMENTS_COUNT) {
                socialCommentsLoader.classList.add('visually-hidden');
            } else {
                socialCommentsLoader.classList.remove('visually-hidden');
                socialCommentsLoader.addEventListener('click', onSocialCommentsLoaderClick);
            };

            showMoreComments();
        };

        showComments();

        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };
})();
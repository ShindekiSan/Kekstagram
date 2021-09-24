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
    
    const showSocialComment = (photoComment) => {
        const newSocialComment = socialComment.cloneNode(true);
        newSocialComment.querySelector('.social__picture').src = photoComment.avatar;
        newSocialComment.querySelector('.social__text').textContent = photoComment.message;
        return newSocialComment;
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

        // Comments section

        const getMaxCommentIndex = (currentIndex, commentsCount) => {
            return Math.min(currentIndex, commentsCount)
        }

        const comments = picture.comments;

        let currentCommentIndex;
        let maxCommentIndex;

        const showMoreComments = () => {
            const commentsFragment = document.createDocumentFragment();
            
            comments.slice(currentCommentIndex, maxCommentIndex).
            forEach(comment => commentsFragment.appendChild(showSocialComment(comment)));

            socialCommentsSection.appendChild(commentsFragment);
    
            currentCommentIndex = maxCommentIndex;
            socialCommentsAmount.firstChild.textContent = `${currentCommentIndex} из `;
    
            maxCommentIndex = getMaxCommentIndex(currentCommentIndex + BIG_PICTURE_NEW_COMMENTS_COUNT, commentsAmount);
            if (currentCommentIndex === commentsAmount) {
                socialCommentsLoader.classList.add('visually-hidden');
                socialCommentsLoader.removeEventListener('click', onSocialCommentsLoaderClick);
            };
        };

        const showComments = () => {
            window.utils.removeElementsFromList(socialCommentsSection);

            socialCommentsAmountNumber.textContent = commentsAmount;

            if (commentsAmount <= BIG_PICTURE_COMMENTS_COUNT) {
                socialCommentsLoader.classList.add('visually-hidden');
            } else {
                socialCommentsLoader.classList.remove('visually-hidden');
                socialCommentsLoader.addEventListener('click', onSocialCommentsLoaderClick);
            };

            currentCommentIndex = 0;
            maxCommentIndex = getMaxCommentIndex(currentCommentIndex + BIG_PICTURE_COMMENTS_COUNT, commentsAmount);

            showMoreComments();
        };

        const onSocialCommentsLoaderClick = () => {
            showMoreComments();
        };

        showComments();

        // Big picture closing

        const closeBigPicture = () => {
            photoBigPicture.classList.add('hidden');
    
            document.removeEventListener('keypress', onBigPictureEscPress);
            bigPictureCloseButton.removeEventListener('click', onBigPictureCloseButtonClick);
            socialCommentsLoader.removeEventListener('click', onSocialCommentsLoaderClick);
        };
    
        const onBigPictureCloseButtonClick = () => {
            closeBigPicture();
        };
    
        const onBigPictureEscPress = (evt) => {
            window.utils.isEscKey(evt, closeBigPicture);
        };

        document.addEventListener('keydown', onBigPictureEscPress);
        bigPictureCloseButton.addEventListener('click', onBigPictureCloseButtonClick);
    };
})();
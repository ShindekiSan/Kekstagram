'use strict';

(function () {
    const TIMEOUT_INTERVAL = 10000;

    window.backend = {
        downloadData: async function(onLoad, onError) {
            const downloadURL = 'https://23.javascript.pages.academy/kekstagram/data';

            // XHR запрос 
            // --------------

            // let xhr = new XMLHttpRequest();
            // xhr.responseType = 'json'

            // xhr.open('GET', downloadURL);

            // xhr.addEventListener('load', () => {
            //     if (xhr.status === LOAD_OK) {
            //         onLoad(xhr.response);
            //         console.log(xhr.response)
            //     } else {
            //         onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
            //     }
            // });

            // xhr.addEventListener('error', () => {
            //     onError('Произошла ошибка соединения');
            // });

            // xhr.addEventListener('timeout', () => {
            //     onError(`Не удалось загрузить данные спустя ${TIMEOUT_INTERVAL} мс`);
            // });

            // xhr.send();

            // --------------

            const response = await fetch(downloadURL);

            if (response.ok) {
                const json = await response.json();
                onLoad(json);
                return json;
            } else {
                onError(`Статус ответа: ${response.status} ${response.statusText}`);
            };
        },
        uploadData: async function(data, onLoad, onError) {
            const uploadURL = 'https://23.javascript.pages.academy/kekstagram';

            // XHR запрос 
            // --------------

            // let xhr = new XMLHttpRequest();
            // xhr.responseType = 'json';

            // xhr.addEventListener('load', () => {
            //     if (xhr.status === LOAD_OK) {
            //         onLoad(xhr.response);
            //         console.log(xhr.response);
            //     } else {
            //         onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
            //     };
            // });

            // xhr.addEventListener('error', () => {
            //     onError('Произошла ошибка соединения');
            // });

            // xhr.addEventListener('timeout', () => {
            //     onError(`Не удалось загрузить данные спустя ${TIMEOUT_INTERVAL} мс`);
            // });

            // xhr.open('POST', uploadURL);
            // xhr.send(data);

            // --------------

            const response = await fetch(uploadURL, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                const json = await response.json();
                onLoad(json);
            } else {
                onError(`Статус ответа: ${response.status} ${response.statusText}`);
            };
        },
    };
})();

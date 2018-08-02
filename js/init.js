// Register service worker
window.onload = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('service worker registered!'));
    }
};

const RESTAURANT_ENDPOINT = DBHelper.DATABASE_URL + '/restaurants/';
const REVIEW_ENDPOINT = DBHelper.DATABASE_URL + '/reviews/';

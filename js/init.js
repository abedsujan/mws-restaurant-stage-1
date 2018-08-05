// Register service worker
window.onload = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('service worker registered!'));
    }
};

const INDEXBD_RESTAURANT = 'RestaurantsDB';
const INDEXBD_REVIEW = 'ReviewsDB';

const RESTAURANT_ENDPOINT = DBHelper.DATABASE_URL + '/restaurants/';
const REVIEW_ENDPOINT = DBHelper.DATABASE_URL + '/reviews/';


const fillMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    if (location.pathname == "/") {
        fillMap();
        updateRestaurants();
    }

    if (location.pathname != "/") {
        // Listen to review form submit event
        reviewSubmitListener();

        fetchRestaurantFromURL((error, restaurant) => {
            if (error) { // Got an error!
                console.error(error);
            } else {
                self.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 16,
                    center: restaurant.latlng,
                    scrollwheel: false
                });
                fillBreadcrumb();
                RestaurantDBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
            }
        });
    }
}
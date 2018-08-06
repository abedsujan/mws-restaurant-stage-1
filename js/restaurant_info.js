/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    RestaurantDBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;

      if (!restaurant) {
        console.error(error);
        return;
      }

      fillRestaurantHTML(restaurant);
      callback(null, restaurant)
    });

    ReviewDBHelper.fetchReviewByRestaurantId(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      // fill reviews
      fillReviewsHTML(reviews);
      callback(null, reviews)
    });

  }
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name) => {
  const url = window.location.href;

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};



const reviewSubmitListener = () => {

  document.getElementById('review-form').addEventListener('submit', function (event) {
    event.preventDefault();

    createNewReview();

  }, true);
}
/**
 * Create new restaurant review
 */
const createNewReview = () => {

  const name = document.getElementById('review-form').elements['review-name'].value;
  const rating = document.getElementById('review-form').elements['review-rating'].value;
  const comment = document.getElementById('review-form').elements['review-comment'].value;
  const url = new URL(window.location.href);
  const restaurant = url.searchParams.get('id');

  const JSONtext = `{
    "restaurant_id": ${restaurant},
    "name": "${name}",
    "rating": ${rating},
    "comments": "${comment}"
  }`;

  var createNewReviewPromise = new Promise(resolve => DBHelper.createNewReview(JSON.parse(JSONtext), resolve));
  createNewReviewPromise.then((JsonNewReview) => {
    // Store reivew to indexedDB
    DBHelper.saveReivewsToIndexedDB(JsonNewReview);

    // Update review HTML
    const ul = document.getElementById('reviews-list');
    ul.insertAdjacentHTML('beforeend', createReviewHTML(JsonNewReview));
    alert('Your review added successfully! Thank you.');
    // reset form
    document.getElementById('review-form').elements['review-name'].value = '';
    document.getElementById('review-form').elements['review-comment'].value = '';

  });
}


// CONNECTIVITY ACTIONS

/**
 * Trigger connectivity status
 */
function addConnectivityListeners() {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}


/**
 * visual indicator of Offline status
 * and trigger synchronisation of offline data
 */
function updateOnlineStatus() {
  // let status = document.getElementById("onlineStatus");
  // const condition = navigator.onLine ? "online" : "offline";
  // status.className = condition;
  // status.innerHTML = condition.toUpperCase();

  // DBHelper.syncOfflineUpdates();
}
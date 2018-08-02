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
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;

      console.log('fetchRestaurantFromURL :', restaurant);

      if (!restaurant) {
        console.error(error);
        return;
      }

      fillRestaurantHTML(restaurant);
      callback(null, restaurant)
    });

    ReviewDBHelper.fetchReviewByRestaurantId(id, (error, reviews) => {
      self.reviews = reviews;

      console.log('fetchRestaurantFromURL :', reviews);

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
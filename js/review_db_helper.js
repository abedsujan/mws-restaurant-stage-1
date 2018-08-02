class ReviewDBHelper {

  static getCachedReviews() {
    return DBHelper.openDatabase()
      .then(function (db) {
        if (!db) {
          return;
        }

        var store = db.transaction('reviews').objectStore('reviews');

        return store.getAll();
      });
  }

  static readCachedReviewsById(storeName) {
    // TODO:
    return Promise.resolve([]);
  }

  static addReviews(reviews) {

    console.log();
    callback(null, reviews);
  }


  static fetchReviewsFromAPI(query_params) {

    return fetch(REVIEW_ENDPOINT + query_params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        return response.json();
      }).then(reviews => {
        // DBHelper.saveReviewsToCacheDatabase(reviews);
        return reviews;
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchReviews(callback) {

    return DBHelper.readAllData('reviews').then(function (reviews) {
        if (restaurants.length) {
          return Promise.resolve(reviews);
        } else {
          return DBHelper.fetchReviewsFromAPI();
        }
      })
      .then(ReviewDBHelper.addReviews)
      .catch(e => requestError(e));

      function requestError(e) {
        const error = (`Request failed. ${e}`);
        callback(error, null);
      }
  
  }

  /**
   * Fetch a review by its ID.
   */
  static fetchReviewById(id, callback) {
    // fetch all restaurants with proper error handling.

    console.log('>>>>fetchRestaurantBy<<<<<<');
    const query_params = id;


    return DBHelper.readDataById('restaurants').then(function (restaurant) {
        if (restaurant.length) {
          return Promise.resolve(restaurant);
        } else {
          console.log('fetch from fetchRestaurantsFromAPI');
          return ReviewDBHelper.fetchReviewsFromAPI(query_params);
        }
      })
      .then(ReviewDBHelper.addReviews)
      .catch(e => requestError(e));

      function requestError(e) {
        const error = (`Request failed. ${e}`);
        callback(error, null);
      }
  

  }

  /**
   * Fetch reviews by restaurant IDs.
   */
  static fetchReviewByRestaurantId(id, callback) {
    // fetch all restaurants with proper error handling.

    console.log('>>>>fetchReviewByRestaurantId<<<<<<');
    const query_params = '?restaurant_id=' + id;

    return DBHelper.readDataById('reviews').then(function (reviews) {
        if (reviews.length) {
          return Promise.resolve(reviews);
        } else {
          console.log('fetch from fetchReviewByRestaurantId');
          return ReviewDBHelper.fetchReviewsFromAPI(query_params);
        }
      })
      .then(addReviews)
      .catch(e => requestError(e));


      function addReviews(reviews) {
        callback(null, reviews);
      }

      function requestError(e) {
        const error = (`Request failed. ${e}`);
        callback(error, null);
      }
  }

}
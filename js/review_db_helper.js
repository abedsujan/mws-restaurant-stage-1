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

  static fetchReviewsFromAPI(query_params) {
    const fetch_url = REVIEW_ENDPOINT + query_params
    return DBHelper.fetchFromAPI(fetch_url)
      .then(reviews => {
        DBHelper.saveReivewsToIndexedDB(reviews);
        return reviews;
      });
  }

  /**
   * Fetch all reviews
   */
  static fetchReviews(callback) {

    return DBHelper.readAllData('reviews').then(function (reviews) {
        if (reviews.length) {
          return Promise.resolve(reviews);
        } else {
          return DBHelper.fetchReviewsFromAPI();
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

  /**
   * Fetch a review by its ID.
   */
  static fetchReviewById(id, callback) {

    return DBHelper.readDataById('restaurants').then(function (restaurant) {
        if (restaurant.length) {
          return Promise.resolve(restaurant);
        } else {
          const query_params = id;
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

  /**
   * Fetch reviews by restaurant IDs.
   */
  static fetchReviewByRestaurantId(id, callback) {
    const restaurant_id = id;
    return DBHelper.getCachedReviewsbyRestaurantID(id).then(function (reviews) {



        if (reviews && reviews.length) {

          const filteredReviews = reviews.filter(findByRestaurantID);
          console.log('ALLL reviews', reviews);
          if (filteredReviews.length > 0) {
            console.log('filtered reviews', filteredReviews);
            return Promise.resolve(reviews);

          } else {
            return ReviewDBHelper.fetchReviewsFromAPI(query_params);
          }
        } else {
          // fetching from API
          console.log('reviews fetching from API');
          return ReviewDBHelper.fetchReviewsFromAPI(query_params);
        }
      })
      .then(addReviews)
      .catch(e => requestError(e));

    function findByRestaurantID(review) {
      return review.restaurant_id == restaurant_id;
    }

    function addReviews(reviews) {
      callback(null, reviews);
    }

    function requestError(e) {
      const error = (`Request failed. ${e}`);
      callback(error, null);
    }
  }
}
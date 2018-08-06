class ReviewDBHelper {

  static fetchReviewsFromAPI(query_params) {
    const fetch_url = REVIEW_ENDPOINT + query_params
    return DBHelper.fetchFromAPI(fetch_url)
      .then(reviews => {
        DBHelper.saveReivewsToIndexedDB(reviews);
        return reviews;
      });
  }

  /**
   * Fetch reviews by restaurant IDs.
   */
  static fetchReviewByRestaurantId(id, callback) {
    const restaurant_id = id;
    const query_params = '?restaurant_id=' + id;
    return DBHelper.getCachedReviewsbyRestaurantID(id).then(function (reviews) {

        if (reviews && reviews.length) {

          const filteredReviews = reviews.filter(findReviewsByRestaurantID);
          console.log('ALLL reviews', reviews);
          if (filteredReviews.length > 0) {
            console.log('filtered reviews', filteredReviews);
            return Promise.resolve(filteredReviews);
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

    function findReviewsByRestaurantID(review) {
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

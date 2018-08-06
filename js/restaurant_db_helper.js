class RestaurantDBHelper {

  static fetchRestaurantsFromAPI(query_params) {

    const fetch_url = (query_params) ? RESTAURANT_ENDPOINT + query_params : RESTAURANT_ENDPOINT;

    return DBHelper.fetchFromAPI(fetch_url)
      .then(restaurants => {
        DBHelper.saveRestaurantsToIndexedDB(restaurants);
        return restaurants;
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    return DBHelper.readAllData('restaurants').then(function (restaurants) {
        if (restaurants.length) {
          return Promise.resolve(restaurants);
        } else {
          return RestaurantDBHelper.fetchRestaurantsFromAPI();
        }
      })
      .then(addRestaurants)
      .catch(e => requestError(e));


    function addRestaurants(restaurants) {
      callback(null, restaurants);
    }

    function requestError(e) {
      const error = (`Request failed. ${e}`);
      callback(error, null);
    }
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    const restaurant_id = id;
    return DBHelper.readAllData('restaurants').then(function (restaurants) {

        if (restaurants && restaurants.length) {

          const filteredRestaurants = restaurants.filter(findByRestaurantID);
          console.log('ALLL restaurants', restaurants);
          if (filteredRestaurants.length > 0) {
            console.log('filtered restaurants', filteredRestaurants);
            return Promise.resolve(filteredRestaurants[0]);
          } else {
            return RestaurantDBHelper.fetchRestaurantsFromAPI(restaurant_id);
          }
        } else {
          // fetching from API
          console.log('restaurants fetching from API');
          return RestaurantDBHelper.fetchRestaurantsFromAPI(restaurant_id);
        }

        // if (restaurant.length) {
        //   return Promise.resolve(restaurant);
        // } else {
        //   return RestaurantDBHelper.fetchRestaurantsFromAPI(id);
        // }

      })
      .then(addRestaurants)
      .catch(e => requestError(e));

    function findByRestaurantID(restaurant) {
      return restaurant.id == restaurant_id;
    }

    function addRestaurants(restaurants) {
      callback(null, restaurants);
    }

    function requestError(e) {
      const error = (`Request failed. ${e}`);
      callback(error, null);
    }
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    RestaurantDBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    RestaurantDBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    RestaurantDBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    RestaurantDBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    RestaurantDBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.id}.jpg`);
  }

  /**
   * Restaurant image URLs JSON.
   */
  static imageUrlsForRestaurant(restaurant) {
    const photograph = restaurant.photograph ? restaurant.photograph : 'NoImage';
    const representationsURLs = RestaurantDBHelper.imageRepresentationsPaths(photograph);
    return representationsURLs;
  }
  /**
   * Paths for various image representations
   */
  static imageRepresentationsPaths(filename) {
    const [folderName, suffix] = ['./img/', 'jpg'] //,'webp'];
    const small = folderName.concat(filename, '_w_400', '.', suffix);
    const large = folderName.concat(filename, '_w_800', '.', suffix);
    const regular = folderName.concat(filename, '.', suffix);

    return {
      small: small,
      large: large,
      regular: regular
    };
  }

  /**
   * Return set of responsive restaurant JPG images
   */
  static imageSourceForRestaurant(restaurant) {
    let srcset = '';
    restaurant.responsive_photo.forEach(element => {
      srcset += `img/${element},`;
    });
    return srcset;
  }


  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: RestaurantDBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

}
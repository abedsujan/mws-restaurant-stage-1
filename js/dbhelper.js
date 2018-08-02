/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   */
  static get DATABASE_URL() {
    const port = 1337;
    return `http://localhost:${port}`;
  }

  static fetchRestaurantsFromAPI(query_params) {

    const fetch_url = (query_params) ? RESTAURANT_ENDPOINT + query_params : RESTAURANT_ENDPOINT;
    
    return fetch(fetch_url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        return response.json();
      }).then(restaurants => {
        DBHelper.saveToDatabase(restaurants);

        return restaurants;
      });
  }


  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    return idb.open('RestaurantsDB', 1, function (upgradeDb) {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      store.createIndex('by-name', 'name');
    });
  }

  static saveToDatabase(data) {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');

      if (Array.isArray(data)) {
        data.forEach(function (restaurant) {
          store.put(restaurant);
        });
      } else {
        store.put(data);
      }

      return tx.complete;
    });
  }

  static getCachedRestaurants() {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) {
        return;
      }

      var store = db.transaction('restaurants').objectStore('restaurants');
      return store.getAll();
    });
  }

  static readAllData(storeName) {
    return DBHelper.openDatabase()
      .then(function (db) {
        var tx = db.transaction(storeName);
        var store = tx.objectStore(storeName);
        return store.getAll();
      })
  }

  static readDataById(storeName) {
    // TODO:
    return Promise.resolve([]);
  }


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    return DBHelper.readAllData('restaurants').then(function (restaurants) {
        if (restaurants.length) {
          return Promise.resolve(restaurants);
        } else {
          return DBHelper.fetchRestaurantsFromAPI();
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

    return DBHelper.readDataById('restaurants').then(function (restaurant) {
        if (restaurant.length) {
          return Promise.resolve(restaurant);
        } else {
          console.log('fetch from fetchRestaurantsFromAPI');
          return DBHelper.fetchRestaurantsFromAPI(id);
        }
      })
      .then(addRestaurants)
      .catch(e => requestError(e));

    // restaurant.reviews = ReviewDBHelper.fetchReviewByRestaurantId(id, callback);

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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    const representationsURLs = DBHelper.imageRepresentationsPaths(photograph);
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
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

}
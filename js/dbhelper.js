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

  static fetchFromAPI(fetch_url) {

    return fetch(fetch_url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        return response.json();
      });
  }

  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    return idb.open('RestaurantsDB', 2, function (upgradeDb) {
      var resStore = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      resStore.createIndex('by-name', 'name');

      var revStore = upgradeDb.createObjectStore('reviews', {
        keyPath: 'id'
      });
      revStore.createIndex('restaurant-id', 'restaurant_id');


    });
  }

  static saveRestaurantsToIndexedDB(restaurants) {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');

      if (Array.isArray(restaurants)) {
        restaurants.forEach(function (restaurant) {
          store.put(restaurant);
        });
      } else {
        store.put(restaurants);
      }

      return tx.complete;
    });
  }


  static saveReivewsToIndexedDB(reviews) {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      var tx = db.transaction(IDB_STORE_REVIEWS, 'readwrite');
      var store = tx.objectStore(IDB_STORE_REVIEWS);

      if (Array.isArray(reviews)) {
        reviews.forEach(function (review) {
          store.put(review);
        });
      } else {
        store.put(reviews);
      }

      console.log('Saved reviews to indexed db:', reviews);

      return tx.complete;
    });
  }


  static getCachedRestaurants() {
    return DBHelper.openDatabase()
      .then(function (db) {
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


  // Review IndexDB

  static getCachedReviewsbyRestaurantID(id) {
    return DBHelper.openDatabase()
      .then(function (db) {
        if (!db) {
          return;
        }

        var store = db.transaction('reviews').objectStore('reviews');

        // TODO: use get() with ID ot search specific
        return store.getAll();
      });
  }
  // End Review IndexDB

  static createNewReview(newReviewJSON, resolve) {
    fetch(REVIEW_ENDPOINT, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(newReviewJSON)
      })
      .then(response => response.json())
      .then(function (review) {
        console.log('Successfully added the new review', review);
        resolve(review);
      });
  }

}
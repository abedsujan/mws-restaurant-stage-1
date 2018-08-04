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
    return idb.open('RestaurantsDB', 1, function (upgradeDb) {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      store.createIndex('by-name', 'name');

      upgradeDb.createObjectStore('reviews', {
        keyPath: 'id'
      });
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

  static getCachedReviewsbyRestaurantID() {
    return DBHelper.openDatabase()
      .then(function (db) {
        if (!db) {
          return;
        }

        var store = db.transaction('reviews').objectStore('reviews');
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
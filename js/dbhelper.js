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
    // If the browser doesn't support service worker
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    return idb.open(INDEXDB_NAME, IDB_VERSION, function (upgradeDb) {
      var resStore = upgradeDb.createObjectStore(OBJECT_STORE_RESTAURANT, {
        keyPath: 'id'
      });
      resStore.createIndex('by-name', 'name');

      var revStore = upgradeDb.createObjectStore(OBJECT_STORE_REVIEW, {
        keyPath: 'id'
      });
      revStore.createIndex('restaurant-id', 'restaurant_id');
    });
  }

  static saveRestaurantsToIndexedDB(restaurants) {

    return DBHelper.openDatabase().then(function (db) {
      if (!db) {
        return
      };

      var tx = db.transaction(OBJECT_STORE_RESTAURANT, 'readwrite');
      var store = tx.objectStore(OBJECT_STORE_RESTAURANT);

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

  static readAllData(storeName) {
    return DBHelper.openDatabase()
      .then(function (db) {
        var tx = db.transaction(storeName);
        var store = tx.objectStore(storeName);
        return store.getAll();
      })
  }

  // Review IndexDB

  static getCachedReviewsbyRestaurantID(id) {
    return DBHelper.openDatabase()
      .then(function (db) {
        if (!db) {
          return;
        }

        var store = db.transaction(OBJECT_STORE_REVIEW).objectStore(OBJECT_STORE_REVIEW);

        // TODO: use get() with ID ot search specific
        return store.getAll();
      });
  }
  // End Review IndexDB

  static createNewReview(newReviewJSON, resolve) {

    if (navigator.onLine) {

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

      // Online update
      var createNewReviewPromise = new Promise(resolve => DBHelper.createNewReview(JSON.parse(JSONtext), resolve));
      createNewReviewPromise.then((JsonNewReview) => {
        // Store reivew to indexedDB
        DBHelper.saveReivewsToIndexedDB(JsonNewReview);

        // Update review HTML
        const ul = document.getElementById('reviews-list');
        ul.insertAdjacentHTML('beforeend', createReviewHTML(JsonNewReview));
        alert('Your review added successfully! Thank you.');
      });
    } else {

      window.addEventListener('online', () => this.createNewReview(newReviewJSON, resolve));
      alert('Review will automatically saved, when API back internet connection back to online');

    }

  }

}
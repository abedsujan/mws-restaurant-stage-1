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
        console.log('stored res data');
      }

      return tx.complete;
    });
  }

  static saveReivewsToIndexedDB(reviews) {
    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      var tx = db.transaction(OBJECT_STORE_REVIEW, 'readwrite');
      var store = tx.objectStore(OBJECT_STORE_REVIEW);

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

  // Review IndexedDB

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



  static getCachedRestaurantID(id) {
  const r_id =2;
    return DBHelper.openDatabase()
      .then(function (db) {
        var store = db.transaction(OBJECT_STORE_REVIEW).objectStore(OBJECT_STORE_REVIEW);
        return store.get(r_id);
      }).then(function(res){
        return res;
      });
  }


  // End Review IndexedDB

  // Update restaurant's favorite property in IDB

  static idbToggleFavorite(id, value, callback) {


    return DBHelper.openDatabase().then(function (db) {
      if (!db) return;

      console.log('id', id);
      console.log('is_favorite', value);


      var objectStore = db.transaction([OBJECT_STORE_RESTAURANT], "readwrite").objectStore(OBJECT_STORE_RESTAURANT);
      var request = objectStore.get(id);
      console.log('request', request);
      request.onerror = function (event) {
        console.log('error fetching restaurnt from database');
        // Handle errors!
      };
      request.onsuccess = function (event) {
        // Get the old value that we want to update
        var data = event.target.result;

        // update the value(s) in the object that you want to change
        data.is_favorite = value;

        // Put this updated object back into the database.
        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.log('error updating data', event);
          // Do something with the error
        };
        requestUpdate.onsuccess = function (event) {
          console.log('successfully updated favorite data');
          // Success - the data is updated!
        };
      };

      return callback(null, objectStore.complete);
    });
  }
  // End Review IndexedDB

  static updateRestaurantFavoriteStatus(id, is_favorite, callback) {

    if (!navigator.onLine) {
      alert('Oppsss');
    }

    fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}/?is_favorite=${is_favorite}`, {
        method: 'put'
      }).then(res => res.json())
      .then(res => {
        return callback(null, res);
      });
  }

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
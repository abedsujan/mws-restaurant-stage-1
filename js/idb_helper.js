
const IDB_DB_NAME = 'RestaurantsDB';
const IDB_STORE_RESTAURANTS = 'restaurants';
const IDB_STORE_REVIEWS = 'reviews';
const IDB_VERSION = 1;

/**
 * Common idb helper functions.
 */
/*eslint-disable no-unused-vars*/
class IDBHelper {

  static get dbPromise() {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    /*eslint-disable no-undef*/
    const dbPromise = idb.open(IDB_DB, IDB_VER);
    /*eslint-enable no-undef*/
    return dbPromise;
  }


  /**
   * Delete idb database if exists
   */
  static deleteOldDatabase() {
    let DBDeleteRequest = window.indexedDB.deleteDatabase(IDB_DB_NAME);
    DBDeleteRequest.onerror = function () {
      console.log('Error: deleting indexed database ' + IDB_DB_NAME);
    };
    DBDeleteRequest.onsuccess = function () {
      console.log('Success: successfully deleted!'+ IDB_DB_NAME);
    };
  }


  // static openDatabase() {

  //   if (!navigator.serviceWorker) {
  //     return Promise.resolve();
  //   }
  //   return idb.open(IDB_DB_NAME, IDB_VERSION, function (upgradeDb) {
  //     var store = upgradeDb.createObjectStore(IDB_STORE_RESTAURANTS, {
  //       keyPath: 'id'
  //     });

  //     store.createIndex('by-name', 'name');

  //     upgradeDb.createObjectStore('reviews', {
  //       keyPath: 'id'
  //     });
  //   });
  // }

  
}

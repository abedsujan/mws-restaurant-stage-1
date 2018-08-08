var markers = [];
var map;


/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cuisine = $("#cuisines-select option:selected").val();
  const neighborhood = $("#neighborhoods-select option:selected").val();

  RestaurantDBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = RestaurantDBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  if (location.pathname == "/") {
    fetchNeighborhoods();
    fetchCuisines();
  }
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  RestaurantDBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      fillNeighborhoodsHTML(neighborhoods);
    }
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  RestaurantDBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      fillCuisinesHTML(cuisines);
    }
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const toggleFavorite = (restaurant_id, is_favorite) => {

  // const state = (is_favorite) ? false : true;

  DBHelper.updateRestaurantFavoriteStatus(restaurant_id, !!is_favorite, function (err, res) {
    if (err) throw err;
    console.log(res);
    alert('triggered click event !!');
    window.location.reload(false);
  });
}


/**
 * mark as favorite.
 */
// let toggleFavorite = (flag) => {
//   DBHelper.toggleFavorite(restaurant.id, flag, function (err, res) {
//     if (err) throw err;
//     console.log(res);
//     window.location.reload(false);
//     //fillRestaurantHTML(res);
//   });
// };
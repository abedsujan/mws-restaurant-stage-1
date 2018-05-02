let restaurant;
var map;


// Register service worker
window.onload = () => {
  DBHelper.registerSW();
};
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {

  const restaurantContainer = document.getElementById('restaurant-container');
  restaurantContainer.innerHTML = `
    <h2 id="restaurant-name">${restaurant.name}</h2>
    <picture id="restaurant-img">
      <img class="restaurant-img" src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="Image of ${restaurant.photograph_alt} Restaurant">
    </picture>
    <p id="restaurant-cuisine">${restaurant.cuisine_type}</p>
  `;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  let tableRows = '';

  for (let key in operatingHours) {
    tableRows += `<tr>
                    <td>${key}</td>
                    <td>${operatingHours[key]}</td>
                  </tr>
                 `;
  }
  hours.insertAdjacentHTML('beforeend', tableRows);
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const containerInnerHtml = `
    <h3>Reviews</h3>
    ${ (!reviews) ? '<p>No reviews yet!</p>': createReviewListHTML(reviews) }
  `;

  container.insertAdjacentHTML('beforeend', containerInnerHtml);
}


/**
 * Create review list HTML and add it to the container.
 */
createReviewListHTML = (reviews) => {
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.insertAdjacentHTML('beforeend', createReviewHTML(review));
  });

  return ul;
}

/**
 * Create review HTML and add it to the list ul.
 */
createReviewHTML = (review) => {
  return `
    <li>
      <div class="review-header">
        <div class="reviewer">
          <h3>${review.name}</h3>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-rating">Rating: ${review.rating}</div>
      </div>
      <div class="review-comment">
        ${review.comments}
      </div>
    </li>
  `;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
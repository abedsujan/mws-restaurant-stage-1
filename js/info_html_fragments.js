/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant) => {

    const restaurantContainer = document.getElementById('restaurant-container');
    restaurantContainer.innerHTML = createRestaurantViewHTML(restaurant);

    const address = document.getElementById('restaurant-address');
    address.innerHTML = createRestaurantAddressHTML(restaurant.address);

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML(restaurant.operating_hours);
    }
    // fill reviews
    fillReviewsHTML(restaurant.reviews);
}

const createRestaurantViewHTML = (restaurant) => {
    const responsiveImages = DBHelper.imageUrlsForRestaurant(restaurant);
    const restaurantHTML = `
    <h2 id="restaurant-name">${restaurant.name}</h2>
    <picture id="restaurant-img">
        <source media="(min-width: 800px)" srcset="${responsiveImages.large}">
        <source media="(min-width: 400px)" srcset="${responsiveImages.small}">
        <img class="restaurant-img" src="${responsiveImages.regular}" srcset="${responsiveImages.regular}" alt="Image of ${restaurant.name} Restaurant">
    </picture>

    <p id="restaurant-cuisine">${restaurant.cuisine_type}</p>
  `;
    return restaurantHTML;
}

const createRestaurantAddressHTML = (address) => {
    const addressHTML = `
        <h3>Address</h3>
        <p>${address}</p>
    `;
    return addressHTML;
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews) => {
    const container = document.getElementById('reviews-container');

    const containerInnerHTML = `
      <h3 class="review-head">Reviews</h3>
      ${ (!reviews) ? '<p>No reviews yet!</p>': `<ul id="reviews-list"> ${createReviewListHTML(reviews)}</ul>` }
    `;

    container.insertAdjacentHTML('beforeend', containerInnerHTML);
}


/**
 * Create review list HTML and add it to the container.
 */
const createReviewListHTML = (reviews) => {
    let li = '';
    reviews.forEach(review => {
        li += createReviewHTML(review);
    });

    return li;
}

//Create review HTML and add it to the list ul 
const createReviewHTML = (review) => {
    const reviewHTML = `
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
    return reviewHTML;
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours) => {
    const openingHourDiv = document.getElementById('opening-hours');

    const openingHourDivInnerHTML = `
        <h3>Open Hours</h3>
        ${createOpeningHourHTML(operatingHours)}
    `;
    openingHourDiv.insertAdjacentHTML('beforeend', openingHourDivInnerHTML);
}

// Create restaurant days opening hours 
const createOpeningHourHTML = (operatingHours) => {
    let tableRowsHTML = '<table>';
    for (const key in operatingHours) {
        tableRowsHTML += `<tr>
                            <td>${key}</td>
                            <td>${operatingHours[key]}</td>
                        </tr>
                        `;
    }

    tableRowsHTML += `</table>`;
    return tableRowsHTML;
}
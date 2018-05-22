/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant) => {

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

createRestaurantViewHTML = (restaurant) => {

    const restaurantHTML = `
    <h2 id="restaurant-name">${restaurant.name}</h2>
    <picture id="restaurant-img">
      <img class="restaurant-img" src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="Image of ${restaurant.photograph_alt} Restaurant">
    </picture>
    <p id="restaurant-cuisine">${restaurant.cuisine_type}</p>
  `;
    return restaurantHTML;
}

createRestaurantAddressHTML = (address) => {
    const addressHTML = `
        <h3>Address</h3>
        <p>${address}</p>
    `;
    return addressHTML;
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews) => {
    const container = document.getElementById('reviews-container');

    const containerInnerHTML = `
      <h3>Reviews</h3>
      ${ (!reviews) ? '<p>No reviews yet!</p>': createReviewListHTML(reviews) }
    `;

    container.insertAdjacentHTML('beforeend', containerInnerHTML);
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

//Create review HTML and add it to the list ul 
createReviewHTML = (review) => {
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
fillRestaurantHoursHTML = (operatingHours) => {
    const openingHourDiv = document.getElementById('opening-hours');

    const openingHourDivInnerHTML = `
        <h3>Open Hours</h3>
        ${createOpeningHourHTML(operatingHours)}
    `;
    openingHourDiv.insertAdjacentHTML('beforeend', openingHourDivInnerHTML);
}

// Create restaurant days opening hours 
createOpeningHourHTML = (operatingHours) => {
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
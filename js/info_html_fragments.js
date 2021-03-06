/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant) => {

    const restaurantContainer = document.getElementById('restaurant-container');
    restaurantContainer.innerHTML = createRestaurantViewHTML(restaurant);

    const address = document.getElementById('restaurant-address');
    address.innerHTML = createRestaurantAddressHTML(restaurant.address);

    fillFavoriteHTML(restaurant);
    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML(restaurant.operating_hours);
    }
}

const createRestaurantViewHTML = (restaurant) => {
    const responsiveImages = RestaurantDBHelper.imageUrlsForRestaurant(restaurant);
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
    let review_date;
    if (review.createdAt !== null && review.createdAt !== undefined) {
        review_date = new Date(review.createdAt).toLocaleString();
    }

    const reviewHTML = `    
      <li>
        <div class="review-header">
          <div class="reviewer">
            <h3>${review.name}</h3>
            <span class="review-date">${review_date}</span>
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


const fillFavoriteHTML = (restaurant) => {
    const favoriteDiv = document.getElementById('favorite-star');

    const  is_favorite = (restaurant.is_favorite == 'true');

    const favoriteDivInnerHTML = `
    
    ${(is_favorite)? 
      `<span onclick="toggleFavorite('${restaurant.id}', '${restaurant.is_favorite}')" class="favorite" aria-label="Toggle click on start icon to remove the restaurant ${restaurant.name}" from your favorite list of restarurants> ★ </span>`
      :
      `<span onclick="toggleFavorite('${restaurant.id}', '${restaurant.is_favorite}')" aria-label="Click on start icon to make the ${restaurant.name} as your favorite restarurant"> ☆ </span>`}
    `;
    favoriteDiv.insertAdjacentHTML('beforeend', favoriteDivInnerHTML);
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
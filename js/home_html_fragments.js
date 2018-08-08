/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = `<option value="${neighborhood}">${neighborhood}</option>`;
    select.insertAdjacentHTML('beforeend', option);
  });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = `<option value="${cuisine}">${cuisine}</option>`;
    select.insertAdjacentHTML('beforeend', option);
  });
}

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  const responsiveImages = RestaurantDBHelper.imageUrlsForRestaurant(restaurant);
  const onclick_toggleFavorite = `toggleFavorite(${restaurant})`;
  const li = document.createElement('li');
  li.insertAdjacentHTML('beforeend', `
    <picture>
      <source media="(min-width: 800px)" srcset="${responsiveImages.large}">
      <source media="(min-width: 400px)" srcset="${responsiveImages.small}">
      <img class="restaurant-img" src="${responsiveImages.small}" srcset="${responsiveImages.small}" alt="Image of ${restaurant.name} Restaurant">
    </picture>
   <div class="favorite-star">
    ${(restaurant.is_favorite)? 
      `<span onclick="toggleFavorite('${restaurant.id}', '${restaurant.is_favorite}')" class="favorite" aria-label="Toggle click on start icon to remove the restaurant ${restaurant.name}" from your favorite list of restarurants> ★ </span>`
      :
      `<span onclick="toggleFavorite('${restaurant.id}', '${restaurant.is_favorite}')" aria-label="Click on start icon to make the ${restaurant.name} as your favorite restarurant"> ☆ </span>`}
    </div>
    <h3>${restaurant.name}</h3>
    <p>${restaurant.neighborhood}</p>
    <p>${restaurant.address}</p>
    <a href="${RestaurantDBHelper.urlForRestaurant(restaurant)}">View Details</a>
  `);

  return li;
}
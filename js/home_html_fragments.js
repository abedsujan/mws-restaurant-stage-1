/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = `<option value="${neighborhood}">${neighborhood}</option>`;
    select.insertAdjacentHTML('beforeend', option);
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = `<option value="${cuisine}">${cuisine}</option>`;
    select.insertAdjacentHTML('beforeend', option);
  });
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const responsiveImages = DBHelper.imageUrlsForRestaurant(restaurant);
  
  const li = document.createElement('li');
  li.insertAdjacentHTML('beforeend', `
    <picture>
      <source media="(min-width: 800px)" srcset="${responsiveImages.large}">
      <source media="(min-width: 400px)" srcset="${responsiveImages.small}">
      <img class="restaurant-img" src="${responsiveImages.small}" srcset="${responsiveImages.small}" alt="Image of ${restaurant.name} Restaurant">
    </picture>
    <h3>${restaurant.name}</h3>
    <p>${restaurant.neighborhood}</p>
    <p>${restaurant.address}</p>
    <a href="${DBHelper.urlForRestaurant(restaurant)}">View Details</a>
  `);

  return li;
}
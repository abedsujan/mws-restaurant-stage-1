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
  const li = document.createElement('li');
  li.insertAdjacentHTML('beforeend', `
    <picture>
      <img class="restaurant-img" src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="Image of ${restaurant.photograph_alt} Restaurant">
    </picture>
    <h3>${restaurant.name}</h3>
    <p>${restaurant.neighborhood}</p>
    <p>${restaurant.address}</p>
    <a href="${DBHelper.urlForRestaurant(restaurant)}">View Details</a>
  `);

  return li;
}

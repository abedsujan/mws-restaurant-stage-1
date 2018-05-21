/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  // Show breadcrumb menu in pages except path is root/homepage
  if (location.pathname == "/") {
    breadcrumb.style.display = 'none';
  } else {
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
  }
}
let tables = {};

window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }

  const expiration = Date.now() + (5 * 60 * 1000); // 5 minutes from now

  tables = JSON.parse(localStorage.getItem('tables'));
  const tables_expiration = localStorage.getItem('tables_expiration');

  if (tables && tables_expiration && Date.now() < tables_expiration) {
    console.log('tables : localStorage에서 가져옴.', tables);
  } else {

    get_category_user().then(tables => {
      console.log('tables: 서버에서 가져옴.', tables);
      localStorage.setItem('tables', JSON.stringify(tables));
      localStorage.setItem('tables_expiration', expiration);
    });
  }

  
  const search_result = document.getElementById("search_result");
  const post_data = localStorage.getItem('post_data');
  const postDataExpiration = localStorage.getItem('post_data_expiration');

  if (post_data && postDataExpiration && Date.now() < postDataExpiration) {
    const cardsHtml = JSON.parse(post_data);
    search_result.innerHTML = cardsHtml;
    console.log('cardsHtml : localStorage에서 가져옴.');
  } else {
    // If the post data is not available or expired, fetch it from the server
    get_posts('All', 1, 4, 1).then(cardsHtml => {
      console.log('cardsHtml : 서버에서 가져옴. ');
      // Save the post data in localStorage with an expiration time of 5 minutes
      localStorage.setItem('post_data', JSON.stringify(cardsHtml));
      localStorage.setItem('post_data_expiration', expiration);


      search_result.innerHTML = cardsHtml;
    });
  }
  

  const listContainer = document.querySelector('#list_container');

  Object.values(tables.category_table).forEach(category => {
    // create the button element for the category
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('btn', 'btn-toggle', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    categoryButton.setAttribute('data-bs-toggle', 'collapse');
    categoryButton.setAttribute('data-bs-target', `#${category.name}-collapse`);
    categoryButton.setAttribute('aria-expanded', 'false');
    categoryButton.textContent = category.name;

    // create the collapse element for the subcategories
    const subcategoriesCollapse = document.createElement('div');
    subcategoriesCollapse.classList.add('collapse');
    subcategoriesCollapse.setAttribute('id', `${category.name}-collapse`);

    // create the list element for the subcategories
    const subcategoriesList = document.createElement('ul');
    subcategoriesList.classList.add('btn-toggle-nav', 'list-unstyled', 'fw-normal', 'pb-1', 'small');

    // loop through the subcategories and generate the list items
    Object.values(category.category2_table).forEach(subcategory => {
      const subcategoryItem = document.createElement('li');
      const subcategoryLink = document.createElement('a');
      subcategoryLink.classList.add('link-dark', 'd-inline-flex', 'text-decoration-none', 'rounded');
      subcategoryLink.setAttribute('href', `/${category.name}?subcategory=${subcategory}`);
      subcategoryLink.textContent = subcategory;
      subcategoryItem.appendChild(subcategoryLink);
      subcategoriesList.appendChild(subcategoryItem);
    });

    // add the subcategories list to the collapse element
    subcategoriesCollapse.appendChild(subcategoriesList);

    // create the list item element for the category and add the button and collapse elements
    const categoryItem = document.createElement('li');
    categoryItem.classList.add('mb-1');
    categoryItem.appendChild(categoryButton);
    categoryItem.appendChild(subcategoriesCollapse);

    // add the category list item to the list container
    listContainer.appendChild(categoryItem);
  });
  
};

function format_date(date_str) {
  let date = new Date(date_str);
  let formattedDate = date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
  return formattedDate;
}

document.getElementById("goToDB").addEventListener("click", function () {
  window.location.href = "./tables/database";
});


/*
const texts = [
  "huch0 님의 최근 게시물",
  "서강준 님의 최근 게시물",
  "kyleidea 님의 최근 게시물",
  "뭔근근우여 님의 최근 게시물",
  "Code 카테고리의 최근 게시물",
  "Math 카테고리의 최근 게시물",
  "English 카테고리의 최근 게시물",
  "Essay 카테고리의 최근 게시물"
];

const randomText = texts[Math.floor(Math.random() * texts.length)];
document.getElementById("card_container").textContent = randomText;
*/

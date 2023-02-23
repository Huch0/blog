const generate_category_list = () => {
    const listContainer = document.querySelector('#list_container');

    Object.values(tables.category_table).forEach(maincategory => {
        const categoryItem = document.createElement('li');
        categoryItem.classList.add('mb-1');
        categoryItem.appendChild(createMaincategoryButton(maincategory));
        categoryItem.appendChild(createSubcategoryList(maincategory));
    
        listContainer.appendChild(categoryItem);
    });
};

function createMaincategoryButton(maincategory) {
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('btn', 'btn-toggle', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    categoryButton.setAttribute('data-bs-toggle', 'collapse');
    categoryButton.setAttribute('data-bs-target', `#${maincategory.name}-collapse`);
    categoryButton.setAttribute('aria-expanded', 'false');
    categoryButton.textContent = maincategory.name;

    return categoryButton;
};

function createSubcategoryList(maincategory) {
    const subcategoriesCollapse = document.createElement('div');
    subcategoriesCollapse.classList.add('collapse');
    subcategoriesCollapse.setAttribute('id', `${maincategory.name}-collapse`);

    const subcategoriesList = document.createElement('ul');
    subcategoriesList.classList.add('btn-toggle-nav', 'list-unstyled', 'fw-normal', 'pb-1', 'small');

    Object.values(maincategory.category2_table).forEach(subcategory => {
        const subcategoryItem = document.createElement('li');
        const subcategoryLink = document.createElement('a');
        subcategoryLink.classList.add('link-dark', 'd-inline-flex', 'text-decoration-none', 'rounded');
        subcategoryLink.setAttribute('href', `/home/${maincategory.name}?subcategory=${subcategory}`);
        subcategoryLink.textContent = subcategory;
        subcategoryItem.appendChild(subcategoryLink);
        subcategoriesList.appendChild(subcategoryItem);
    });

    subcategoriesCollapse.appendChild(subcategoriesList);

    return subcategoriesCollapse;
};
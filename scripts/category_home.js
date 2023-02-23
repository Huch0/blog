let tables = {};

window.onload = () => {
    if (new URL(location.href).searchParams.get('loginError')) {
        alert(new URL(location.href).searchParams.get('loginError'));
    }

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (params.has('search_type'))
        changeValue(params.get('search_type'));
    if (params.has('search_term'))
        document.querySelector('#search_input').value = params.get('search_term');

    make_tables();

    make_posts_cards();

    const current_page = parseInt(params.get('page')) || 1;
    const current_subcategory = params.get('subcategory');
    const current_category = document.querySelector('title').innerText;
    const listContainer = document.querySelector('#list_container');
    const category_btn_group = document.querySelector('#category_btn_group');

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
            subcategoryLink.setAttribute('href', `/home/${category.name}?subcategory=${subcategory}`);
            subcategoryLink.textContent = subcategory;
            subcategoryItem.appendChild(subcategoryLink);
            subcategoriesList.appendChild(subcategoryItem);

            if (category.name === current_category)
                category_btn_group.appendChild(generate_category_btns(subcategory, current_subcategory));
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

    const totalPosts = document.querySelector('#post_count').innerHTML;
    generate_pagination(totalPosts, current_page, current_subcategory);

    const search_form = document.querySelector('#search_form');
    search_form.addEventListener('submit', (event) => {
        event.preventDefault();

        console.log('Client LOG / search_form submitted');
        // Get the current URL and create a URLSearchParams object from it

        const search_type = document.querySelector('#search_dropdown').innerHTML;
        const search_term = document.querySelector('#search_input').value;

        // Set the query parameter based on the search term
        params.set('search_type', search_type);
        params.set('search_term', search_term);

        // Update the URL with the new query parameters
        url.search = params.toString();
        const newUrl = url.toString();

        // Redirect the browser to the new URL
        window.location.href = newUrl;
    });
};



const make_posts_cards = () => {
    const search_result = document.getElementById("search_result");
    const res_posts = JSON.parse(document.querySelector('#res_posts').innerText);
    console.log('res_posts : ', res_posts);

    let cardsHtml = "";

    for (let i = 0; i < res_posts.length; i++) {
        const post = res_posts[i];
        console.log('post', post);
        cardsHtml += createDiv(post.path, post.thumbnail_url, post.Category2Id, post.title, post.description, post.UserId, format_date(post.createdAt), "2400");
    }
    if (!cardsHtml) {
        search_result.innerHTML =
            `<div class="alert alert-warning" role="alert" style="margin-top:200px;margin-bottom:200px">
          검색 결과가 없습니다 :(
        </div>`;
    } else {
        search_result.innerHTML = cardsHtml;
    }
};

function generate_pagination(totalPosts, currentPage, current_subcategory) {
    console.log('pagination func activated, totposts, currentapgae : ', totalPosts, currentPage);
    const postsPerPage = 8;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const maxPagesToShow = 5;

    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        // show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // generate HTML tags
    let html = '<nav aria-label="Page navigation example" class="container text-center">';
    html += '<ul class="pagination d-flex justify-content-center">';
    // previous button
    if (currentPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="?subcategory=${current_subcategory}&page=${currentPage - 1}">Prev</a></li>`;
    } else {
        html += '<li class="page-item disabled"><a class="page-link" href="#">Prev</a></li>';
    }
    // page buttons
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<li class="page-item active"><a class="page-link" href="?subcategory=${current_subcategory}&page=${i}">${i}</a></li>`;
        } else {
            html += `<li class="page-item"><a class="page-link" href="?subcategory=${current_subcategory}&page=${i}">${i}</a></li>`;
        }
    }
    // next button
    if (currentPage < totalPages) {
        html += `<li class="page-item"><a class="page-link" href="?subcategory=${current_subcategory}&page=${currentPage + 1}">Next</a></li>`;
    } else {
        html += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
    }
    html += '</ul></nav>';


    document.querySelector('#pagination_container').innerHTML = html;
    return html;
}

function format_date(date_str) {
    let date = new Date(date_str);
    let formattedDate = date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
    return formattedDate;
}

const generate_category_btns = (subcategory, current_subcategory) => {
    const category_btn = document.createElement('a');
    category_btn.classList.add('btn', 'btn-outline-info', 'm-1');
    if (current_subcategory === subcategory)
        category_btn.classList.add('active');

    category_btn.setAttribute('type', 'button');
    category_btn.setAttribute('href', `?subcategory=${subcategory}`)
    category_btn.textContent = subcategory;

    return category_btn;
};


function changeValue(value) {
    const btn = document.getElementById("search_dropdown");
    btn.innerHTML = value;
    console.log("Selected value:", value);
}
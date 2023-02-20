let tables = {};

const contentDiv = document.querySelector('#main_content');
const headings = Array.from(contentDiv.querySelectorAll('h1, h2, h3, h4'));
//console.log("headings : ", headings);

const index_group = document.querySelector('#index_group');

const clipboardMessage = document.getElementById('clipboard-message');
const shareIcon = document.querySelector('#share-icon');

window.onload = () => {

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
            subcategoryLink.setAttribute('href', '#');
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


    headings.forEach((heading) => {
        const headingId = heading.textContent;
        const headingLevel = heading.nodeName.slice(1);
        const marginLeft = (headingLevel - 1) * 5;

        const indexItem = document.createElement('div');
        indexItem.style.marginLeft = `${marginLeft}px`;

        const indexLink = document.createElement('a');
        indexLink.className = 'index_link'
        indexLink.textContent = headingId;
        indexLink.href = `#${headingId.split(' ').join('-')}`;

        indexItem.appendChild(indexLink);
        index_group.appendChild(indexItem);
    });


    window.addEventListener('scroll', updateIndexGroup);
    window.addEventListener('resize', updateIndexGroup);

    shareIcon.addEventListener('click', copyLink);
};

function updateIndexGroup() {
    // Get the current scroll position
    const scrollTop = window.scrollY || window.pageYOffset;

    // Find the <h> tag that is currently at the top of the screen
    const currentHeading = headings.find(heading => heading.offsetTop - 50 <= scrollTop && scrollTop <= heading.offsetTop + 50);
    //console.log('updateIndexGroup STARTED', scrollTop, currentHeading.offsetTop, currentHeading);

    // If no heading is found, return 
    if (!currentHeading) {
        return;
    }

    const indexLinks = document.querySelectorAll('.index_link');

    // Update the style of the corresponding link in the index group
    indexLinks.forEach(link => {
        const href = link.getAttribute('href');
        const id = href.substring(1);
        //console.log(currentHeading, href, id);
        if (id === currentHeading.getAttribute('id')) {
            link.style.color = 'black';
            link.style.fontSize = '15px';
        } else {
            link.style.color = '';
            link.style.fontSize = '';
        }
    });
}

function copyLink() {
    // copy the link to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function () {
        // show the message
        showMessage();
    });
}

function showMessage() {
    clipboardMessage.style.display = 'block';
    setTimeout(function () {
        clipboardMessage.style.display = 'none';
    }, 3000); // hide after 3 seconds
}
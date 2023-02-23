let tables = {};

const contentDiv = document.querySelector('#main_content');
const headings = Array.from(contentDiv.querySelectorAll('h1, h2, h3, h4'));
//console.log("headings : ", headings);

const index_group = document.querySelector('#index_group');

const clipboardMessage = document.getElementById('clipboard-message');
const shareIcon = document.querySelector('#share-icon');

window.onload = () => {

    make_tables();

    generate_category_list();

    make_index_group();

    const prev_post = JSON.parse(document.querySelector('#prev_post').innerHTML);
    const next_post = JSON.parse(document.querySelector('#next_post').innerHTML);
    create_prev_next_cards(prev_post, next_post);


    window.addEventListener('scroll', update_index_group);
    window.addEventListener('resize', update_index_group);

    shareIcon.addEventListener('click', copy_link);
};

const make_index_group = () => {
    headings.forEach((heading) => {
        let headingId = heading.id;
        if (!headingId) {
            headingId = heading.textContent.trim().replace(/\s+/g, '-');
            heading.id = headingId;
        }
        const headingLevel = heading.nodeName.slice(1);
        const marginLeft = (headingLevel - 1) * 5;

        const indexItem = document.createElement('div');
        indexItem.style.marginLeft = `${marginLeft}px`;

        const indexLink = document.createElement('a');
        indexLink.className = 'index_link'
        indexLink.textContent = heading.textContent;
        indexLink.href = `#${headingId}`;

        indexItem.appendChild(indexLink);
        index_group.appendChild(indexItem);
    });
};
function update_index_group() {
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

function copy_link() {
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

const create_prev_next_cards = (prev_post, next_post) => {
    let prev_card = '';
    let next_card = '';

    if (prev_post) {
        const prev_main_category = tables.category_table[prev_post.MaincategoryId].name;
        const prev_sub_category = findSubCategoryNameById(tables.category_table, prev_post.SubcategoryId);
        const prev_category = prev_main_category + ' / ' + prev_sub_category;
        const prev_author = tables.user_table[prev_post.UserId];
        const prev_date = format_date(prev_post.createdAt);

        prev_card = `
        <div class="col-md-6">
          <div class="pn_card row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <a href="/post/${prev_post.id}">
              <div class="col p-4 d-flex flex-column position-static">
                <div><i class="fa-solid fa-chevron-left"></i>이전글</div>
                <strong class="d-inline-block mb-2 text-info">${prev_category}</strong>
                <div class="pn_title mb-0">${prev_post.title}</div>
                <div class="pn_description card-text mb-auto">${prev_post.description}</div>
                <div class="mb-1 text-muted">by ${prev_author} - ${prev_date}</div>
              </div>
            </a>
          </div>
        </div>
      `;
    }

    if (next_post) {
        const next_main_category = tables.category_table[next_post.MaincategoryId].name;
        const next_sub_category = findSubCategoryNameById(tables.category_table, next_post.SubcategoryId);
        const next_category = next_main_category + ' / ' + next_sub_category;
        const next_author = tables.user_table[next_post.UserId];
        const next_date = format_date(next_post.createdAt);
        
        next_card = `
        <div class="col-md-6">
          <div class="pn_card row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <a href="/post/${next_post.id}">
              <div style="text-align: right;" class="col p-4 d-flex flex-column position-static">
                <div>다음글<i class="fa-solid fa-chevron-right"></i></div>
                <strong class="d-inline-block mb-2 text-info">${next_category}</strong>
                <div class="pn_title mb-0">${next_post.title}</div>
                <div class="pn_description card-text mb-auto">${next_post.description}</div>
                <div class="mb-1 text-muted">by ${next_author} - ${next_date}</div>
              </div>
            </a>
          </div>
        </div>
      `;
    }
    const container = document.querySelector("#prev_next_cards");
    container.innerHTML = `${prev_card}${next_card}`;
    return;
};

function format_date(date_str) {
    let date = new Date(date_str);
    let formattedDate = date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
    return formattedDate;
}
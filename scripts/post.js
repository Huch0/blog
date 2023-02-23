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

    window.addEventListener('scroll', update_index_group);
    window.addEventListener('resize', update_index_group);

    shareIcon.addEventListener('click', copy_link);
};

const make_index_group = () => {
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

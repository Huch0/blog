
const get_posts = async (searchType, searchTerm, numberOfResults, page) => {
    //searchType = 'All', 'User', 'Title', 'Category'
    console.log(searchType, searchTerm, numberOfResults, page);

    if (!searchType || !searchTerm || !numberOfResults || !page) {
        alert('검색 Form을 모두 채우세요');
        return;
    }

    const query = `searchType=${searchType}&searchTerm=${searchTerm}&numberOfResults=${numberOfResults}&page=${page}`;

    axios.get(`/post_db/search?${query}`)
        .then(response => {
            console.log(response.data);
            const posts = response.data.posts;
            console.log('posts', posts);

            let cardsHtml = "";
            const search_result = document.getElementById("search_result");

            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                console.log('post', post);
                cardsHtml += createDiv(post.path, post.thumbnail_url, post.Category2Id, post.title, post.description, post.UserId, format_date(post.createdAt), "2400");
            }
            search_result.innerHTML = cardsHtml;
        })
        .catch(error => {
            console.error(error);
            alert("Failed to retrieve posts. Please try again later.");
        });

}

function createDiv(path, imgSrc, category_2, title, description, user, date, views) {
    return `
        <div class="card p-0" style="width: 320px; height: 360px;">
            <a class="nav-link" href="/${path}">
                <img src="${imgSrc}" class="card-img-top" alt="thumbnail" style="width: 320px; height: 180px;">
                <div class="card-body" style="width: 320px; height: 180px;">
                    <h6 class="card-subtitle mb-2 text-muted">${category_2}</h6>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <h6 class="card-subtitle mb-2 text-muted">by ${user} - ${date}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${views} views</h6>
                </div>
            </a>
        </div>
    `;
}

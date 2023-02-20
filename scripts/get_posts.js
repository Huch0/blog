
const get_posts = (searchType, searchTerm, numberOfResults, page) => {
    return new Promise((resolve, reject) => {
        //searchType = 'All', 'User', 'Title', 'Category'
        console.log(searchType, searchTerm, numberOfResults, page);

        if (!searchType || !searchTerm || !numberOfResults || !page) {
            alert('검색 Form을 모두 채우세요');
            reject(new Error('검색 Form을 모두 채우세요'));
        }

        const query = `searchType=${searchType}&searchTerm=${searchTerm}&numberOfResults=${numberOfResults}&page=${page}`;

        axios.get(`/post_db/search?${query}`)
            .then(response => {
                console.log(response.data);
                const posts = response.data.posts;
                console.log('posts', posts);

                let cardsHtml = "";

                for (let i = 0; i < posts.length; i++) {
                    const post = posts[i];
                    console.log('post', post);
                    cardsHtml += createDiv(post.path, post.thumbnail_url, post.Category2Id, post.title, post.description, post.UserId, format_date(post.createdAt), "2400");
                }
                //console.log('cardsHtml : ', cardsHtml);
                resolve(cardsHtml);
            })
            .catch(error => {
                console.error(error);
                alert("요청이 너무 빠릅니다. 잠시 후 다시 시도하세요.");
                reject(error);
            });
    });
};
function createDiv(path, imgSrc, Category2Id, title, description, UserId, date, views) {
    const author = tables.user_table[UserId];
    console.log('tables : ', tables);

    const searchCategoryId = Category2Id; 
    const categoryTable = tables.category_table;
    let categoryName1, categoryName2;

    for (const key in categoryTable) {
        if (Object.hasOwnProperty.call(categoryTable, key)) {
            const category1 = categoryTable[key];
            const category2Table = category1.category2_table;
            if (Object.keys(category2Table).includes(searchCategoryId.toString())) {
                categoryName1 = category1.name;
                categoryName2 = category2Table[searchCategoryId];
                break;
            }
        }
    }
    const category = categoryName1 + ' / ' + categoryName2;

    return `
        <div class="card p-0 m-4" style="width: 20rem;">
            <a class="nav-link" href="/${path}">
                <img src="${imgSrc}" class="card-img-top" alt="thumbnail" style="height: 180px;">
                <div class="card-body">
                    <p id="cat_text" class="card-text mb-2 text-muted">${category}</p>
                    <h5 id="title_text" class="card-title">${title}</h5>
                    <p id="description_text" class="card-text">${description}</p>
                    <p id="author_text" class="card-text mb-2 text-muted">by ${author} - ${date}</p>
                </div>
            </a>
        </div>
    `;
};
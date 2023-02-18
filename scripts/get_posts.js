
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
function createDiv(path, imgSrc, category_2, title, description, user, date, views) {
    return `
        <div class="card p-0" style="width: 20rem;">
            <a class="nav-link" href="/${path}">
                <img src="${imgSrc}" class="card-img-top" alt="thumbnail" style="height: 180px;">
                <div class="card-body">
                    <p class="card-text mb-2 text-muted">${category_2}</p>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <p class="card-text mb-2 text-muted">by ${user} - ${date}</p>
                    <p class="card-text mb-2 text-muted">${views} views</p>
                </div>
            </a>
        </div>
    `;
}
/*
`
        <div class="card" style="width: 20rem;">
            <a class="nav-link" href="/${path}">
                <img src="${imgSrc}" class="card-img-top" alt="thumbnail">
                <div class="card-body">
                    <p class="card-text mb-2 text-muted">${category_2}</p>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <p class="card-text mb-2 text-muted">by ${user} - ${date}</p>
                    <p class="card-text mb-2 text-muted">${views} views</p>
                </div>
            </a>
        </div>
    `;
    */
/*
<div class="card" style="width: 20rem;">
     <img src="http://localhost:3000/img/1676708324761.png" class="card-img-top" alt="thumbnail" style="height: 180px;">  
     <div class="card-body">
       <h5 class="card-title">Card title</h5>
       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
       <a href="#" class="btn btn-primary">Go somewhere</a>
     </div>
   </div>
*/
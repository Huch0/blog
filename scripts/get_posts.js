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
            console.log('posts', posts);
        })
        .catch(error => {
            console.error(error);
            alert("Failed to retrieve posts. Please try again later.");
        });

}




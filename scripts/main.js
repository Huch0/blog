window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }


  get_posts('All', 1, 4, 1);
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
      <div class="col">
        <a class="nav-link" href="/${path}" style="width:280px; height:450px">
          <div class="card" style="width:280px; height:450px">
            <img src="${imgSrc}" class="card-img-top h-50" alt="thumbnail">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">${category_2}</h6>
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${description}</p>
              <h6 class="card-subtitle mb-2 text-muted">by ${user} - ${date}</h6>
              <h6 class="card-subtitle mb-2 text-muted">${views} views</h6>
            </div>
          </div>
        </a>
      </div>
    `;

}
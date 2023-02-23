let tables = {};

window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }

  make_tables();
  
  make_posts_cards();
  
  generate_category_list();
};

/*    여기부터는 함수 선언부    */
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

function format_date(date_str) {
  let date = new Date(date_str);
  let formattedDate = date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
  return formattedDate;
}

document.getElementById("goToDB").addEventListener("click", function () {
  window.location.href = "./tables/database";
});


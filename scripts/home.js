
window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }

  const search_result = document.getElementById("search_result");
  // Check if the post data is already stored in localStorage and is not expired
  const post_data = localStorage.getItem('post_data');
  const postDataExpiration = localStorage.getItem('post_data_expiration');

  if (post_data && postDataExpiration && Date.now() < postDataExpiration) {
    const cardsHtml = JSON.parse(post_data);
    search_result.innerHTML = cardsHtml;
    console.log('localStorage에서 가져옴.');
  } else {
    // If the post data is not available or expired, fetch it from the server
    get_posts('All', 1, 4, 1).then(cardsHtml => {
      console.log('in home.js / posts :', cardsHtml);
      // Save the post data in localStorage with an expiration time of 5 minutes
      const expiration = Date.now() + (5 * 60 * 1000); // 5 minutes from now
      localStorage.setItem('post_data', JSON.stringify(cardsHtml));
      localStorage.setItem('post_data_expiration', expiration);
      

      search_result.innerHTML = cardsHtml;
    });
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

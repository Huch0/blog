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

window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }
};

document.getElementById("goToDB").addEventListener("click", function () {
  window.location.href = "./tables/database";
});
// 8개의 문구를 배열로 선언합니다.
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

// 배열에서 랜덤으로 하나의 문구를 선택합니다.
const randomText = texts[Math.floor(Math.random() * texts.length)];

// 선택된 문구를 화면에 표시합니다.
document.getElementById("text").textContent = randomText;


const aaaa = document.getElementById("joo");
let cardsHtml = "";

for (let i = 0; i < 4; i++) {
  cardsHtml += createDiv("./img/test0000.jpeg", "doralpak", "youtuber", "abcd", "efgh", "2400");
}

aaaa.innerHTML = cardsHtml;
function createDiv(imgSrc, title, subtitle, text, date, views) {
  return `
      <div class="col">
        <a class="nav-link" href="/post" style="width:280px; height:450px">
          <div class="card" style="width:280px; height:450px">
            <img src="${imgSrc}" class="card-img-top h-50" alt="thumbnail">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">${subtitle}</h6>
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${text}</p>
              <h6 class="card-subtitle mb-2 text-muted">by huch0 - ${date}</h6>
              <h6 class="card-subtitle mb-2 text-muted">${views} views</h6>
            </div>
          </div>
        </a>
      </div>
    `;
}
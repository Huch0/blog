/*
    필요한 기능
    1. 글쓰기 버튼을 눌렀을 때 editor 안에 있는 내용을 서버로 POST함.
    2. 카테고리 dropdown버튼이 작동하게 변경
    3. 취소 버튼 누르면 이전 페이지로 돌아감
*/
let licenseKey = null;

$.ajax({
    url: 'http://localhost:3000/getLicenseKey',
    type: 'GET',
    success: function (data) {
        licenseKey = data.licenseKey;
    }
});

/*
이미지 업로드 버튼을 누른다.
1. 이미지 선택해서 업로드 
2. 이벤트 리스너로 업로드된 파일 확인.
3. 서버에 post/img 요청
4. 서버가 이미지 저장후 경로를 응답해줌
5. 그 경로를 가진 이미지 태그 생성
6. 
2. 서버에 post /img 요청.
3. 서버에서 이미지 경로를 받아옴.
4. 받아온 파일 경로를 넣어 커서가 깜빡이는 곳에 <img src="~~"> 삽입
*/
console.log('hi');



const form = document.querySelector('#editor_form');
const img_upload_btn = document.querySelector("#img_upload");

// 이미지 업로드 버튼 POST 요청
img_upload_btn.addEventListener('click', event => {
    event.preventDefault();

    let uploaded_imgs = document.querySelector("#img_input").files;
    console.log(uploaded_imgs);

    const formData = new FormData();

    for (let i = 0; i < uploaded_imgs.length; i++) {
        const img = uploaded_imgs[i];
        const formData = new FormData();
        console.log(img, uploaded_imgs);
        formData.append("img", img);
        console.log(formData);
        const img_container = document.querySelector('#img_container');

        axios.post('/post/img', formData)
            .then((res) => {
                console.log(res);
                const prev_img = createImgPreview(res.data.url, res.data.url, 1);
                console.log(prev_img);
                img_container.appendChild(prev_img);

                //document.getElementById('img-url').value = res.data.url;
                //document.getElementById('img-preview').src = res.data.url;
                //document.getElementById('img-preview').style.display = 'inline';
            })
            .catch((err) => {
                console.error(err);
            });
    }

});
function createImgPreview(imgSrc, imgAlt, checkboxChecked) {
    const div = document.createElement("div");
    div.id = "img_preview";
    div.className = "preview_img mx-3";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = imgAlt;
    img.style.weight = "60px";
    img.style.height = "60px";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checkboxChecked;

    div.appendChild(img);
    div.appendChild(input);

    return div;
}

/*
insert_img_btn.addEventListener('click', event => {
    event.preventDefault();

    const preview_imgs = document.getElementsByClassName('preview_img');
    const cursor = window.getSelection().getRangeAt(0);
    const tmpNode = document.createTextNode("이미지 넣기 테스트");
    console.log(tmpNode);
    cursor.deleteContents();
    cursor.insertNode(tmpNode);
    //console.log(preview_imgs);

    for (let i = 0; i < preview_imgs.length; i++){
        const preview_img = preview_imgs[i];
        const img_src = preview_img.querySelector('img').src;
        const checkbox = preview_img.querySelector('input[type="checkbox"]');
        //console.log(img_src, checkbox);

        if (checkbox.checked) {
            
        }
    }
})
*/

function changeValue(value) {
    const btn = document.getElementById("category_dropdown");
    btn.innerHTML = value;
    console.log("Selected value:", value);
  }

// 게시글 작성 버튼 

const submit_btn = document.querySelector("#submit_btn");

submit_btn.addEventListener('click', event => {
    event.preventDefault();

    const title_input = document.querySelector("#title_input").value;
    const description_input = document.querySelector("#description_input").value;
    const category = document.querySelector('#category_dropdown').innerHTML;

    console.log(title_input, description_input, category);

    // Get the data from the CKEditor 5 instance
    const data = ckeditor.getData();
    //console.log(ckeditor);

    //console.log(data);
    // Send the data to the server
    sendDataToServer(data);
});

function sendDataToServer(data) {
    const formData = new FormData();
        console.log(data);
        formData.append('content', data);
        axios.post('/post/', formData)
          .then((res) => {
            console.log('Post succeeded');
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
};



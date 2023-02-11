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

        axios.post('/uploads/upload', formData)
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

const delete_img_btn = document.querySelector("#delete_img_btn");

delete_img_btn.addEventListener('click', (event) => {
    event.preventDefault();

    const preview_imgs = document.getElementsByClassName('preview_img');
    let checked_imgs = [];
    let checked_index = [];

    for (let i = 0; i < preview_imgs.length; i++) {
        const checkbox = preview_imgs[i].querySelector('input[type="checkbox"]');
        if(checkbox.checked) {
            checked_imgs.push(preview_imgs[i].querySelector('img').src);
            checked_index.push(i);
        }
    }
    console.log(checked_imgs);

    axios.delete('/uploads/delete', {
        data: {
            urls: checked_imgs
        }
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response);
        console.log(preview_imgs, checked_index);
        //Delete preview_imgs[i] tag in html
        for (let j = checked_index.length - 1; j >= 0; j--) {
            preview_imgs[checked_index[j]].remove();
        }

    })
    .catch(error => {
        console.error(error);
    });

    
});


const delete_all_imgs_btn = document.querySelector('#delete_all_imgs_btn')
delete_all_imgs_btn.addEventListener('click', (event) => {
    event.preventDefault();

    alert('준비중');
})

function changeValue(value) {
    const btn = document.getElementById("category_dropdown");
    btn.innerHTML = value;
    console.log("Selected value:", value);
  }



const ids = [' ', 'Web', 'AI'];
// 게시글 작성 버튼 
const submit_btn = document.querySelector("#submit_btn");

submit_btn.addEventListener('click', event => {
    event.preventDefault();

    const title_input = document.querySelector("#title_input").value;
    const description_input = document.querySelector("#description_input").value;
    const category = document.querySelector('#category_dropdown').innerHTML;
    const category2_id = ids.indexOf(category);

    console.log(title_input, description_input, category, category2_id);
    if (!title_input) {
        alert('제목 채우세요');
        return;
    } else if (!description_input) {
        alert('설명 채우세요');
        return;
    } else if (category == 'Category') {
        alert('카테고리 고르세요');
        return;
    }

    // Get the data from the CKEditor 5 instance
    const editor_content = ckeditor.getData();

    // Send the data to the server
    sendDataToServer(title_input, description_input, category2_id, editor_content);
});

function sendDataToServer(title_input, description_input, category2_id, editor_content) {
    const formData = new FormData();
        console.log(editor_content);
        formData.append('title', title_input);
        formData.append('description', description_input);
        formData.append('category2_id', category2_id);
        formData.append('content', editor_content);
        axios.post('/post_upload/', formData)
          .then((res) => {
            console.log('Post succeeded');
            console.log(res);
            window.location.href = "/"; // redirect the user to the main page
          })
          .catch((err) => {
            console.error(err);
          });
};




/*
    필요한 기능
    1. 글쓰기 버튼을 눌렀을 때 editor 안에 있는 내용을 서버로 POST함.
    2. 카테고리 dropdown버튼이 작동하게 변경
    3. 취소 버튼 누르면 이전 페이지로 돌아감
*/



let category_ids = {};
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    if (postId) {
        axios.get(`/post_db/${postId}`)
            .then(res => {
                console.log(res);
                /*
                const titleInput = document.getElementById('title');
                const descriptionInput = document.getElementById('description');
                titleInput.value = data.title;
                descriptionInput.value = data.description;
                */
            })
            .catch(error => console.error(error));
    }
    axios.get('/category_db/category_dropdown')
        .then(response => {
            const category_dropdown_menu = document.querySelector('#category_dropdown_menu');

            //console.log(response.data.generated_menu); 
            category_dropdown_menu.innerHTML = response.data.generated_menu;
            category_ids = response.data.generated_ids;
        })
        .catch(error => {
            console.error(error);
        });
};




function changeValue(value) {
    const btn = document.getElementById("category_dropdown");
    btn.innerHTML = value;
    console.log("Selected value:", value);
}


const thumbnail_upload_btn = document.querySelector('#thumbnail_upload_btn');
//썸네일 업로드 버튼 POST 요청
thumbnail_upload_btn.addEventListener('click', event => {
    event.preventDefault();

    let thumbnail_img = document.querySelector("#thumbnail_input").files[0];
    console.log(thumbnail_img);

    const formData = new FormData();

    formData.append("img", thumbnail_img);
    console.log(formData);
    const thumbnail_container = document.querySelector('#thumbnail_container');

    axios.post('/uploads/upload', formData)
        .then((res) => {
            console.log(res);
            const prev_img = createImgPreview("prev_thumbnail", res.data.url, res.data.url, 0);
            console.log(prev_img);
            thumbnail_container.appendChild(prev_img);
        })
        .catch((err) => {
            console.error(err);
        });
});

const delete_thumbnail_btn = document.querySelector("#delete_thumbnail_btn");

delete_thumbnail_btn.addEventListener('click', (event) => {
    event.preventDefault();

    const prev_thumbnails = document.getElementsByClassName('prev_thumbnail');
    let checked_imgs = [];
    let checked_index = [];

    for (let i = 0; i < prev_thumbnails.length; i++) {
        const checkbox = prev_thumbnails[i].querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            checked_imgs.push(prev_thumbnails[i].querySelector('img').src);
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
            console.log(prev_thumbnails, checked_index);
            //Delete preview_imgs[i] tag in html
            for (let j = checked_index.length - 1; j >= 0; j--) {
                prev_thumbnails[checked_index[j]].remove();
            }

        })
        .catch(error => {
            console.error(error);
        });


});

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
                const prev_img = createImgPreview("prev_img", res.data.url, res.data.url, 1);
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
function createImgPreview(id, imgSrc, imgAlt, checkboxChecked) {
    const div = document.createElement("div");
    div.id = id;
    if (id == "prev_img") {
        div.className = "prev_img mx-3";
    } else {
        div.className = "prev_thumbnail mx-3";
    }

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = imgAlt;

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

    const prev_imgs = document.getElementsByClassName('prev_img');
    console.log("prev_imgs", prev_imgs);
    let checked_imgs_url = [];
    let checked_index = [];

    for (let i = 0; i < prev_imgs.length; i++) {
        const checkbox = prev_imgs[i].querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            checked_imgs_url.push(prev_imgs[i].querySelector('img').src);
            checked_index.push(i);
        }
    }
    console.log(checked_imgs_url);

    axios.delete('/uploads/delete', {
        data: {
            urls: checked_imgs_url
        }
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response);
            console.log(prev_imgs, checked_index);
            //Delete preview_imgs[i] tag in html
            for (let j = checked_index.length - 1; j >= 0; j--) {
                prev_imgs[checked_index[j]].remove();
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



// 게시글 작성 버튼 
const submit_btn = document.querySelector("#submit_btn");

submit_btn.addEventListener('click', event => {
    event.preventDefault();

    const title_input = document.querySelector("#title_input").value;
    const description_input = document.querySelector("#description_input").value;
    const category = document.querySelector('#category_dropdown').innerHTML;

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
    //console.log('category : ', category);
    const category2_id = category_ids[category];

    try {
        const thumbnail_url = document.querySelector("#prev_thumbnail img").src;

        console.log(title_input, description_input, thumbnail_url, category, category2_id);

        // Get the data from the CKEditor 5 instance
        const editor_content = ckeditor.getData();

        // Send the data to the server
        sendDataToServer(title_input, description_input, thumbnail_url, category2_id, editor_content);
    } catch (error) {
        if (!document.querySelector("#prev_thumbnail img")) {
            alert('썸네일 고르세요');
        }
        console.error(error);
    }

});

function sendDataToServer(title_input, description_input, thumbnail_url, category2_id, editor_content) {
    const formData = new FormData();
    console.log(editor_content);
    formData.append('title', title_input);
    formData.append('description', description_input);
    formData.append('thumbnail_url', thumbnail_url);
    formData.append('category2_id', category2_id);
    formData.append('content', editor_content);
    axios.post('/post_db/', formData)
        .then((res) => {
            console.log('Post succeeded');
            console.log(res);
            window.location.href = "/"; // redirect the user to the main page
        })
        .catch((err) => {
            console.error(err);
        });
};

// Update Post
const updatePost = async (postId, dbUpdates, contentUpdates) => {
    try {
        const response = await axios.post(`/update/${postId}`, {
            db_updates: dbUpdates,
            content_updates: contentUpdates
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const dbUpdates = {
    title: "New Title",
    description: "New Description"
};
const contentUpdates = {
    currentString: "Old Title",
    newString: "New Title"
};

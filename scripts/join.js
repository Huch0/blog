const join_form = document.querySelector('#join_form');

// join_form submit POST 요청
join_form.addEventListener('submit', event => {
    event.preventDefault();

    const nick = event.target.elements.nick.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const checkbox = event.target.elements.checkbox.checked;
    console.log(nick, email, password, checkbox);

    const formData = new FormData();
    console.log(img, uploaded_imgs);
    formData.append("nick", nick);
    formData.append("email", email);
    formData.append("password", password);

    axios.post('/auth/join', formData)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });

});
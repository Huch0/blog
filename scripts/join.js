const join_form = document.querySelector('#join_form');

// join_form submit POST 요청
join_form.addEventListener('submit', event => {
    event.preventDefault();

  const formData = new FormData(join_form);
  const nick = formData.get("nick");
  const email = formData.get("email");
  const password = formData.get("password");

  axios.post("/auth/join", {
    nick,
    email,
    password
  })
  .then((res) => {
    console.log(res);
    window.location.replace('/');
  })
  .catch((error) => {
    console.error(error);
  });

});
const join_form = document.querySelector('#join_form');

// join_form submit POST 요청
join_form.addEventListener('submit', event => {
    event.preventDefault();

  const formData = new FormData(join_form);
  const name = formData.get("name");
  const introduction = formData.get("introduction");
  const profile_url = formData.get("profile_url");
  const email = formData.get("email");
  const password = formData.get("password");

  axios.post("/auth/join", {
    name,
    introduction,
    profile_url,
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
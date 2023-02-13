window.onload = () => {
  if (new URL(location.href).searchParams.get('loginError')) {
    alert(new URL(location.href).searchParams.get('loginError'));
  }
};

document.getElementById("goToDB").addEventListener("click", function () {
  window.location.href = "./tables/database";
});
window.onload = () => {
    if (new URL(location.href).searchParams.get('loginError')) {
      alert(new URL(location.href).searchParams.get('loginError'));
    }
  };

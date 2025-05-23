function logout() {
  fetch("/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        alert("Logout failed.");
      }
    })
    .catch((err) => {
      console.error("Logout error:", err);
      alert("An error occurred.");
    });
}

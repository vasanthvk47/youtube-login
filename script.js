function login() {
  const username = document.getElementById("username").value;
  if (username.trim() !== "") {
    document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;
    document.getElementById("login-container").style.display = "none";
    document.querySelector(".background").style.display = "none";
    document.getElementById("welcome-container").style.display = "block";
  } else {
    alert("Please enter your name.");
  }
}

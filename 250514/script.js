const loginForm = document.getElementById("loginForm");

const loginEvent = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (result.success) {
    alert("로그인 성공");
  } else {
    alert("로그인 실패");
  }
};

loginForm.addEventListener("submit", loginEvent);

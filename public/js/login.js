document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  console.log(data);

  if (data.success) {
    window.location.href = "/";
  } else {
    alert(data.message);
  }
});
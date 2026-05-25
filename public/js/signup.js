document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      console.log("Login success:", data.user);

      // redirect manually (optional)
      window.location.href = "/";
    } else {
      console.log("Login failed:", data.message);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
document.querySelector("#signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name     = document.querySelector("#name").value;
  const email    = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const dob      = document.querySelector("#dob").value;
  const phone    = document.querySelector("#phone").value;
  const gender   = document.querySelector("#gender").value;

  try {
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, dob, phone, gender })
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/profile";
    } else {
      alert(data.message || "Aanmelden mislukt. Probeer opnieuw.");
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
});

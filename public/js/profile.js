async function loadProfile() {
  try {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.success) {
      window.location.href = "/login";
      return;
    }

    const u = data.user;
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email;

    document.getElementById("profile-name").textContent = fullName;
    document.getElementById("profile-name-detail").textContent = fullName;
    document.getElementById("profile-role-tag").textContent = u.role || "-";
    document.getElementById("profile-role").textContent = u.role || "-";
    document.getElementById("profile-email").textContent = u.email || "-";
    document.getElementById("profile-phone").textContent = u.phone || "-";
    document.getElementById("profile-address").textContent = u.address || "-";
    document.getElementById("profile-blood-type").textContent = u.blood_type || "-";
    document.getElementById("profile-gender").textContent = u.gender || "-";

    const dob = u.birth_date ? new Date(u.birth_date).toLocaleDateString("nl-NL") : "-";
    document.getElementById("profile-dob").textContent = dob;
  } catch (err) {
    console.error("Profiel laden mislukt:", err);
  }
}

loadProfile();

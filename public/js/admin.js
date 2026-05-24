document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const naam = document.querySelector("#naam").value;
    const email = document.querySelector("#email").value;

    try {
        const res = await fetch("http://localhost:3000/patients",{
            method: "POST",
            headers: {
                "content type":"application/json"
            },
            body: JSON.stringify({
                naam: naam
                email: email 
            })
        });
        
        const data = await res.json();
        console.log("Server response:", data);
    }   catch (error) {
        console.error("Fout bij het versturen:", error);
    }
});

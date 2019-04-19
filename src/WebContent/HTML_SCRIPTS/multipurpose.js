
async function callLogin(event){
    event.preventDefault();

    let payload = {
        username: document.getElementById("myusername").value,
        password: document.getElementById("mypassword").value
    }
    
    const resp = await fetch("/login", {
        method: "POST",
        payload: 'include',
        body: JSON.stringify(payload),
        headers: {
            'content-type': 'application/json'
        }
    });
    try {
        const user = await resp.json();
        localStorage.setItem('currentUser', JSON.stringify(user));  
        console.log(localStorage.getItem('currentUser'));
        window.location = "../loggedinpage.html";
    }
    catch {
        console.log("Failed to login");
        window.location = "../loginfailurepage.html";
    }
}
///userslistpage.html

async function callAllUsers(event){
    event.preventDefault();
    let user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(user);
    let payload = {
        username: user.username,
        password: user.passkey
    }

    console.log(payload);

}

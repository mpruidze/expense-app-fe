let firstNameE;
let lastNameE;
let inputFirstName = '';
let inputLastName = '';
let email;
let password;
let inputEmail = '';
let inputPassword = '';
let id;
let userId;
let token;
let firstName;
let lastName;


window.onload = async () => {
    firstNameE = document.getElementById('firstName');
    lastNameE = document.getElementById('lastName');
    email = document.getElementById('email');
    password = document.getElementById('password');
    const signupBtn = document.getElementById("signup");
    const loginBtn = document.getElementById("login");
    if (firstNameE && lastNameE) {
        firstNameE.addEventListener('change',updateFirstName);
        lastNameE.addEventListener('change',updateLastName);
        firstNameE.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault;
                lastNameE.focus();
            }
        });
        lastNameE.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault;
                email.focus();
            }
        });
    };
    email.addEventListener('change',updateEmail);
    password.addEventListener('change',updatePassword);
    email.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            password.focus();
        }
    });
    password.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            if (firstNameE && lastNameE) signupBtn.click();
            else loginBtn.click();
        }
    });
}

updateFirstName = (e) => {
    inputFirstName = e.target.value;
}
updateLastName = (e) => {
    inputLastName = e.target.value;
}
updateEmail = (e) => {
    inputEmail = e.target.value;
}
updatePassword = (e) => {
    inputPassword = e.target.value;
}
signUp = async () => {
        try {
            const resp = await fetch('https://expense-app-be.herokuapp.com/auth', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    firstName: inputFirstName,
                    lastName: inputLastName,
                    email: inputEmail,
                    password: inputPassword
                })
            });
            const result = await resp.json();

            // handling error messages
            const err_message = document.querySelector('.err-msg');
            if (resp.status !== 200) {
                err_message.innerHTML = `* ${result.message}`;
                return false;
            }
            inputFirstName = '';
            firstNameE.value = '';
            inputLastName = '';
            lastNameE.value = '';
            inputEmail = '';
            email.value = '';
            inputPassword = '';
            password.value = '';

            if (resp.status === 200) window.location.href = 'login.html';

        } catch (error) {
            console.log(`error signup`, error)
        }
}


login = async () => {
        try {
            const resp = await fetch('https://expense-app-be.herokuapp.com/auth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword,
                })
            });
            const result = await resp.json();
            token = result.token;

            // handling error messages
            const err_message = document.querySelector('.err-msg');
            if (resp.status !== 200) err_message.innerHTML = `* ${result.message}`;

            userId = result.user._id;
            firstName = result.user.firstName;
            lastName = result.user.lastName;

            localStorage.setItem('access_token',JSON.stringify(token));
            localStorage.setItem('userId',JSON.stringify(userId));
            localStorage.setItem('firstName',JSON.stringify(firstName));
            localStorage.setItem('lastName',JSON.stringify(lastName));

            inputEmail = '';
            email.value = '';
            inputPassword = '';

            window.location.href = 'expense.html';
        } catch (error) {
            console.log(`error login`, error)
        }
}
sign = () => window.location.href = 'signup.html';

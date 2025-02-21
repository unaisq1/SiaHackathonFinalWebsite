// Function to show only 'N' records from the database
function updateLimit() {
	let limitInput = document.querySelector('.N');
	let N = limitInput.value;
	console.log(`n client ${N}`);
	if (!window.location.search) {
		window.location.href = window.location.href + `?N=${N}`;
	} else {
		const search = window.location.search;
		window.location.search = search.replace('?', `?N=${N}&`);
	}
}


// Function to set a cookie
function setCookie(name, value, days) {
	let expires = '';
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	// Set the domain to 'localhost' and the path to '/'
	let domain = 'localhost';
	let path = '/'; // Set to the root path

	document.cookie =
		name + '=' + (value || '') + expires + '; path=' + path + '; domain=' + domain;
}

// Function to get a cookie value by name
function getCookie(name) {
	let nameEQ = name + '=';
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i];
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(nameEQ) == 0) {
			return cookie.substring(nameEQ.length, cookie.length);
		}
	}
	return null;
}

// Function to check cookies after initial loading page
const checkFromCookies = () => {
	const currentPage = document.documentElement;
	let status = getCookie('logged');
	console.log('logged?: ', status);
	if (status == 'true') {
		// document.querySelector('.stocksElement').style.display = 'block';
		currentPage.style.setProperty('--loginStatus', `block`);
	} else {
		// 	document.querySelector('.stocksElement').style.display = 'none';
		currentPage.style.setProperty('--loginStatus', `none`);
	}
};

// Where a user's email and password are checked
document.addEventListener('DOMContentLoaded', async (event) => {
    checkFromCookies();

    // Login functionality
    if (window.location.pathname == '/' || window.location.pathname == '/login') {
        const email = document.querySelector('input[name="email"]');
        const password = document.querySelector('input[name="password"]');
        const loginBtn = document.querySelector('button[name="loginButton"]');

        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const emailValue = email.value;
            const passwordValue = password.value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailValue, password: passwordValue }),
            });

            const result = await response.json();
            if (result.success) {
                setCookie('logged', 'true', 1);
                setCookie('userEmail', emailValue);
                checkFromCookies();
                window.location.href = '/index';
            } else {
                setCookie('logged', 'false', 1);
                checkFromCookies();
            }
        });

        // Sign-up functionality
        const newEmail = document.querySelector('input[name="newemail"]');
        const newPassword = document.querySelector('input[name="newPassword"]');
        const confirmPassword = document.querySelector('input[name="confirmPassword"]');
        const signupBtn = document.querySelector('button[name="signupButton"]');

        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const newEmailValue = newEmail.value;
            const newPasswordValue = newPassword.value;
            const confirmPasswordValue = confirmPassword.value;

            if (newPasswordValue === confirmPasswordValue) {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: newEmailValue, confirmPassword: confirmPasswordValue }),
                });

                const result = await response.json();
                if (result.success) {
                    setCookie('logged', 'true', 1);
                    setCookie('userEmail', newEmailValue);
                    checkFromCookies();
                    window.location.href = '/index'; // Redirect after successful sign-up
                } else {
                    alert('Sign-up failed.');
                }
            } else {
                alert('Passwords do not match.');
            }
        });
    }
});
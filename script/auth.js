function handleLogin(event) {
    event.preventDefault();
    const name = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    // Récupération des informations stockées
    const storedName = localStorage.getItem("userName");
    const storedPassword = localStorage.getItem("userPassword");
    const account = JSON.parse(localStorage.getItem('account')) || [];

    const user = account.find(acc => acc.email === userEmail && acc.password === userPassword);

    if (name === storedName && password === storedPassword) {
        localStorage.setItem("isLoggedIn", true);
        alert("Connexion réussie !");
        window.location.href = "/index.html"; // Redirection vers l'accueil
    } else if (name !== storedName && password === storedPassword) {
        alert("nom d'utilisateur  icorrect");
    } else if (password !== storedPassword && name === storedName) {
        alert("mot de passe incorrect");
    } else {
        alert("aucun compte trouvé");
    }
}
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const userEmail = document.getElementById('userName').value;
    const userPassword = document.getElementById('password').value;

    // Récupération des comptes existants

    const user = account.find(acc => acc.email === userEmail && acc.password === userPassword);

    if (user) {
        alert("Connexion réussie !");
        window.location.replace("index.html"); // Redirection vers la page d'accueil
    } else {
        alert("Email ou mot de passe incorrect.");
    }
});

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    // Stockage des informations dans le localstorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name)
    localStorage.setItem("userPassword", password);

    alert("Inscription réussie ! Vous pouvez vous connecter.");
    window.location.href = "/api/auth/signIn/connexion.html";
}

document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
});

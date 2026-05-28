// ======================================
// REGISTER.JS - StockEasy
// ======================================

// ======================================
// REGISTRO
// ======================================

function register() {

    clearMessages();

    // Obtener datos
    const name =
        document.getElementById("name")
        .value
        .trim();

    const business =
        document.getElementById("business")
        .value
        .trim();

    const email =
        document.getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value
        .trim();

    const confirmPassword =
        document.getElementById("confirm-password")
        .value
        .trim();

    // Validación
    let valid = true;

    // Nombre
    if (name.length < 3) {

        showError("name-error");

        valid = false;
    }

    // Negocio
    if (business.length < 3) {

        showError("business-error");

        valid = false;
    }

    // Email
    if (!validateEmail(email)) {

        showError("email-error");

        valid = false;
    }

    // Password
    if (password.length < 6) {

        showError("password-error");

        valid = false;
    }

    // Confirmar password
    if (password !== confirmPassword) {

        showError("confirm-error");

        valid = false;
    }

    if (!valid) return;

    // Obtener usuarios
    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    // Verificar si ya existe
    const exists = users.find(
        user => user.email === email
    );

    if (exists) {

        alert(
            "Este correo ya está registrado"
        );

        return;
    }

    // Crear usuario
    const newUser = {

        id: Date.now(),

        name: name,

        business: business,

        email: email,

        password: password,

        role: "emprendedor",

        createdAt:
            new Date().toLocaleDateString()
    };

    // Guardar
    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    // Mensaje éxito
    showSuccess();

    // Limpiar formulario
    clearForm();

    // Redireccionar
    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1800);
}

// ======================================
// VALIDAR EMAIL
// ======================================

function validateEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

// ======================================
// MOSTRAR ERROR
// ======================================

function showError(id) {

    document.getElementById(id)
        .style.display = "block";
}

// ======================================
// LIMPIAR MENSAJES
// ======================================

function clearMessages() {

    document
        .querySelectorAll(".error-message")
        .forEach(error => {

            error.style.display = "none";
        });

    document.getElementById(
        "success-message"
    ).style.display = "none";
}

// ======================================
// MOSTRAR ÉXITO
// ======================================

function showSuccess() {

    document.getElementById(
        "success-message"
    ).style.display = "block";
}

// ======================================
// LIMPIAR FORM
// ======================================

function clearForm() {

    document.getElementById("name")
        .value = "";

    document.getElementById("business")
        .value = "";

    document.getElementById("email")
        .value = "";

    document.getElementById("password")
        .value = "";

    document.getElementById("confirm-password")
        .value = "";
}

// ======================================
// MOSTRAR / OCULTAR PASSWORD
// ======================================

function togglePassword(inputId) {

    const input =
        document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";

    } else {

        input.type = "password";
    }
}

// ======================================
// ENTER PARA REGISTRAR
// ======================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            register();
        }
    }
);
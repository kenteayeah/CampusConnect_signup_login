document.addEventListener("DOMContentLoaded", () => {
  // Shared show/hide password feature for both pages.
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      button.textContent = showing ? "Show" : "Hide";
      button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) setupLogin(loginForm);

  const signupForm = document.getElementById("signupForm");
  if (signupForm) setupSignup(signupForm);

  const helpLink = document.getElementById("helpLink");
  if (helpLink) {
    helpLink.addEventListener("click", (event) => {
      event.preventDefault();
      showNotice("loginNotice", "If this were a live portal, you could contact your school administrator to reset your password.", "is-info");
    });
  }
});

function showNotice(id, message, type) {
  const notice = document.getElementById(id);
  if (!notice) return;
  notice.className = `notification ${type}`;
  notice.textContent = message;
}

function hideNotice(id) {
  const notice = document.getElementById(id);
  if (notice) {
    notice.className = "notification is-hidden";
    notice.textContent = "";
  }
}

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;
  error.textContent = message;
  input.classList.toggle("is-danger", Boolean(message));
  input.classList.toggle("is-success", !message && input.value.trim().length > 0);
}

function setupLogin(form) {
  const identity = document.getElementById("loginIdentity");
  const password = document.getElementById("loginPassword");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideNotice("loginNotice");
    let valid = true;

    const identityValue = identity.value.trim();
    if (!identityValue) {
      setError("loginIdentity", "identityError", "Enter your email or username.");
      valid = false;
    } else {
      setError("loginIdentity", "identityError", "");
    }

    if (!password.value) {
      setError("loginPassword", "loginPasswordError", "Enter your password.");
      valid = false;
    } else if (password.value.length < 8) {
      setError("loginPassword", "loginPasswordError", "Password must be at least 8 characters.");
      valid = false;
    } else {
      setError("loginPassword", "loginPasswordError", "");
    }

    if (valid) {
      // This is a front-end demonstration; there is no authentication server.
      showNotice("loginNotice", "Form looks good! Login is a front-end demo, so no account was authenticated.", "is-success");
    }
  });

  [identity, password].forEach((input) => {
    input.addEventListener("input", () => {
      const errorId = input === identity ? "identityError" : "loginPasswordError";
      if (input.value.trim()) setError(input.id, errorId, "");
    });
  });
}

function setupSignup(form) {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("signupEmail");
  const username = document.getElementById("signupUsername");
  const password = document.getElementById("signupPassword");
  const confirm = document.getElementById("confirmPassword");
  const terms = document.getElementById("agreeTerms");

  function checkPasswordStrength() {
    const value = password.value;
    const bar = document.getElementById("strengthBar");
    const text = document.getElementById("strengthText");
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const labels = ["not entered", "weak", "fair", "good", "strong"];
    const widths = ["0%", "25%", "50%", "75%", "100%"];
    const colors = ["#edf0f7", "#f14668", "#ffb454", "#48c78e", "#257953"];
    bar.style.width = widths[score];
    bar.style.backgroundColor = colors[score];
    text.textContent = `Password strength: ${value ? labels[score] : "not entered"}`;
  }

  function checkMatch() {
    if (!confirm.value) {
      setError("confirmPassword", "confirmPasswordError", "");
      return false;
    }
    const matches = confirm.value === password.value;
    setError("confirmPassword", "confirmPasswordError", matches ? "" : "Passwords do not match.");
    return matches;
  }

  password.addEventListener("input", () => {
    checkPasswordStrength();
    if (confirm.value) checkMatch();
  });
  confirm.addEventListener("input", checkMatch);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideNotice("signupNotice");
    let valid = true;

    if (fullName.value.trim().length < 2) {
      setError("fullName", "fullNameError", "Enter your full name.");
      valid = false;
    } else setError("fullName", "fullNameError", "");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      setError("signupEmail", "signupEmailError", "Enter a valid email address.");
      valid = false;
    } else setError("signupEmail", "signupEmailError", "");

    const usernamePattern = /^[A-Za-z0-9_]{3,20}$/;
    if (!usernamePattern.test(username.value.trim())) {
      setError("signupUsername", "signupUsernameError", "Use 3–20 letters, numbers, or underscores.");
      valid = false;
    } else setError("signupUsername", "signupUsernameError", "");

    if (password.value.length < 8) {
      setError("signupPassword", "signupPasswordError", "Use at least 8 characters.");
      valid = false;
    } else setError("signupPassword", "signupPasswordError", "");

    if (!confirm.value || confirm.value !== password.value) {
      setError("confirmPassword", "confirmPasswordError", "Passwords must match.");
      valid = false;
    } else setError("confirmPassword", "confirmPasswordError", "");

    const termsError = document.getElementById("termsError");
    if (!terms.checked) {
      termsError.textContent = "Please check the box to continue.";
      valid = false;
    } else termsError.textContent = "";

    if (valid) {
      showNotice("signupNotice", "All checks passed! This demo does not save accounts because no backend or database is connected.", "is-success");
      form.reset();
      [fullName, email, username, password, confirm].forEach((input) => {
        input.classList.remove("is-success", "is-danger");
      });
      document.querySelectorAll("#signupForm .help.is-danger").forEach((item) => item.textContent = "");
      document.getElementById("strengthBar").style.width = "0%";
      document.getElementById("strengthText").textContent = "Password strength: not entered";
      document.querySelectorAll("#signupForm [data-toggle-password]").forEach((button) => button.textContent = "Show");
      document.querySelectorAll("#signupForm input[type='password']").forEach((input) => input.type = "password");
    }
  });

  [fullName, email, username].forEach((input) => {
    input.addEventListener("input", () => {
      const errorIds = {
        fullName: "fullNameError",
        signupEmail: "signupEmailError",
        signupUsername: "signupUsernameError"
      };
      if (input.value.trim()) setError(input.id, errorIds[input.id], "");
    });
  });
}

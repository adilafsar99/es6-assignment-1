var newsObjs; //fetched news objects
function showNews(qSelector) {
  async function getNews(query) {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const response = await fetch(`https://newsapi.org/v2/everything?q=+${query}&from=${year}-${month}-${date}&language=en&sortBy=relevancy&apiKey=0ba00dda79bc413c833611d903ac4468`);
    const json = await response.json();
    alert("Returning JSON") //
    return json;
  }
  if (qSelector.selectedIndex === 0) {
    getNews("currency");
  } else {
    getNews(qSelector.value);
  }
  getNews().then(json => {
    alert("Fetched")
newsObjs = json.articles;
    let cardsDiv = document.querySelector("#newscards-div");
    for (let i = 0; i < json.articles.length; i++) {
      let card = `<div id="${i}" class="card">
      <img src="${json.articles[i].urlToImage}" class="card-img-top">
      <div class="card-body">
      <h5 class="card-title">${json.articles[i].title}</h5>
      <p class="card-text">
      ${json.articles[i]. description}
      </p>
      </div>
      <div class="card-footer">
      <a href="#" id="read-more-btn" class="btn btn-primary" onclick="expand(this)">Read more</a>
      </div>
      </div>`;
      cardsDiv.innerHTML += card;
    }
  });
}

let qSelector = document.querySelector("#q-selector");
showNews(qSelector);
qSelector.onchange = function () {
  showNews(qSelector);
};

/* Expand News Function */

function expand(newsLink) {
  let newsId = newsLink.parentNode.parentNode.id;
  let newsObj = newsObjs[newsId];
  sessionStorage.setItem("newsObj",
    JSON.stringify(newsObj));
  window.location.href = "newsPage.html";
}

/* User Objects Storage Script */

class User {
  constructor(name,
    email,
    password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

if (localStorage.getItem("usersArr") === null) {
  var usersArr = [];
  localStorage.setItem("usersArr", JSON.stringify(usersArr));
} else {
  var usersArr = JSON.parse(localStorage.getItem("usersArr"));
}

if (sessionStorage.getItem("userKey") !== null) {
  let signupLink = document.querySelector("#signup-link");
  signupLink.classList.add("d-none");
  let loginLinkItem = document.querySelector("#login-link-item");
  loginLinkItem.innerHTML = `<a id="logout-link" class="nav-link active" href="JavaScript:void(0)" onclick = "logout()">Log out</a>`;
  let accountLink = document.querySelector("#account-link");
  accountLink.classList.remove("d-none");
}

/* Signup - Login Authentication */

function authenticate(trigger) {
  let inputs;
  if (trigger.innerText === "Sign up") {
    inputs = document.querySelectorAll("#signupModal input");
  } else {
    inputs = document.querySelectorAll("#loginModal input");
  }
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].placeholder === "Enter Name") {
      let regex = /^(?=.{3,30}$)[a-z]+(?:['_.\s][a-z]+)*$/gim;
      let toContinue = validate(inputs[i], regex, trigger);
      if (!toContinue) {
        return;
      }
      if (trigger.innerText === "Sign up") {
        let toContinue = checkStorage(inputs[i], inputs[i].name);
        if (!toContinue) {
          return;
        }
        var name = inputs[i];
      }
    }
    if (inputs[i].placeholder === "Enter Email") {
      let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
      let toContinue = validate(inputs[i], regex, trigger);
      if (!toContinue) {
        return;
      }
      if (trigger.innerText === "Sign up") {
        let toContinue = checkStorage(inputs[i], inputs[i].name);
        if (!toContinue) {
          return;
        }
        var email = inputs[i];
      }
    }
    if (inputs[i].placeholder === "Enter Password") {
      let regex = /^((?=\S*?[a-zA-Z])(?=\S*?[0-9]).{6,})\S$/;
      let toContinue = validate(inputs[i], regex, trigger);
      if (!toContinue) {
        return;
      }
      if (trigger.innerText === "Sign up") {
        let toContinue = checkStorage(inputs[i], inputs[i].name);
        if (!toContinue) {
          return;
        }
        var password = inputs[i];
      }
    }
  }
  if (trigger.innerText === "Sign up") {
    let user = new User(name.value, email.value, password.value);
    usersArr.push(user);
    localStorage.setItem("usersArr", JSON.stringify(usersArr));
    alert("Sign up Successful!")
    window.location.reload(true);
  } else {
    login();
  }
}

function login() {
  let email = document.querySelector("#loginModal [placeholder='Enter Email']");
  let password = document.querySelector("#loginModal [placeholder='Enter Password']");
  let emailFound = false;
  let passFound = false;
  for (let i = 0; i < usersArr.length; i++) {
    if (usersArr[i].email === email.value) {
      emailFound = true;
      if (usersArr[i].password === password.value) {
        passFound = true;
        email.classList.remove("is-invalid");
        password.classList.remove("is-invalid");
        document.querySelector("#login-email-message").classList.add("d-none");
        document.querySelector("#login-password-message").classList.add("d-none");
        let userKey = i.toString();
        sessionStorage.setItem("userKey", userKey);
        alert("Log in Successful!");
        window.location.reload(true);
      }
    }
  }
  if (!emailFound) {
    email.classList.add("is-invalid");
    document.querySelector("#login-email-message").classList.remove("d-none");
    email.focus();
    emailFound = false;
  } else if (!passFound) {
    email.classList.remove("is-invalid");
    password.classList.add("is-invalid");
    document.querySelector("#login-email-message").classList.add("d-none");
    document.querySelector("#login-password-message").classList.remove("d-none");
    password.focus();
  }
}

function logout() {
  let toContinue = confirm("Are you sure?");
  if (toContinue) {
    sessionStorage.removeItem("userKey");
    let accountLink = document.querySelector("#account-link");
    accountLink.classList.add("d-none");
    let signupLink = document.querySelector("#signup-link");
    signupLink.classList.remove("d-none");
    let loginLinkItem = document.querySelector("#login-link-item");
    loginLinkItem.innerHTML = `<a id="login-link" class="nav-link active" href="JavaScript:void(0)" data-bs-toggle="modal" data-bs-target="#loginModal">Log in</a>`;
  }
}

function validate(inputField, regex, trigger) {
  let instructions = document.querySelector(`#${inputField.name}-message`);
  if (!regex.test(inputField.value)) {
    inputField.classList.add("is-invalid");
    if (trigger.innerText === "Sign up") {
      instructions.classList.add("bg-warning");
      instructions.classList.remove("bg-secondary");
    }
    inputField.focus();
    return false;
  } else {
    inputField.classList.remove("is-invalid");
    inputField.classList.add("is-valid");
    if (trigger.innerText === "Sign up") {
      let instructions = document.querySelector(`#${inputField.name}-message`);
      instructions.classList.add("bg-success");
      instructions.classList.remove("bg-warning");
    }
    return true;
  }
}

function checkStorage(inputField, fieldName) {
  for (let i = 0; i < usersArr.length; i++) {
    if (usersArr[i][fieldName] === inputField.value) {
      alert(`This ${fieldName} is not available`)
      inputField.classList.add("is-invalid");
      inputField.focus();
      return false;
    }
  }
  return true;
}

let modalBtns = document.querySelectorAll(".modal-footer button");
modalBtns.forEach(btn => {
  btn.addEventListener("click", func => authenticate(btn));
});

//localStorage.clear()
//sessionStorage.clear()

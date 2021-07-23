/* Show Expanded News Function */
function showExpandedNews(newsObj) {
   let news = `<div id="img-div">
  <img id="image" class="img-fluid img-thumbnail mt-3 mb-2" src="${newsObj.urlToImage}"/>
  </div>
  <div id="info-div">
  <div id="title-div">
  <h4 id="title">${newsObj.title}</h4>
  </div>
  <div id="author-div">
  <p id="author">${newsObj.author}</p>
  </div>
  </div>
  <div id="content-div">
  <p id="content">${newsObj.content}</p>
  </div>`;
  let newsDiv = document.querySelector("#news-div");
  newsDiv.innerHTML = news;
}

if (sessionStorage.getItem("newsObj") !== null) {
  let newsObj = JSON.parse(sessionStorage.getItem("newsObj"));
  showExpandedNews(newsObj);
}

/* Comments Objects Storage Script */

if (localStorage.getItem("cmntsRecArr") === null) {
  var cmntsRecArr = [];
  localStorage.setItem("cmntsRecArr", JSON.stringify(cmntsRecArr));
} else {
  var cmntsRecArr = JSON.parse(localStorage.getItem("cmntsRecArr"));
  for (let i = 0; i < cmntsRecArr.length; i++) {
    let post = `<div id="comment-div" class="border-secondary"><div><h6>${cmntsRecArr[i].name}</h6></div><div><p>${cmntsRecArr[i].comment}</p></div></div>`;
    let cmntsDiv = document.querySelector("#comments-div");
    cmntsDiv.innerHTML += post;
  }
}

/* Constuctor For Comment Records */

class CommentRecord {
  constructor(name, comment) {
    this.name = name;
    this.comment = comment;
  }
}

/* Comments Posting Script */

function postComments() {
  let name,
  comment;
  let cmntField = document.querySelector("[name='comment-field']");
  if (cmntField.value.length === 0) {
    cmntField.classList.add("is-invalid");
    cmntField.focus();
  } else {
    let onlySpaces = true;
    for (let i = 0; i < cmntField.value.length; i++) {
      if (cmntField.value[i] !== " ") {
        onlySpaces = false;
        break;
      }
    }
    if (onlySpaces) {
      cmntField.classList.add("is-invalid");
      cmntField.focus();
    } else {
      cmntField.classList.remove("is-invalid");
      if (sessionStorage.getItem("userKey") !== null && localStorage.getItem("usersArr") !== "[]") {
        let usersArr = JSON.parse(localStorage.getItem("usersArr"));
        let userKey = Number(sessionStorage.getItem("userKey"));
        name = usersArr[userKey].name;
      } else {
        name = "Anonymous";
      }
      comment = `${cmntField.value}`;
      let post = `<div id="comment-div" class="border-secondary"><div><h6>${name}</h6></div><div><p>${comment}</p></div></div>`;
      let cmntsDiv = document.querySelector("#comments-div");
      cmntsDiv.innerHTML += post;
      cmntField.value = "";
      let cmntRec = new CommentRecord(name, comment);
      cmntsRecArr.push(cmntRec);
      localStorage.setItem("cmntsRecArr", JSON.stringify(cmntsRecArr));
    }
  }
}

let postBtn = document.querySelector("#post-btn");
postBtn.onclick = function() {
  postComments();
};

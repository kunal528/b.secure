// import Web3 from 'web3';
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

let app = document.getElementById("app")

const provider = new ethers.providers.Web3Provider(window.ethereum)

console.log(provider)

function home() {
  let passwords = [1, 2, 3]
  let coins = 10
  function navbar() {
    let navbar = document.createElement("div");
    navbar.classList.add("navbar");
    let back = document.createElement("div");
    back.innerText = "Back";
    back.style.opacity = '0';
    let title = document.createElement("div");
    title.innerText = coins + " MATIC";
    title.classList.add('balance-text');
    let addFunds = document.createElement("div");
    addFunds.innerText = "Add Funds";
    addFunds.classList.add("navbar-button");
    addFunds.addEventListener("click", () => {

      // navigate to add funds page
      historyPage.push("add_fund")
      render()
    });
    navbar.append(back, title, addFunds);
    app.appendChild(navbar);
  }

  function content() {
    let content = document.createElement('div');
    content.classList.add("content");
    if (passwords.length == 0) {
      let text = document.createElement("h2")
      text.classList.add("heading")
      text.innerText = "No Passwords"
      let button = document.createElement("div")
      button.classList.add("primary-button")
      button.innerText = " + "
      button.addEventListener("click", () => {
        // navigate to add password page
        historyPage.push("add_details")
        render()
      })
      content.append(text, button)
    }
    passwords.forEach(element => {
      createPasswordTile(content)
    });
    // createPasswords(content)
    app.appendChild(content);
  }

  function action() {
    let action = document.createElement('div');
    action.classList.add("action");
    if (passwords.length != 0) {
      let button = document.createElement("div");
      button.classList.add("action-button");
      button.innerText = "Add More";
      button.addEventListener("click", () => {
        // navigate to add password page
        historyPage.push("add_details")
        render()
      })
      action.appendChild(button);
    }
    app.appendChild(action);
  }
  app.innerHTML = "";
  navbar()
  content()
  action()
}

function add_fund_view() {
  function navbar() {
    let navbar = document.createElement("div");
    navbar.classList.add("navbar");
    let back = document.createElement("div");
    back.innerText = "Back";
    back.addEventListener("click", () => {
      historyPage.pop()
      render()
    });
    let title = document.createElement("div");
    var addFunds = document.createElement("div");
    navbar.append(back, title, addFunds);
    app.appendChild(navbar);
  }

  function content() {
    let content = document.createElement('div');
    content.classList.add("content");
    let logo = document.createElement("img")
    logo.src = "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=023"
    logo.classList.add("logo")
    let text = document.createElement("h1")
    text.classList.add("heading")
    text.innerText = "Add Some MATIC to"
    let account = document.createElement("div")
    account.classList.add("account")
    account.innerText = "0xA3B38051Bf77067fcCb02D83eCEF9CcE27c81A31"
    account.addEventListener("click", () => {
      // copy to clipboard
      navigator.clipboard.writeText(account.innerText)
    })
    let button = document.createElement("div")
    button.classList.add("action-button")
    button.innerText = "Add Funds"
    button.addEventListener("click", () => {
      // open metamask
      window.open("https://wallet.matic.network/")
    })
    content.append(logo, text, account, button)
    app.appendChild(content);
  }
  app.innerHTML = "";
  navbar()
  content()
}

function add_details() {
  function navbar() {
    let navbar = document.createElement("div");
    navbar.classList.add("navbar");
    let back = document.createElement("div");
    back.innerText = "Back";
    back.addEventListener("click", () => {
      historyPage.pop()
      render()
    });
    let title = document.createElement("div");
    title.innerText = "0 MATIC";
    title.classList.add('balance-text');
    let addFunds = document.createElement("div");
    navbar.append(back, title, addFunds);
    app.appendChild(navbar);
  }
  function content() {
    let content = document.createElement('div');
    content.classList.add("content");
    let userinput = document.createElement("input")
    userinput.classList.add("user-input")
    userinput.type = "text"
    userinput.placeholder = "Enter Email"
    let passinput = document.createElement("input")
    passinput.classList.add("user-input")
    passinput.type = "password"
    passinput.placeholder = "Enter Password"
    let button = document.createElement("div")
    button.classList.add("action-button")
    button.innerText = "Add"
    content.append(userinput, passinput, button)
    app.appendChild(content);
  }
  navbar()
  content()
}

const historyPage = ["home"];

function render() {
  app.innerHTML = "";
  switch (historyPage[historyPage.length - 1]) {
    case "home":
      home()
      break;
    case "add_fund":
      add_fund_view()
      break;
    case "add_details":
      add_details()
      break;
    default:
      break;
  }
}
render()



function createPasswordTile(content) {
  let tile = document.createElement("div");
  tile.classList.add("tile");
  let title = document.createElement("div");
  title.classList.add("tile-title");
  title.innerText = "jainkunal976@gmail.com";
  let button = document.createElement("div");
  button.classList.add("tile-button");
  button.innerText = "Next";
  tile.append(title, button);
  content.appendChild(tile);
}

function createPasswords(content) {
  print("Creating passwords");
  for (let index = 0; index < 3; index++) {
    createPasswordTile(content)
  }
}

function getBalance() {
  let balance = document.getElementsByClassName("balance-text")[0];
  balance.innerText = "10 MATIC"
}





// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   console.log("clicked");
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });

// });

// // The body of this function will be execuetd as a content script inside the
// // current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.color = color;
//   });
// }

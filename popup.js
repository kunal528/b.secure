import { ethers } from "./ethers.min.js";
import Contract from './contracts/sample.json' assert { type: "json" };
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

let app = document.getElementById("app")
const CONTRACT_ADDRESS = '0x032FD6B1f03a4522e91E8daAC93121B1d22A7468'
const RPC_URL = 'https://rpc-mumbai.maticvigil.com'

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);


const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, provider);

async function getPassword(url) {
  if (url) {
    var data = await contract.getAllbyUrl(url)
    return data
  }
  var data = await contract.getAll()
  return data
}

async function setCreditentials({ url, username, password }) {
  await contract.set(url, username, password)
}



const account = null;

chrome.storage.sync.get("account", function (result) {
  if (!result) {
    var account = ethers.Wallet.createRandom()
    chrome.storage.sync.set({
      "account": {
        "privateKey": account.privateKey,
        "address": account.address
      }
    }, function () { })
  }
  account = result.account;
  console.log(account)
})

function updateBalance() {
  chrome.storage.sync.get("account", function (result) {
    if (result) {
      var account = result.account;
      var privateKey = account.privateKey;
      let wallet = new ethers.Wallet(privateKey, provider);
      wallet.getBalance().then((balance) => {
        var coins = document.getElementsByClassName("balance-text")[0];
        var data = (BigNumber(balance).toString())
        console.log(data)
        coins.innerText = ethers.utils.formatEther(balance) + " MATIC"
      })
    }
  });
}

function loading() {
  var loading = document.createElement("div");
  loading.classList.add("loading");
  loading.innerHTML = "<div>Loading...</div>";
  app.appendChild(loading);
}

async function home() {
  loading()
  let passwords = await getPassword()
  console.log(passwords)
  updateBalance()
  let coins = 0
  function navbar() {
    let navbar = document.createElement("div");
    navbar.classList.add("navbar");
    let back = document.createElement("div");
    back.innerHTML = "<img src='icons/back.svg' style='object-fit: cover;height:10px;width: 20px;'/>Back";
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
    let back = document.createElement("span");
    back.innerHTML = "<img src='icons/back.svg' style='object-fit: cover;height:10px;width: 20px;'/>Back";
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
    let _account = document.createElement("div")
    _account.classList.add("account")
    console.log(account)
    chrome.storage.sync.get("account", function (result) {
      if (result) {
        _account.innerText = result.account.address.substring(0, 10) + "..." + result.account.address.substring(result.account.address.length - 4,);
        _account.addEventListener("click", () => {
          // copy to clipboard
          navigator.clipboard.writeText(result.account.address)
        })
      }
    });
    let button = document.createElement("div")
    button.classList.add("action-button")
    button.innerText = "Add Funds"
    button.addEventListener("click", () => {
      // open metamask
      window.open("https://wallet.matic.network/")
    })
    content.append(logo, text, _account, button)
    app.appendChild(content);
  }
  app.innerHTML = "";
  navbar()
  content()
}

async function autoFillField() {
  let passwords = await getPassword()
  let username = document.getElementById("uname")
  let password = document.getElementById("pass")
  console.log(passwords)
  username.value = 'kjdsflkdsj'
  password.value = 'kljdflksjdlk'

}

function add_details() {
  updateBalance()
  autoFillField()
  function navbar() {
    let navbar = document.createElement("div");
    navbar.classList.add("navbar");
    let back = document.createElement("div");
    back.innerHTML = "<img src='icons/back.svg' style='object-fit: cover;height:10px;width: 20px;'/>Back";
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
    let content = document.createElement('form');
    content.classList.add("content");
    let userinput = document.createElement("input")
    userinput.classList.add("user-input")
    userinput.id = "uname"
    userinput.type = "text"
    userinput.placeholder = "Enter Email"
    let passinput = document.createElement("input")
    passinput.classList.add("user-input")
    passinput.id = "pass"
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

import { ethers } from "./ethers.min.js";
import Contract from './contracts/SecureVault.json' assert { type: "json" };
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

let app = document.getElementById("app")
const CONTRACT_ADDRESS = '0x6872967283CB2e20C6aB554EAdf8Db31A819320f'
const RPC_URL = 'https://rpc-mumbai.maticvigil.com'

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);


const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract, provider);


const historyPage = ["home"];


const account = null;

chrome.storage.sync.get("account", function (result) {
  if (!result.account) {
    var account = ethers.Wallet.createRandom()
    chrome.storage.sync.set({
      "account": {
        "privateKey": account.privateKey,
        "address": account.address
      }
    }, function () { })
  }
  account = result.account;
})

chrome.storage.local.get("creditentals", function (result) {
  if (result.creditentals) {
    var creditentals = result.creditentals;
    if (Object.keys(creditentals).length > 1) {
      console.log(creditentals)
      historyPage.push('add_details')
      render()
      return
    }
  }
  render()
})

async function getCreditentials({ url, account }) {

  if (account) {
    var privateKey = account.privateKey;
    let wallet = new ethers.Wallet(privateKey, provider);
    let contractWithSigner = contract.connect(wallet);
    var data = await contractWithSigner.getAll()
    console.log(data)
    var parsedData = [];
    for (const element in data) {
      const elementData = data[element];
      console.log(elementData, account)
      var decryptedPass = decryptText({
        account: account,
        encryptHex: elementData.password
      })
      parsedData.push({ ...elementData, password: decryptedPass })

    }
    return parsedData
  }
  return [];

}



function getAESInstance(account) {
  var instance = new aesjs.ModeOfOperation.ctr(aesjs.utils.utf8.toBytes(account.privateKey.substring(0, 16)), new aesjs.Counter(0));
  console.log(instance)
  return instance
}

function encryptText({ account, text }) {
  console.log(account)
  if (account) {
    var inBytes = aesjs.utils.utf8.toBytes(text);
    console.log('bytes : ', inBytes);
    var encryptedBytes = getAESInstance(account).encrypt(inBytes);
    console.log('encrypted bytes : ', encryptedBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log('encrypted hex : ', encryptedHex);
    return encryptedHex;
  }
  return '';
}

function decryptText({ account, encryptHex }) {
  console.log(account, encryptHex)
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptHex);
  var decryptedBytes = getAESInstance(account).decrypt(encryptedBytes);
  console.log('decrypted bytes : ', decryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log('decrypted text : ', decryptedText);
  return decryptedText;
}
async function setCreditentials({ url, username, password }) {
  console.log(url, username, password)
  chrome.storage.sync.get("account", async function (result) {
    if (result) {
      var encrpytPass = encryptText({
        account: result.account,
        text: password
      })
      console.log(encrpytPass)
      var account = result.account;
      var privateKey = account.privateKey;
      let wallet = new ethers.Wallet(privateKey, provider);
      let contractWithSigner = contract.connect(wallet);
      contractWithSigner.set(url, username, encrpytPass).catch(console.log)
      chrome.storage.local.set({ 'creditentals': null }, function () {
        historyPage.pop()
        render()
      });
    }
  });
}



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
        coins.innerText = ethers.utils.formatEther(balance).substring(0, 5) + " MATIC"
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
  chrome.storage.sync.get("account", async function (result) {
    if (result) {
      let passwords = await getCreditentials({
        account: result.account,
      })
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
          createPasswordTile(content, element)
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
  });
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
  chrome.storage.local.get("creditentals", function (result) {
    if (result.creditentals) {
      let creditentals = result.creditentals;
      let username = document.getElementById("uname")
      let password = document.getElementById("pass")
      console.log(creditentals)
      username.value = creditentals['0']
      password.value = creditentals['1']
    }
  });

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
    button.addEventListener("click", () => {
      let username = document.getElementById("uname")
      let password = document.getElementById("pass")
      //get url from current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = tabs[0].url;
        setCreditentials({
          url: url,
          username: username.value,
          password: password.value
        })
      });
    })
    content.append(userinput, passinput, button)
    app.appendChild(content);
  }
  navbar()
  content()
}


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

function createPasswordTile(content, data) {
  let tile = document.createElement("div");
  tile.classList.add("tile");
  let title = document.createElement("div");
  title.classList.add("tile-title");
  title.innerText = data.username;
  let button = document.createElement("div");
  button.classList.add("tile-button");
  button.innerText = "Next";
  button.addEventListener("click", () => {
    // navigate to add password page
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
      // request content_script to retrieve title element innerHTML from current tab
      chrome.tabs.sendMessage(tabs[0].id, {
        username: data.username,
        password: data.password,
      }, null, function (obj) {

      });

    });
  });
  tile.append(title, button);
  content.appendChild(tile);
}

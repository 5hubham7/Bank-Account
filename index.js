var accountNumber;
var services;
var welcome;
var accountUpdate;
var accountsList;
var accounts;
var statementTable;
var url;

const getAllAccounts = async () => {
    document.getElementById("accountsList").removeAttribute("hidden");
    accounts = document.getElementById("accounts");
    url = "http://localhost:3000/getAllAccounts";

    accountsTable = [];

    let response = await fetch(url);
    let data = await response.json();

    for (let i in data) {
        accountsTable +=
            "<tr><td>" +
            (parseInt(i) + 1) +
            "</td><td>" +
            data[i].accountNumber +
            "</td><td>" +
            data[i].name +
            "</td><td>" +
            "<button class='btn btn-dark text-uppercase' id='accessAccount' onclick='accessAccount(" +
            data[i].accountNumber +
            ");'>Access</button>" +
            "</td>";
        accountsTable += "</tr>";
    }
    console.log("AAA");
    accounts.innerHTML = accountsTable;
};

const accessAccount = async (value) => {
    accountNumber = value;
    document.getElementById("statementTable").setAttribute("hidden", true);
    document.getElementById("accountsList").setAttribute("hidden", true);
    services = document.getElementById("services");
    welcome = document.getElementById("welcome");
    url = "http://localhost:3000/accessAccount/" + accountNumber;

    let response = await fetch(url);
    let data = await response.json();

    if (data.found) {
        welcome.innerHTML =
            "Hello <strong>" +
            data.name +
            "</strong>, Welcome to your account!";
        services.removeAttribute("hidden");
    } else {
        services.setAttribute("hidden", true);
    }
};

const withdraw = async () => {
    document.getElementById("statementTable").setAttribute("hidden", true);
    let withdrawAmount = document.getElementById("inputWithdrawAmount").value;
    accountUpdate = document.getElementById("accountUpdate");
    url =
        "http://localhost:3000/withdraw/" +
        accountNumber +
        "/" +
        withdrawAmount;

    let response = await fetch(url);
    let data = await response.json();
    if (data.balanceUpdated) {
        accountUpdate.innerHTML =
            "Withdraw successful! Updated balance: <strong>" +
            data.balance +
            "</strong>";
    } else {
        accountUpdate.innerHTML = data.error;
    }
};

const deposit = async () => {
    document.getElementById("statementTable").setAttribute("hidden", true);
    let depositAmount = document.getElementById("inputDepositAmount").value;
    accountUpdate = document.getElementById("accountUpdate");
    url =
        "http://localhost:3000/deposit/" + accountNumber + "/" + depositAmount;

    let response = await fetch(url);
    let data = await response.json();
    if (data.balanceUpdated) {
        accountUpdate.innerHTML =
            "Deposit successful! Updated balance: <strong>" +
            data.balance +
            "</strong>";
    }
};

const viewStatement = async () => {
    document.getElementById("statementTable").removeAttribute("hidden");
    url = "http://localhost:3000/statement/" + accountNumber;
    let response = await fetch(url);
    let data = await response.json();
    statement = document.getElementById("statement");
    let statementTable = "";
    for (let i = 0; i < data.length; i++) {
        statementTable += "<tr><td>" + (i + 1) + "</td>";
        for (let j = 0; j < data[i].length; j++) {
            statementTable += "<td>" + data[i][j] + "</td>";
        }
        statementTable += "</tr>";
    }
    statement.innerHTML = statementTable;
};

const createAccount = async () => {
    let name = document.getElementById("inputName").value;
    let balance = document.getElementById("inputBalance").value;
    let accountUpdate = document.getElementById("accountCreateUpdate");
    url = "http://localhost:3000/createAccount/" + name + "/" + balance;

    let response = await fetch(url);
    let data = await response.json();

    if (data.created) {
        accountUpdate.innerHTML =
            "Created Successfully!<br>Account number: <strong>" +
            data.accountNumber +
            "</strong> Account balance: <strong>" +
            data.balance +
            "</strong> ";
    }
};

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const fs = require("fs").promises;
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello!");
});

let accountDetails = [];

app.get("/getAllAccounts/", async (req, res) => {
    let accounts = [];
    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);
    for (i in accountDetails) {
        accounts.push({
            accountNumber: accountDetails[i].accountNumber,
            name: accountDetails[i].name,
        });
    }
    return res.send(accounts);
});

app.get("/accessAccount/:accountNumber", async (req, res) => {
    let accountNumber = req.params.accountNumber;

    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);

    let found = false;
    for (i in accountDetails) {
        if (accountDetails[i].accountNumber == accountNumber) {
            return res.send({ found: true, name: accountDetails[i].name });
        } else found = false;
    }
    if (!found) return res.send({ found: false });
});

app.get("/withdraw/:accountNumber/:withdrawAmount", async (req, res) => {
    let accountNumber = req.params.accountNumber;
    let withdrawAmount = req.params.withdrawAmount;

    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);

    for (i in accountDetails) {
        if (accountDetails[i].accountNumber == accountNumber) {
            if (
                parseInt(withdrawAmount) > 0 &&
                accountDetails[i].balance != 0 &&
                accountDetails[i].balance - parseInt(withdrawAmount) > 0
            ) {
                accountDetails[i].balance -= parseInt(withdrawAmount);
                accountDetails[i].statement.push([
                    new Date().toLocaleString(),
                    "Withdraw",
                    parseInt(withdrawAmount),
                    accountDetails[i].balance,
                ]);
                res.send({
                    balanceUpdated: true,
                    balance: accountDetails[i].balance,
                });
            } else {
                res.send({
                    balanceUpdated: false,
                    error: "Please enter the correct amount!",
                });
            }
        }
    }
    fs.writeFile(
        "accountDetails.json",
        JSON.stringify(accountDetails),
        (err) => {
            if (err) console.log(err);
        }
    );
});

app.get("/deposit/:accountNumber/:depositAmount", async (req, res) => {
    let accountNumber = req.params.accountNumber;
    let depositAmount = req.params.depositAmount;

    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);

    for (i in accountDetails) {
        if (accountDetails[i].accountNumber == accountNumber) {
            accountDetails[i].balance += parseInt(depositAmount);
            accountDetails[i].statement.push([
                new Date().toLocaleString(),
                "Deposit",
                parseInt(depositAmount),
                accountDetails[i].balance,
            ]);
            res.send({
                balanceUpdated: true,
                balance: accountDetails[i].balance,
            });
        }
    }
    fs.writeFile(
        "accountDetails.json",
        JSON.stringify(accountDetails),
        (err) => {
            if (err) console.log(err);
        }
    );
});

app.get("/statement/:accountNumber", async (req, res) => {
    let accountNumber = req.params.accountNumber;

    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);

    for (i in accountDetails) {
        if (accountDetails[i].accountNumber == accountNumber) {
            return res.send(accountDetails[i].statement);
        }
    }
});

app.get("/createAccount/:name/:balance", async (req, res) => {
    let name = req.params.name;
    let balance = req.params.balance;

    file = await fs.readFile("accountDetails.json", "utf8");
    accountDetails = await JSON.parse(file);
    accountDetails.push({
        name: name,
        accountNumber: accountDetails.length + 1,
        balance: parseInt(balance),
        statement: [],
    });
    res.send({
        created: true,
        accountNumber: parseInt(accountDetails.length),
        balance: parseInt(balance),
    });
    fs.writeFile(
        "accountDetails.json",
        JSON.stringify(accountDetails),
        (err) => {
            if (err) console.log(err);
        }
    );
});

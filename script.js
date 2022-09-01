"use strict";

// USER DATA
const account1 = {
  owner: "Alex Milea",
  pin: 1111,
  transactions: [1000, -25, -57, 500, 250, -150, -300, 1500, 132, 23],
  transactionDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-02-15T10:17:24.185Z",
    "2022-03-20T14:11:59.604Z",
    "2022-04-17T17:01:17.194Z",
    "2022-06-09T23:20:17.929Z",
    "2022-07-10T11:51:36.790Z",
    "2022-08-23T12:43:36.790Z",
    "2022-10-11T10:15:35.780Z",
  ],
  currency: "EUR",
  locale: "en-DE",
  interestRate: 1.5,
};

const account2 = {
  owner: "Marianne Milea",
  pin: 2222,
  transactions: [1800, -85, -74, 450, 750, -250, -100, 2500, 1000, -575],
  transactionDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-02-20T10:17:24.185Z",
    "2022-03-08T14:11:59.604Z",
    "2022-04-15T17:01:17.194Z",
    "2022-06-23T23:20:17.929Z",
    "2022-07-10T11:51:36.790Z",
    "2022-08-09T12:43:36.790Z",
    "2022-10-11T10:15:35.780Z",
  ], //ISOStrings
  currency: "EUR",
  locale: "en-GB",
  interestRate: 1.2,
};

const accounts = [account1, account2];

// ELEMENTS
const containerLoginScreen = document.querySelector(".login__screen");
const containerDashboardScreen = document.querySelector(".dashboard__screen");
const inputLoginUsername = document.querySelector(".login__username");
const inputLoginPin = document.querySelector(".login__pin");
const btnLogin = document.querySelector(".login__btn");
const labelWelcomeUser = document.querySelector(".welcome__msg");
const btnLogout = document.querySelector(".logout__btn");
const labelBalance = document.querySelector(".balance__value");
const labelBalanceDate = document.querySelector(".balance__date");
const btnSort = document.querySelector(".transactions__sort");
const containerTransactions = document.querySelector(
  ".transactions__row--container"
);
const labelSummaryIn = document.querySelector(".summary__in--value");
const labelSummaryOut = document.querySelector(".summary__out--value");
const labelSummaryInterest = document.querySelector(
  ".summary__interest--value"
);
const inputTransferTo = document.querySelector(".transfer__to");
const inputTransferAmount = document.querySelector(".transfer__amount");
const btnTransfer = document.querySelector(".transfer__btn");
const inputLoanAmount = document.querySelector(".loan__amount");
const btnLoan = document.querySelector(".loan__btn");
const labelTimer = document.querySelector(".timer");

// DEFAULT SCREEN when loading the app
containerLoginScreen.style.opacity = 100;
containerDashboardScreen.style.opacity = 0;

// FORMAT DATE for transactions
const formatTransactionDates = function (date, locale) {
  // use custom dates for 'today', 'yesterday', '... days ago'
  const calcDaysPast = function (date1, date2) {
    return Math.round(Math.abs(((date2 - date1) / 24) * 60 * 60 * 1000));
  };

  const daysPast = calcDaysPast(new Date(), date);
  // use 'today' instead of today's date, etc.
  if (daysPast === 0) return "today";
  if (daysPast === 1) return "yesterday";
  if (daysPast <= 7) return `${daysPast} ago`;
  // if transaction date is older than 7 days, return formated date
  else return Intl.DateTimeFormat(locale).format(date);
};

// FORMAT CURRENCY
const formatCurrency = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// CALC & DISPLAY BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.transactions.reduce((accm, value) => accm + value, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// DISPLAY TRANSACTIONS
const displayTransactions = function (acc, sort = false) {
  // hide html hardcoded transactions
  containerTransactions.innerHTML = "";

  // sort transactons
  const transactions = sort
    ? acc.transactions.slice().sort((a, b) => a - b)
    : acc.transactions;

  // format transaction row: type, date, value
  transactions.forEach(function (value, i) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.transactionDates[i]);
    const displayDate = formatTransactionDates(date, acc.locale);
    const formattedValue = formatCurrency(value, acc.locale, acc.currency);

    // build updated html snippet with computed formatted user data
    const html = `
    <div class="transactions__row">
    <div class="row__separator">
      <div class="transactions__type transactions__type--${type}">${type}
      </div>
      <div class="transactions__date">${displayDate}</div>
    </div>
    <div class="transactions__value">${formattedValue}</div>
    </div>`;

    // replace hardcoded html & insert constructed html
    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
};

// CALC & DISPLAY SUMMARY
const calcDisplaySummary = function (acc) {
  // sum of positive transactions
  const income = acc.transactions
    .filter((value) => value > 0)
    .reduce((accm, value) => accm + value, 0);

  labelSummaryIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  // sum of negative transactions
  const out = acc.transactions
    .filter((value) => value < 0)
    .reduce((accm, value) => accm + value, 0);

  labelSummaryOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  // sum of interests on positive transactions based on account interest rate
  const interest = acc.transactions
    .filter((value) => value > 0)
    .map((value) => (value * acc.interestRate) / 100)
    .reduce((accm, value) => accm + value, 0);

  labelSummaryInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// CREATE USERNAMES
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

// UPDATE UI
const updateUI = function (acc) {
  calcDisplayBalance(acc);
  displayTransactions(acc);
  calcDisplaySummary(acc);
};

let currentAccount, timer;

// LOGOUT TIMER
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // check when timer = 0, stop timer and 'log out' user
    if (time === 0) {
      containerDashboardScreen.style.opacity = 0;
      containerDashboardScreen.style.zIndex = 0;
      containerLoginScreen.style.opacity = 100;
      containerLoginScreen.style.zIndex = 1;
    }

    // decrease 1 second from every function call
    time--;
  };

  //set 'time before auto-logout' to 5 mins
  let time = 300;

  // run tick from second 0
  //tick();
  // call tick by setInterval, every 1 second
  const timer = setInterval(tick, 1000);

  // return timer variable to be able to reset it at login
  return timer;
};

// LOGIN

// declare global variables to store & check correct login
let user, pass;

inputLoginUsername.addEventListener("keyup", function () {
  user = inputLoginUsername.value;
});

inputLoginPin.addEventListener("keyup", function () {
  pass = inputLoginPin.value;
});

// disable login on 'Enter' key press
inputLoginPin.addEventListener("keypress", function (e) {
  if (e.key === "Enter") e.preventDefault();
});

// login on buton click
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  setTimeout(function () {
    // hide login screen, display dashboard UI & welcome msg
    if (
      currentAccount.pin === Number(pass) &&
      currentAccount.username === user
    ) {
      // hide login screen and display user dashboard
      containerLoginScreen.style.opacity = 0;
      containerLoginScreen.style.zIndex = 0;
      containerDashboardScreen.style.opacity = 100;
      containerDashboardScreen.style.zIndex = 1;

      // display welcome message
      labelWelcomeUser.textContent = `Welcome back, ${
        currentAccount.owner.split(" ")[0]
      }`;
    } else alert("Incorrect login information");
  }, 500);

  // create & format date for balance
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  const locale = currentAccount.locale;

  labelBalanceDate.textContent = new Intl.DateTimeFormat(
    locale,
    options
  ).format(now);

  // clear input fields
  inputLoginUsername.value = inputLoginPin.value = "";

  // clear timers if any running
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();

  // display user specific account data
  updateUI(currentAccount);
});

// TRANSFER
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // loan conditions
  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // clearing input fields
    inputTransferAmount.value = inputTransferTo.value = "";
    // doing the transactions
    currentAccount.transactions.push(-transferAmount);
    receiverAcc.transactions.push(transferAmount);
    //adding the transaction dates
    currentAccount.transactionDates.push(new Date().toISOString());
    receiverAcc.transactionDates.push(new Date().toISOString());
    // alert user
    setTimeout(function () {
      alert("Payment processed successfully!");
    }, 500);
    // update UI
    setTimeout(function () {
      updateUI(currentAccount);
    }, 1500);
    // reset logout timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// LOAN
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (loanAmount > 0 && loanAmount <= 0.3 * currentAccount.balance) {
    // clear input field
    inputLoanAmount.value = "";
    // alert user
    setTimeout(function () {
      alert("Requested amount has been approved!");
    }, 500);
    // process loan
    setTimeout(function () {
      // do the transaction
      currentAccount.transactions.push(loanAmount);
      // add transaction date
      currentAccount.transactionDates.push(new Date().toISOString());
      // update UI
      updateUI(currentAccount);
      // reset logout timer
      if (timer) clearInterval(timer);
      timer = startLogoutTimer();
    }, 3500);
  } else
    alert(
      "Requested amount exceeds 30% of current balance and cannot be processed."
    );
});

// SORTING transactions list
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});

// LOGOUT
btnLogout.addEventListener("click", function (e) {
  e.preventDefault();
  containerDashboardScreen.style.opacity = 0;
  containerDashboardScreen.style.zIndex = 0;
  containerLoginScreen.style.opacity = 100;
  containerLoginScreen.style.zIndex = 1;
  clearInterval(timer);
  labelTimer.textContent = "...";
});

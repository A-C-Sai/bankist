'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;
  const movements = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movements.forEach(function (mov, idx) {
    const transactionType = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${transactionType}">${idx + 1} ${transactionType}</div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  const movements = acc.movements;
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

const displaySummary = function (acc) {
  const movements = acc.movements;
  const interestRate = acc.interestRate;
  const incomes = movements.filter((amount) => amount > 0).reduce((acc, amount) => acc + amount, 0);
  const out = movements.filter((amount) => amount < 0).reduce((acc, amount) => acc + amount, 0);
  const interest = movements
    .filter((amount) => amount > 0)
    .map((amount) => (amount * interestRate) / 100)
    .filter((amount) => amount >= 1)
    .reduce((acc, amount) => acc + amount, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name_) => name_.at(0))
      .join('');
  });
};
createUsernames(accounts);

// EVENT HANDLERS

// LOGIN
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // const username = inputLoginUsername.textContent; ---> NOT textContent but we need to access value property
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  if (username && pin) {
    const currAccount = accounts.find((account) => account.username == username);
    if (currAccount) {
      currentAccount = currAccount;
      if (currAccount.pin === Number(pin)) {
        labelWelcome.textContent = `Welcome back, ${currAccount.owner.split(' ').at(0)}`;
        updateUI(currAccount);
        containerApp.style.opacity = 1;
      } else {
        alert('Please make sure the entered username and password are correct!');
      }
    } else {
      alert('Please make sure the entered username and password are correct!');
    }
  } else {
    alert('Please make sure both username and password are entered!');
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginUsername.blur(); // causes the element to loose it focus after login
  inputLoginPin.blur(); // causes the element to loose it focus after login
});

// TRANSFER FUNCTIONALITY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.username === transferTo);
  if (transferTo && transferAmount > 0) {
    if (transferAmount <= currentAccount.balance) {
      if (receiverAcc.username !== currentAccount.username) {
        receiverAcc.movements.push(transferAmount);
        currentAccount.movements.push(-1 * transferAmount);
        updateUI(currentAccount);
      } else {
        alert('INVALID OPERATION. CANNOT TRANSFER MONEY TO ONESELF!!');
      }
    } else {
      alert('insufficient funds!!');
    }
  } else {
    alert('Please ensure that you have entered a vaild account and amount!');
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  transferTo.blur();
  inputTransferAmount.blur();
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value && inputClosePin.value) {
    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
      const idx = accounts.findIndex((acc) => acc.username === inputCloseUsername.value);
      accounts.splice(idx, 1);
      alert(`We are sorry to see you leave ${currentAccount.owner.split(' ').at(0)}`);
      containerApp.style.opacity = 0;
    } else {
      alert('Invalid credentials');
    }
  } else {
    alert('Please make sure username and pin have been entered!');
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

// LOAN
// btnLoan
// inputLoanAmount

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (loanAmount > 0 && currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  } else {
    alert('Loan not Approved!');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// SORTING
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!sorted) {
    sorted = true;
    displayMovements(currentAccount, true);
  } else {
    sorted = false;
    displayMovements(currentAccount);
  }
});

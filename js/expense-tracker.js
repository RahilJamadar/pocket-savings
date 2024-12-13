"use strict";

const errorMesgEl = document.querySelector(".error_message");
const budgetInputEl = document.querySelector(".budget_input");
const expenseDesEl = document.querySelector(".expensess_input");
const expenseAmountEl = document.querySelector(".expensess_amount");
const expenseCategoryEl = document.querySelector(".expense_category");
const tblRecordEl = document.querySelector(".tbl_data");
const cardsContainer = document.querySelector(".cards");

// cards content
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

let itemList = JSON.parse(localStorage.getItem("expensesList")) || [];
let itemId = itemList.length ? itemList[itemList.length - 1].id + 1 : 0;

//===============Button Events==============
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  //========Budget Event===============
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  //========Expenses Event===============
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

//==================Calling Btns Event==========
document.addEventListener("DOMContentLoaded", () => {
  // Load existing data from localStorage
  loadExistingData();
  btnEvents();
});

//================= Expenses Function============
function expensesFun() {
  let expensesDescValue = expenseDesEl.value;
  let expenseAmountValue = expenseAmountEl.value;
  let expenseCategoryValue = expenseCategoryEl.value;

  if (
    expensesDescValue == "" ||
    expenseAmountValue == "" ||
    budgetInputEl < 0
  ) {
    errorMessage("Please Enter Expenses Desc or Expense Amount!");
  } else {
    let amount = parseInt(expenseAmountValue);

    expenseAmountEl.value = "";
    expenseDesEl.value = "";

    // store the value inside the object, including the category
    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
      category: expenseCategoryValue
    };
    itemId++;
    itemList.push(expenses);

    // add expenses inside the HTML Page
    addExpenses(expenses);
    showBalance();
    // Update localStorage with the new expenses list
    localStorage.setItem("expensesList", JSON.stringify(itemList));
  }
}

//========================Add Expenses==================
function addExpenses(expensesPara) {
  const html = `<ul class="tbl_tr_content">
            <li data-id=${expensesPara.id}>${expensesPara.id + 1}</li>
            <li>${expensesPara.title}</li>
            <li>${expensesPara.category}</li> <!-- Display Category -->
            <li><span>₹</span>${expensesPara.amount}</li>
            <li>
              <button type="button" class="btn_edit">Edit</button>
              <button type="button" class="btn_delete">Delete</button>
            </li>
          </ul>`;

  tblRecordEl.insertAdjacentHTML("beforeend", html);

  //=================== Edit=======================
  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDel = document.querySelectorAll(".btn_delete");
  const content_id = document.querySelectorAll(".tbl_tr_content");

  // btn edit event
  btnEdit.forEach((btnedit) => {
    btnedit.addEventListener("click", (el) => {
      let id;

      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let expenses = itemList.filter(function (item) {
        return item.id == id;
      });

      expenseDesEl.value = expenses[0].title;
      expenseAmountEl.value = expenses[0].amount;

      // Set the category in the dropdown
      expenseCategoryEl.value = expenses[0].category;

      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
      // Update localStorage with the modified expenses list
      localStorage.setItem("expensesList", JSON.stringify(itemList));
      showBalance();
    });
  });

  //============ btn delete
  btnDel.forEach((btndel) => {
    btndel.addEventListener("click", (el) => {
      let id;

      content_id.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let temp_list = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = temp_list;
      // Update localStorage with the modified expenses list
      localStorage.setItem("expensesList", JSON.stringify(itemList));
      showBalance();
    });
  });
}

//===============Budget Function=================
function budgetFun() {
  const budgetValue = budgetInputEl.value;

  if (budgetValue == "" || budgetValue < 0) {
    errorMessage("Please Enter Your Budget or More Than 0");
  } else {
    budgetCardEl.textContent = budgetValue;
    budgetInputEl.value = "";
    showBalance();
    localStorage.setItem("totalBudget", budgetValue);
  }
}

//================Show Balance===================
function showBalance() {
  const expenses = totalExpenses();
  const total = parseInt(budgetCardEl.textContent) - expenses;
  balanceCardEl.textContent = total;
  localStorage.setItem("remainingBudget", total);
}

//==================total Expenses=============
function totalExpenses() {
  let total = 0;

  if (itemList.length > 0) {
    total = itemList.reduce(function (acc, curr) {
      acc += curr.amount;
      return acc;
    }, 0);
  }

  expensesCardEl.textContent = total;
  return total;
}

//====================Error Message Function================
function errorMessage(message) {
  errorMesgEl.innerHTML = `<p>${message}</p>`;
  errorMesgEl.classList.add("error");
  setTimeout(() => {
    errorMesgEl.classList.remove("error");
  }, 2500);
}

//===================Load Existing Data=================
function loadExistingData() {
  // Load total budget from localStorage
  const storedBudget = localStorage.getItem("totalBudget");
  if (storedBudget) {
    budgetCardEl.textContent = storedBudget;
  }

  // Load expenses list from localStorage and render them
  itemList.forEach((expense) => {
    addExpenses(expense);
  });

  // Load remaining budget from localStorage
  const remainingBudget = localStorage.getItem("remainingBudget");
  if (remainingBudget) {
    balanceCardEl.textContent = remainingBudget;
  }

  // Update total expenses
  totalExpenses();
}

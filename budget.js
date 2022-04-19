// SELECT ELEMENTS
const user_id = new URLSearchParams(window.location.search).get('uid');
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");
const expenseCategory = document.getElementById("expense-category-input");
const expenseDate = document.getElementById("expense-date-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");
const incomeCategory = document.getElementById("income-category-input");
const incomeDate = document.getElementById("income-date-input");

// VARIABLES
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active( expenseBtn );
    inactive( [incomeBtn, allBtn] );
    document.querySelector('.bg-modal-expense').style.display = "none";
    
})
incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [expenseEl, allEl] );
    active( incomeBtn );
    inactive( [expenseBtn, allBtn] );
    document.querySelector('.bg-modal-income').style.display = "none";
})
allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [incomeEl, expenseEl] );
    active( allBtn );
    inactive( [incomeBtn, expenseBtn] );
})

addExpense.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!expenseTitle.value || !expenseAmount.value  || !expenseCategory.value || !expenseDate.value) {
    alert("Fill in the missing fields!"); 
    return;
    }
    // SAVE THE ENTRY TO ENTRY_LIST
    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value),
        category : expenseCategory.value,
        date : expenseDate.value
    }
    ENTRY_LIST.push(expense);
    
    updateUI();
    clearInput( [expenseTitle, expenseAmount, expenseCategory, expenseDate] )
    document.querySelector('.bg-modal-expense').style.display = "none";
    
})

addIncome.addEventListener("click", function(){
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if(!incomeTitle.value || !incomeAmount.value || !incomeCategory.value || !incomeDate.value){
    alert("Fill in the missing fields!");
    return;}
   
    // SAVE THE ENTRY TO ENTRY_LIST
    let income = {
        type : "income",
        title : incomeTitle.value,
        amount : parseInt(incomeAmount.value),
        category : incomeCategory.value,
        date : incomeDate.value
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [incomeTitle, incomeAmount, incomeCategory, incomeDate] )
    document.querySelector('.bg-modal-income').style.display = "none";

})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);
// HELPERS

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    var addElement = document.getElementById("bg-modal-income");
    addElement.classList.add("move-in");
    document.querySelector('.bg-modal-expense').style.display = "flex";
    document.getElementById('expense-text').innerHTML = "Edit Expense";
    document.getElementById('expense-cancelDelete').innerHTML = "DELETE";

    document.querySelector('.bg-modal-income').style.display = "flex";
    document.getElementById('income-text').innerHTML = "Edit Income";
    document.getElementById('income-cancelDelete').innerHTML = "DELETE";

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
        incomeCategory.value = ENTRY.category;
        incomeDate.value = ENTRY.date;
        
        
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
        expenseCategory.value = ENTRY.category;
        expenseDate.value = ENTRY.date;
    }
    
    deleteEntry(entry);
}

function updateUI(){
    //ALL BUTTON
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // DETERMINE SIGN OF BALANCE
    let sign = (income >= outcome) ? "₱" : "-₱";

    // UPDATE UI
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>₱</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>₱</small>${income}`;
    
    clearElement( [expenseList, incomeList, allList] );
    //INCOME DATA
    getIncomeData(user_id).then(data => {
        for (var entry in data){
                showEntry(incomeList, "income", data[entry]['income_title'], data[entry]['income_amt'], data[entry]['category_id'],
                data[entry]['income_date'], data[entry]['income_id']);
                showEntry(allList, "income", data[entry]['income_title'], data[entry]['income_amt'], data[entry]['category_id'],
                data[entry]['income_date'], data[entry]['income_id']);
            };
    });
    //EXPENSE DATA
    getExpenseData(user_id).then(data => {
        for (var entry in data){
                showEntry(expenseList, "expense", data[entry]['expense_title'], data[entry]['expense_amt'], data[entry]['category_id'],
                data[entry]['expense_date'], data[entry]['expense_id']);
                showEntry(allList, "expense", data[entry]['expense_title'], data[entry]['expense_amt'], data[entry]['category_id'],
                data[entry]['expense_date'], data[entry]['expense_id']);
            };
    });


    updateChart(income, outcome);

    // localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));

}

async function getExpenseData(id){
    const url = "user_getExpenseData.php?id="+id;
    const data = await fetch(url)
    return data.json();  
}

async function getIncomeData(id){
    const url = "user_getIncomeData.php?id="+id;
    const data = await fetch(url)
    return data.json();  
}

function showEntry(list, type, title, amount, category, date, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: ₱${amount} (${category}) </br>${date}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}

//EASE-IN FADE THE ADD EXPENSE MODAL
document.getElementById('add-button-expense').addEventListener("click", function() {
    var addElement = document.getElementById("bg-modal-expense");
    addElement.classList.add("move-in");
	document.querySelector('.bg-modal-expense').style.display = "flex";
    document.getElementById('expense-cancelDelete').innerHTML = "CANCEL";
    document.getElementById('expense-text').innerHTML = "Add Expense";
});

//CLOSE THE MODAL
document.querySelector('.close-expense').addEventListener("click", function() {
	document.querySelector('.bg-modal-expense').style.display = "none";
    clearInput( [expenseTitle, expenseAmount, expenseCategory, expenseDate] )
    var addElement = document.getElementById("bg-modal-expense");
});

//EASE-IN FADE THE ADD INCOME MODAL
document.getElementById('add-button-income').addEventListener("click", function() {
    var addElement = document.getElementById("bg-modal-income");
    addElement.classList.add("move-in");
	document.querySelector('.bg-modal-income').style.display = "flex";
    document.getElementById('income-cancelDelete').innerHTML = "CANCEL";    
    document.getElementById('income-text').innerHTML = "Add Income";

});

//CLOSE THE MODAL
document.querySelector('.close-income').addEventListener("click", function() {
	document.querySelector('.bg-modal-income').style.display = "none";
    clearInput( [incomeTitle, incomeAmount, incomeCategory, incomeDate] )
    var addElement = document.getElementById("bg-modal-income");
});
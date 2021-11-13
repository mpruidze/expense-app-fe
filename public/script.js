let inputT;
let inputN;
let inputText = '';
let inputCost = '';
let expenseList = [];
let beingEdited = false;
let editBtn;
let editID = null;
let total;
const userId = JSON.parse(localStorage.getItem('userId'));
const jwt = JSON.parse(localStorage.getItem('access_token'));
const firstName = JSON.parse(localStorage.getItem('firstName'));
const lastName = JSON.parse(localStorage.getItem('lastName'));

const checkUser = async () => {
    try {
        const response = await fetch('https://expense-app-be.herokuapp.com/user/${userId}/profile', {
                method: "GET",
                headers: {Authorization: `Bearer ${jwt}`}
            });
        if (response.status === 401) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.log(`error login`, error)
    }
};



window.onload = async () => {
    checkUser();
    fullName = document.querySelector('.fullName');
    fullName.innerText = `${firstName} ${lastName}`;
    fullName.title = `${firstName} ${lastName}`;
    inputT = document.getElementById('inputText');
    inputN = document.getElementById('inputCost');
    const addBtn = document.getElementById("add-btn");
    inputT.addEventListener('change', updateValueT);
    inputN.addEventListener('change', updateValueC);
    inputT.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            inputN.focus();
        }
    });
    inputN.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            addBtn.click();
        }
    });
    addBtn.addEventListener("click", addExpense);

    const response = await (await fetch('https://expense-app-be.herokuapp.com/expense', {
        method: 'GET',
        headers: {Authorization: `Bearer ${jwt}`}
    })).json();

    expenseList = response;
    render();
}
logout = () => {
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('firstName');
    window.localStorage.removeItem('lastName');
    window.location.href = 'login.html';
}
updateValueT = (e) => {
    inputText = e.target.value;
}
updateValueC = (e) => {
    inputCost = e.target.value;
}

addExpense = async () => {
    const regex = /[a-z]+/gi;
    if (inputText.trim() && regex.test(inputText) && inputCost > 0 && !beingEdited) {
        const resp = await fetch('https://expense-app-be.herokuapp.com/expense', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                text: inputText,
                cost: inputCost,
                userId,
            })
        });
        let result = await resp.json();
        expenseList.push(result);

        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        inputT.style.border = 'none';
        inputN.style.border = 'none';
        inputT.focus();
        render();
    } else if (inputText.trim() && inputCost > 0 && beingEdited) {
        const response = await fetch(`https://expense-app-be.herokuapp.com/expense/${editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({
                text: inputText,
                cost: inputCost
            })
        });
        expenseList = expenseList.map(expense => {
            if (editID == expense._id) return { ...expense, text: inputT.value, cost: inputN.value  };
            return expense;
        });
        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        editID = null;
        beingEdited = false;
        inputT.focus();
        const addBtn = document.getElementById("add-btn");
        addBtn.innerText = "добавить";
        render();
    } else if (!inputText.trim() || !regex.test(inputText)) {
        inputT.style.border = '2px solid red';
        inputT.focus();
    }
    else if (!inputCost || inputCost <= 0) inputN.style.border = '2px solid red';

}
render = () => {
    const expenseContainer = document.querySelector('.content');
    while (expenseContainer.firstChild) {
        expenseContainer.firstChild.remove();
    }
    if (expenseList.length) {
        // sum
        const sum = document.createElement('p');
        total = totalCost();
        sum.innerText = `Итого: ${total} р.`;
        sum.className = 'sum';
        expenseContainer.appendChild(sum);

        expenseList.map((singleExpense, index) => {
            const expense = document.createElement('article');
            expense.className = 'expense-container';

            // single expense's text
            const expenseText = document.createElement('p');
            expenseText.innerText = `${index+1}) ${singleExpense.text}`;
            expenseText.className = 'expense-text';
            expense.appendChild(expenseText);

            // single expense's cost
            const expenseNumber = document.createElement('p');
            expenseNumber.innerText = `${singleExpense.cost} р.`;
            expenseNumber.className = 'expense-cost';
            expense.appendChild(expenseNumber);

            // buttons' container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            expense.appendChild(btnContainer);

            // edit button
            editBtn = document.createElement('button');
            editBtn.innerText = 'редактировать';
            editBtn.className = 'edit-btn';
            btnContainer.appendChild(editBtn);
            editBtn.onclick = () => editExpense(singleExpense._id);

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'удалить';
            deleteBtn.className = 'delete-btn';
            btnContainer.appendChild(deleteBtn);
            deleteBtn.onclick = () => removeExpense(singleExpense._id);

            // appending expense to container
            expenseContainer.appendChild(expense);
        });
    }
}
totalCost = () => {
    return expenseList.reduce((res, obj) => res += Number(obj.cost),0);
}

editExpense = (id) => {
    const addBtn = document.getElementById("add-btn");
    addBtn.innerText = "редактировать";
    const specificItem = expenseList.find(expense => id === expense._id);
    inputT.value = specificItem.text;
    inputText = specificItem.text;
    inputN.value = specificItem.cost;
    inputCost = specificItem.cost;
    editID = id;
    beingEdited = true;
    inputT.focus();
}
removeExpense = async (id) => {
    const response = await fetch(`https://expense-app-be.herokuapp.com/expense/${id}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${jwt}`},
    });
    expenseList = expenseList.filter(item => id !== item._id);
    render();
}

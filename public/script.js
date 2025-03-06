const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let categories = [];
let arrangedCategoriesById = {};
let transactions = [];
document.querySelectorAll(".date-field").forEach(input => {
    input.value = new Date().toISOString().split('T')[0];
});
function cancelUpdateTransaction(){
    document.getElementById("update-savingstracker-form").classList.add("hide");
    document.getElementById("update-savingstracker-form").reset();
}
document.getElementById("add-savingstracker-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const submitButton = document.getElementById("submit-btn");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    const form = document.getElementById("add-savingstracker-form");
    const categoryId = form.querySelector('.category-field').value;
    const subCategoryId = form.querySelector('.sub-category-field').value;
    const newSubCategory = form.querySelector('.new-sub-category-field').value;
    const amount = form.querySelector('.amount-field').value;
    const date = form.querySelector('.date-field').value;
    if(subCategoryId || newSubCategory){
        let formSubmitData = await fetch("/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({categoryId, subCategoryId, newSubCategory, amount, date, mainCategorySlug: arrangedCategoriesById[categoryId].slug}),
        });
        formSubmitData = await formSubmitData.json();
        if(formSubmitData.status){
            await loadCategories();
            await showStatusMessage("Added Successfully!", 'true', loadTransactions);
            document.getElementById("add-savingstracker-collaps-btn").click();
            form.reset();
            form.querySelector('.date-field').value = new Date().toISOString().split('T')[0];
        }else{
            await showStatusMessage(formSubmitData.error, 'false');
        }
    }else{
        await showStatusMessage("Select sub category or enter new one", 'false');
    }
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
});
async function showStatusMessage(formStatusMessage, formStatus, fun = null){
    const formStatusElement = document.getElementsByClassName(formStatus == 'true' ? 'alert-success' : 'alert-danger')[0];
    formStatusElement.classList.remove('hide');
    if(formStatusMessage){
        formStatusElement.innerHTML = formStatusMessage;
        formStatusElement.classList.remove('hide');
        formStatusElement.classList.add(formStatus);
        setTimeout(() => {
            formStatusElement.classList.add('hide');
            if(fun) fun();
        }, formStatus === "true" ? 1000 : 3000);
    }
}
async function saveTransaction(event) {
    event.preventDefault();
    const websiteDropdown = document.getElementById("website");
    let id = websiteDropdown.value;
    let website = websiteDropdown.options[websiteDropdown.selectedIndex].text;
    let nameuser = document.getElementById("nameuser").value;
    let wordsaap = document.getElementById("wordsaap").value;

    if (!website || !wordsaap) {
        alert("Please fill Website and Transaction fields");
        return;
    }

    const response = await fetch('/transactions', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, website, nameuser, wordsaap }),
    });

    const result = await response.json();
    updateStatusMessage(result.message);
    // let message = document.getElementById("submit-status");
    // message.innerHTML = result.message
    // message.style.display = "block";
    // setTimeout(() => {
    //     message.style.display = "none";
    // }, 2000);
    // alert(result.message);
    document.getElementById("id").value = "";
    document.getElementById("website").value = "";
    document.getElementById("nameuser").value = "";
    document.getElementById("wordsaap").value = "";
    await loadTransactions();
}
function updateStatusMessage(message){
    let messageElement = document.getElementById("submit-status");
    messageElement.innerHTML = message
    messageElement.style.display = "block";
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 2000);
}
async function loadCategories(){
    let response = await fetch('/categories');
    response = await response.json();
    categories = response.data.categories;
    document.querySelectorAll(".category-field").forEach(select => {
        select.innerHTML = '';
        option = document.createElement("option");
        option.value = '';
        option.text = 'Select Category';
        select.appendChild(option);
        response.data.categories.forEach(category => {
            arrangedCategoriesById[category._id] = category;
            if(category.main){
                option = document.createElement("option");
                option.value = category._id;
                option.text = category.name;
                select.appendChild(option);
            }
        });
    });
}
function loadSubCategories(current = null, compareMainCategorySlug = null){
    compareMainCategorySlug = compareMainCategorySlug ? compareMainCategorySlug : arrangedCategoriesById[current.value].slug;
    document.querySelectorAll(".sub-category-field").forEach(select => {
        select.innerHTML = '';
        let option = document.createElement("option");
        option.value = '';
        option.text = 'Select Sub Category';
        select.appendChild(option);
        categories.forEach(category => {
            if(!category.main && category.slug == compareMainCategorySlug){
                let option = document.createElement("option");
                option.value = category._id;
                option.text = category.name;
                select.appendChild(option);
            }
        });
    });
}
async function loadSites(sites){
    // let response = await fetch('/sites');
    // response = await response.json();
    document.querySelectorAll(".site-field").forEach(select => {
        select.innerHTML = '';
        let option = document.createElement("option");
        option.value = '';
        option.text = 'Select Site';
        select.appendChild(option);
        sites.forEach(site => {
            option = document.createElement("option");
            option.value = site;
            option.text = site;
            select.appendChild(option);
        });
    });
}

function formatDate(dateString) {
    let formattedDate = '';
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[String(date.getMonth())];
    const year = String(date.getFullYear()).slice(-2);
    formattedDate = `${weekday}, ${day}-${month}-${year}`;

    return formattedDate;
}
function onCancelClick(event){
    document.getElementById("add-savingstracker-collaps-btn").click();
}

async function toggleTransaction(id) {
    const pin = prompt("Enter PIN");
    if(!pin)    return;
    let savingstrackerDiv = document.getElementById(`pass-${id}`);
    let formSubmitData = await fetch(`/transactions/${id}/decrypt`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer "+pin
        },
    });
    formSubmitData = await formSubmitData.json();
    if(formSubmitData.status){
        savingstrackerDiv.innerHTML = formSubmitData.data.decryptedTransaction;
        setTimeout(() => {
            savingstrackerDiv.innerHTML = "******";
        }, 3000)
    }else{
        await showStatusMessage(formSubmitData.message, 'false');
    }
}
async function deleteTransaction(button) {
    const deleteConfirm = confirm("Are you sure to delete this savingstracker ?");
    if(deleteConfirm){
        let tr = button.closest('tr');
        button.disabled = true;
        button.textContent = "Deleting...";
        const id = tr.querySelector('.id-field').value;
        let formSubmitData = await fetch(`/transactions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        formSubmitData = await formSubmitData.json();
        if(formSubmitData.status){
            document.querySelectorAll(".id-field").forEach(input => {
                if(input.value > id){
                    input.value -= 1;
                }
            });
            tr.remove();
            await showStatusMessage('Deleted successfuly!', 'true');
            await loadTransactions();
        }else{
            await showStatusMessage(formSubmitData.error, 'false');
        }
        button.disabled = false;
        button.innerHTML = `<span class="glyphicon glyphicon-trash"></span>`;
    }
}

function editTransaction() {
    let savingstrackerData = this.querySelector('.savingstracker-field').value;
    savingstrackerData = JSON.parse(savingstrackerData);
    const form = document.getElementById("update-savingstracker-form");
    form.querySelector('.category-field').value = savingstrackerData.categoryId;
    loadSubCategories(null, arrangedCategoriesById[savingstrackerData.categoryId].slug);
    form.querySelector('.sub-category-field').value = savingstrackerData.subCategoryId;
    form.querySelector('.amount-field').value = savingstrackerData.amount;
    form.querySelector('.date-field').value = new Date(savingstrackerData.date).toISOString().split('T')[0];
    form.querySelector('.savingstracker-id-field').value = savingstrackerData._id;
    form.classList.remove("hide");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById("update-savingstracker-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const submitButton = document.getElementById("update-btn");
    submitButton.disabled = true;
    submitButton.textContent = "Updating...";
    const form = document.getElementById("update-savingstracker-form");
    const id = form.querySelector('.savingstracker-id-field').value;
    const categoryId = form.querySelector('.category-field').value;
    const subCategoryId = form.querySelector('.sub-category-field').value;
    const newSubCategory = form.querySelector('.new-sub-category-field').value;
    const amount = form.querySelector('.amount-field').value;
    const date = form.querySelector('.date-field').value;

    if(subCategoryId || newSubCategory){
        let formSubmitData = await fetch("/transactions/"+id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({categoryId, subCategoryId, newSubCategory, amount, date, mainCategorySlug: arrangedCategoriesById[categoryId].slug}),
        });
        formSubmitData = await formSubmitData.json();
        if(formSubmitData.status){
            form.classList.add("hide");
            await loadCategories();
            await showStatusMessage('Updated successfuly!', 'true', loadTransactions);
        }else{
            await showStatusMessage(formSubmitData.message, 'false');
        }
    }else{
        await showStatusMessage("Select sub category or enter new one", 'false');
    }
    submitButton.disabled = false;
    submitButton.textContent = "Update";
});

function searchTable() {
    let input = document.getElementById("search");
    let filter = input.value.toLowerCase();
    let tableBody = document.getElementById("savingstrackers");
    let rows = tableBody.getElementsByTagName("tr");
    
    for (let row of rows) {
        let cells = row.getElementsByTagName("td");
        let match = false;
        for (let cell of cells) {
            if (cell.innerText.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
        row.style.display = match ? "" : "none";
    }
}

async function loadTransactions(){
    const savingstrackersTbody = document.getElementById("savingstrackers");
    savingstrackersTbody.innerHTML = '';
    let row = savingstrackersTbody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.colSpan = 5;
    cell1.style.textAlign  = "center";
    cell1.textContent = "Loadding...";
    let response = await fetch('/transactions');
    response = await response.json();
    transactions = response.data.transactions;
    if(response.status){
        savingstrackersTbody.innerHTML = '';
        if(transactions.length > 0){
            for(let i = 0; i < transactions.length; i++){
                row = savingstrackersTbody.insertRow();
                row.classList.add('savingstracker-row');
                cell_l = row.insertCell(0);
                cell_2 = row.insertCell(1);
                cell_3 = row.insertCell(2);
                cell_4 = row.insertCell(3);

                cell_l.innerHTML = `
                    <div class="title">${arrangedCategoriesById[transactions[i].categoryId].name}</div>
                    <div class="category">${arrangedCategoriesById[transactions[i].subCategoryId].name}</div>
                    <input type="hidden" name="savingstracker-field" class="savingstracker-field" value='${JSON.stringify(transactions[i])}'>
                `;
                cell_l.addEventListener("click", editTransaction);
                cell_2.innerHTML = `&#8377;  ${transactions[i].amount.toLocaleString()}`;
                cell_3.innerHTML = `${formatDate(transactions[i].date)}`;
                cell_4.innerHTML = `
                    <input type="hidden" name="id" class="id-field" value="${transactions[i]._id}">
                    <button type="button" class="btn btn-default btn-sm" onclick="deleteTransaction(this)">
                        <span class="glyphicon glyphicon-trash"></span> 
                    </button>
                `;
            }
            calculateTotal();
        }else{
            let row = savingstrackersTbody.insertRow();
            let cell1 = row.insertCell(0);
            cell1.colSpan = 5;
            cell1.style.textAlign  = "center";
            cell1.textContent = "No Transactions";
        }
    }else{
        cell1.textContent = data.error;
        await showStatusMessage(data.error, 'false');
    }
}

function calculateTotal() {
    const savings = {
      savings: {},
      lent: {},
      kharch: 0,
      totalAmount: 0,
    };
    transactions.forEach(e => {
      if (arrangedCategoriesById[e.categoryId].name == "Savings") {
        if (typeof savings.savings[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.savings[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.savings[arrangedCategoriesById[e.subCategoryId].name] += e.amount;
        savings.totalAmount += e.amount;
      }
      if (arrangedCategoriesById[e.categoryId].name == "Lent") {
        if (typeof savings.lent[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.lent[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.lent[arrangedCategoriesById[e.subCategoryId].name] += e.amount;
        savings.totalAmount += e.amount;
      }
      if (arrangedCategoriesById[e.categoryId].name == "Lent Received") {
        savings.lent[arrangedCategoriesById[e.subCategoryId]] -= e.amount;
        savings.totalAmount -= e.amount;
      }
      if (arrangedCategoriesById[e.categoryId].name == "Kharch") {
        savings.savings[arrangedCategoriesById[e.subCategoryId].name] -= e.amount;
        savings.kharch += e.amount;
        savings.totalAmount -= e.amount;
      }
    });
    const savingEntries = Object.entries(savings.savings);
    const lentEntries = Object.entries(savings.lent);
    const maxLoop = Math.max(savingEntries.length, lentEntries.length);
    const statsTbl = document.getElementById("stats-body");
    let rowDiv = document.createElement("div");
    for (let i = 0; i < maxLoop; i++) {
        rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.innerHTML = `
            <div class="col-xs-3">${savingEntries[i] ? savingEntries[i][0] : '&nbsp;'}</div>
            <div class="col-xs-3">${savingEntries[i] ? '&#8377; '+savingEntries[i][1] : '&nbsp;'.toLocaleString()}</div>
            <div class="col-xs-3">${lentEntries[i] ? lentEntries[i][0] : '&nbsp;'}</div>
            <div class="col-xs-3">${lentEntries[i] ? '&#8377; '+lentEntries[i][1] : '&nbsp;'.toLocaleString()}</div>
        `;
        statsTbl.append(rowDiv);
    }
    rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    rowDiv.classList.add("total-savings");
    rowDiv.innerHTML = `
        <div class="col-xs-12">Total Savings: <b>&#8377;  ${savings.totalAmount.toLocaleString()}</b></div>
    `;
    statsTbl.append(rowDiv);
}

window.onload = async function(){
    await loadCategories();
    await loadTransactions();
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let categories = [];
let arrangedCategoriesById = {};
let transactions = [];
let mainCategories = [];
let savingsKharchCategories = [];
let lentReceivedCategories = [];
document.querySelectorAll(".date-field").forEach(input => {
    input.value = new Date().toISOString().split('T')[0];
});
function cancelUpdateTransaction(){
    document.getElementById("update-savingstracker-form").classList.add("hide");
    document.getElementById("update-savingstracker-form").reset();
}
async function showStatusMessage(formStatusMessage, formStatus, funArr = []){
    const formStatusElement = document.getElementsByClassName(formStatus == 'true' ? 'alert-success' : 'alert-danger')[0];
    formStatusElement.classList.remove('hide');
    if(formStatusMessage){
        formStatusElement.innerHTML = formStatusMessage;
        formStatusElement.classList.remove('hide');
        formStatusElement.classList.add(formStatus);
        setTimeout(() => {
            formStatusElement.classList.add('hide');
            if(funArr.length > 0){
                for (let i = 0; i < funArr.length; i++) {
                    funArr[i]();
                }
            }
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
    response.data.categories.forEach(category => {
        if(category.main)   mainCategories.push(category);
        if(category.slug == 'savings-kharch' && !category.main)   savingsKharchCategories.push(category);
        if(category.slug == 'lent-received' && !category.main)   lentReceivedCategories.push(category);
    });
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
function loadSubCategories(current){
    const isChecked = $('.new-sub-category-checkbox').prop('checked');
    if(isChecked)   $(".new-sub-category-checkbox").trigger('click');
    $(".from-drop-down").addClass("hide");
    if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received'){
        console.log("arrangedCategoriesById[current.value].slug: ",arrangedCategoriesById[current.value].slug)
        $(".from-drop-down").removeClass("hide");
    }
    let selectedText = current.options[current.selectedIndex].text;
    if(current.value && arrangedCategoriesById[current.value].slug == 'savings-kharch' && selectedText == 'Savings'){
        loadRelatedSubCategories('To', savingsKharchCategories, 'primarySubCategoryId');
        $(".new-sub-category-check").removeClass("hide");
    }else if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received' && selectedText == 'Lent'){
        loadRelatedSubCategories('To', lentReceivedCategories, 'primarySubCategoryId');
        loadRelatedSubCategories('From', savingsKharchCategories, 'secondarySubCategoryId');
    }else if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received' && selectedText == 'Lent Received'){
        loadRelatedSubCategories('From', lentReceivedCategories, 'primarySubCategoryId');
        loadRelatedSubCategories('To', savingsKharchCategories, 'secondarySubCategoryId');
        $(".new-sub-category-check").addClass("hide");
    }else if(current.value && arrangedCategoriesById[current.value].slug == 'savings-kharch' && selectedText == 'Kharch'){
        loadRelatedSubCategories('From', savingsKharchCategories, 'primarySubCategoryId');
        $(".new-sub-category-check").addClass("hide");
        $(".from-drop-down").removeClass("hide");
        $(".secondary-sub-category-form-group").addClass("hide");
    }
}
function loadRelatedSubCategories(selectText, loadingCats, selectDropDownId){
    const select = $("#add-savingstracker-form").find(`select[name='${selectDropDownId}']`);
    $(select).html('');
    $(select).append(`<option value="">Select ${selectText}</option>`);
    loadingCats.forEach(cat => {
        $(select).append(`<option value="${cat._id}">${cat.name}</option>`);
    });
}
function loadSubCategoriesOld(current = null, compareMainCategorySlug = null){
    compareMainCategorySlug = compareMainCategorySlug ? compareMainCategorySlug : arrangedCategoriesById[current.value].slug;
    $(".from-drop-down").addClass("hide");
    if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received'){
        $(".from-drop-down").removeClass("hide");
    }
    console.log("mainCat: ",mainCategories)
    console.log("savingCat: ",savingsKharchCategories)
    console.log("lentCat: ",lentReceivedCategories)
    document.querySelectorAll(".sub-category-field").forEach(select => {
        select.innerHTML = '';
        let option = document.createElement("option");
        option.value = '';
        option.text = 'Select ';
        let selectedText = current.options[current.selectedIndex].text;
        if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received' && selectedText == 'Lent Received'){
            $(".new-sub-category-check").addClass("hide");
            if(select.getAttribute("select-text") == 'primary'){
                option.text += " From";
            }else if(select.getAttribute("select-text") == 'secondary'){
                option.text += " To";
            }
        }else if(current.value && arrangedCategoriesById[current.value].slug == 'lent-received' && selectedText == 'Lent'){
            // $(".new-sub-category-check").addClass("hide");
            if(select.getAttribute("select-text") == 'primary'){
                option.text += " To";
            }else if(select.getAttribute("select-text") == 'secondary'){
                option.text += " From";
            }
        }else{
            if(select.getAttribute("select-text") == 'primary'){
                option.text += " To";
            }
            $(".new-sub-category-check").removeClass("hide");
        }
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
    loadSubCategoriesToUpdate(arrangedCategoriesById[savingstrackerData.categoryId].slug);
    form.querySelector('.sub-category-field').value = savingstrackerData.subCategoryId;
    form.querySelector('.amount-field').value = savingstrackerData.amount;
    form.querySelector('.date-field').value = new Date(savingstrackerData.date).toISOString().split('T')[0];
    form.querySelector('.savingstracker-id-field').value = savingstrackerData._id;
    $("#updateTransactionModal").modal("show");
}
function loadSubCategoriesToUpdate(mainCategorySlug) {
    const select = $("#update-savingstracker-form").find(`select[name='subCategoryId']`);
    $(select).html('');
    $(select).append(`<option value="">Select Subcategory</option>`);
    const loadingCats = mainCategorySlug == 'savings-kharch' ? savingsKharchCategories : lentReceivedCategories;
    loadingCats.forEach(cat => {
        $(select).append(`<option value="${cat._id}">${cat.name}</option>`);
    });
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

    const formData = {};
    $(this).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
    });
    formData.categorySlug = formData.categoryId ? arrangedCategoriesById[formData.categoryId].slug : '';
    formData.categoryName = formData.categoryId ? arrangedCategoriesById[formData.categoryId].name : '';
    console.log("formData: ",formData)

    // if(subCategoryId || newSubCategory){
    if(true){
        let formSubmitData = await fetch("/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        formSubmitData = await formSubmitData.json();
        $("#addTransactionModal").modal("hide");
        if(formSubmitData.status){
            await showStatusMessage("Added Successfully!", 'true', [loadCategories, loadTransactions]);
            form.reset();
            form.querySelector('.date-field').value = new Date().toISOString().split('T')[0];
        }else{
            await showStatusMessage(formSubmitData.error, 'false');
        }
    }else{
        $("#addTransactionModal").modal("hide");
        await showStatusMessage("Select sub category or enter new one", 'false');
    }
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
});
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
        $("#updateTransactionModal").modal("hide");
        if(formSubmitData.status){
            await showStatusMessage('Updated successfuly!', 'true', [loadCategories, loadTransactions]);
        }else{
            await showStatusMessage(formSubmitData.message, 'false');
        }
    }else{
        $("#updateTransactionModal").modal("hide");
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
                cell_2.innerHTML = `&#8377;  ${transactions[i].amount.toLocaleString("en-IN")}`;
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
      totalSavings: 0,
      totalOnLent: 0,
      totalAmount: 0,
    };
    transactions.forEach(e => {
      if (arrangedCategoriesById[e.categoryId].name == "Savings") {
        if (typeof savings.savings[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.savings[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.savings[arrangedCategoriesById[e.subCategoryId].name] += e.amount;
        savings.totalAmount += e.amount;
        savings.totalSavings += e.amount;
      }
      if (arrangedCategoriesById[e.categoryId].name == "Lent") {
        if (typeof savings.lent[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.lent[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.lent[arrangedCategoriesById[e.subCategoryId].name] += e.amount;
        savings.totalAmount += e.amount;
        savings.totalOnLent += e.amount;
      }
      if (arrangedCategoriesById[e.categoryId].name == "Lent Received") {
        if (typeof savings.lent[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.lent[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.lent[arrangedCategoriesById[e.subCategoryId].name] -= e.amount;
        savings.totalAmount -= e.amount;
        savings.totalOnLent -= e.amount;
      }
      if (["Kharch", "Withdraw"].includes(arrangedCategoriesById[e.categoryId].name)) {
        if (typeof savings.savings[arrangedCategoriesById[e.subCategoryId].name] == 'undefined') savings.savings[arrangedCategoriesById[e.subCategoryId].name] = 0;
        savings.savings[arrangedCategoriesById[e.subCategoryId].name] -= e.amount;
        savings.kharch += e.amount;
        savings.totalAmount -= e.amount;
        savings.totalSavings -= e.amount;
      }
    });
    const savingEntries = Object.entries(savings.savings);
    const lentEntries = Object.entries(savings.lent);
    const maxLoop = Math.max(savingEntries.length, lentEntries.length);
    const statsTbody = document.getElementById("stats-tbody");
    statsTbody.innerHTML = '';
    let rowDiv = document.createElement("div");
    for (let i = 0; i < maxLoop; i++) {
        row = statsTbody.insertRow();
        row.classList.add('stats-row');
        cell_l = row.insertCell(0);
        cell_2 = row.insertCell(1);
        cell_3 = row.insertCell(2);
        cell_4 = row.insertCell(3);
        cell_l.innerHTML = `${savingEntries[i] ? savingEntries[i][0] : '&nbsp;'}`;
        cell_2.innerHTML = `${savingEntries[i] ? '&#8377; '+savingEntries[i][1].toLocaleString("en-IN") : '&nbsp;'}`;
        cell_3.innerHTML = `${lentEntries[i] ? lentEntries[i][0] : '&nbsp;'}`;
        cell_4.innerHTML = `${lentEntries[i] ? '&#8377; '+lentEntries[i][1].toLocaleString("en-IN") : '&nbsp;'}`;
    }
    row = statsTbody.insertRow();
    row.classList.add('total-savings-lent');
    cell_1 = row.insertCell(0);
    cell_2 = row.insertCell(1);
    cell_3 = row.insertCell(2);
    cell_4 = row.insertCell(3);
    cell_1.classList.add('total-savings-title');
    cell_1.innerHTML = `Total:`;
    cell_2.innerHTML = `<b>&#8377;  ${savings.totalSavings.toLocaleString("en-IN")}</b>`;
    
    cell_3.classList.add('total-savings-title');
    cell_3.innerHTML = `Total`;
    cell_4.innerHTML = ` <b>&#8377;  ${savings.totalOnLent.toLocaleString("en-IN")}</b>`;

    row = statsTbody.insertRow();
    row.classList.add('total-savings');
    cell_l = row.insertCell(0);
    cell_l.colSpan = 4;
    cell_l.innerHTML = `<b>&#8377;  ${savings.totalAmount.toLocaleString("en-IN")}</b>`;
}
$('.new-sub-category-checkbox').on('click', function() {
    console.log("Triggered")
    $(this).closest("form").find("input[name='newSubCategory']").val("");
    $(this).closest("form").find("select.sub-category-field").val("");
    if ($(this).is(":checked")) {
        $(this).closest("form").find(".new-sub-category-form-group").removeClass("hide");
        $(this).closest("form").find(".existing-sub-category-form-group").addClass("hide");
    } else {
        $(this).closest("form").find(".new-sub-category-form-group").addClass("hide");
        $(this).closest("form").find(".existing-sub-category-form-group").removeClass("hide");
    }
});
$("#add-transaction-btn").on("click", function (event) {
    $("#add-savingstracker-form").find(".amount-field").trigger("focus");
})

window.onload = async function(){
    await loadCategories();
    await loadTransactions();
};
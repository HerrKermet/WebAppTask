
// variable deklaration and initialization of important fields
const port = "7245";
const uri = "https://localhost:" + port + "/api/Products";


function handleSearchIdInput(id) {
    return (id == "" || validateId(id))
}

function checkResponse(res) {
    return (res.status == 204 || res.status == 200);
}

function validateId(id) {
    return (/^[0-9]*$/.test(id));
}

/**
 * 
 * @param {any} input input which shouls be validated
 * @returns true if the input is a valid currency value
 */
function validateCurrencyInput(input) {
    if (isNaN(input))
        return false;
    return (/^\d+(\.\d{0,2})?$/.test(input));
}

//Sends a GET-request to get all products from the DB
function fetchProducts() {
    console.log("Fetch all products");
    fetch(uri, {
        method: "get",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(function (res) {
        res.json().then(function (content) {
            vm.entries = content;
        })
    }).catch(function (err) {
        console.log(err);
    })
}

//Sends a POST-request to initialize the DB with Products
function initializeProducts() {
    fetch(uri + "/InitializeData", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: { id: 0, name: "", price: 1, description: "" }
    });
}

function sortElements(field) {
    vm.entries.sort(fieldComparator(field));
}

function fieldComparator(field) {
    return function (a, b) {
        if (field == "name" || field == "description")
            return ("" + a[field]).localeCompare("" + b[field]);
        return a[field] - b[field];
    }

}

// Vue components ##############################

var product = {
    props: ["propentry"],
    data: function () {
        return {
            updatedEntry: {
                id: this.propentry.id,
                name: this.propentry.name,
                price: this.propentry.price,
                description: this.propentry.description
            }
        }
    },
    methods: {
        editEntry: function () {
            console.log("Edit entry: " + JSON.stringify(this.updatedEntry));
            this.$emit("commit-modify-entry", "update", this.propentry);
        },
        deleteEntry: function () {
            console.log("Delete entry: " + JSON.stringify(this.updatedEntry));
            this.$emit("commit-delete-entry", this.propentry);
        }
    },
    template: `
        <tr class="productRow">
            <td class="trId">{{propentry.id}}</td>
            <td class="trName">{{propentry.name}}</td>
            <td class="trPrice">{{propentry.price}} €</td>
            <td class="trDescription">{{propentry.description}}</td>
            <td class="trEdit"><button class="modifyBtn" v-on:click="editEntry">Bearbeiten</button></td>
            <td class="trDelete"><button class="deleteBtn" v-on:click="deleteEntry">Löschen</button></td>
        </tr>
    `
}


var vm = new Vue({
    el: "#app",
    data: {
        entries: [],
        specificEntry: [],
        formEntry: {

        },
        formError: false,
        searchId: "",
        mode: "create",
        isShowingSpecific: false
    },
    methods: {
        createEntry: function () {
            this.openForm("create");
        },
        updateEntry: function (entry) {
            for (let elem of this.entries) {
                if (elem.id == entry.id) {
                    elem.name = entry.name;
                    elem.price = entry.price;
                    elem.description = entry.description;
                }
            }
        },
        openForm: function (mode, entry) {
            //opens the dialog window in modal mode

            console.log("openForm: " + mode + " " + (mode == "update" ? JSON.stringify(entry) : ""));

            //initialize parameters
            this.formError = false;
            this.mode = mode;
            //check mode and prefill form
            if (mode == "create") {
                this.formEntry = { description: "" };
            }
            else if (mode == "update") {
                this.formEntry = {
                    id: entry.id,
                    name: entry.name,
                    price: entry.price,
                    description: entry.description
                };
            } else {
                //error - should not happen
            }


            const dialog = document.getElementById("dialog");
            dialog.showModal();
            console.log(dialog.returnValue);
        },
        confirmDialog: function () {
            //get input

            console.log(this.$refs.priceInput.value);
            if (validateCurrencyInput(this.formEntry.price) && this.formEntry.name && this.formEntry.name != "") {
                this.formError = false;
                console.log(JSON.stringify(this.formEntry));

                const context = this;
                var method;
                var params;

                if (this.mode == "create") {
                    method = "post";
                    params = "";
                }
                else {
                    method = "put";
                    params = "/" + this.formEntry.id;
                }

                fetch(uri + params, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(context.formEntry)
                }).then(res => {
                    console.log(res);
                    if (checkResponse(res)) {
                        if (res.status == 200)
                            return res.json();
                        else
                            return;
                    }
                    throw new Error("Fehler bei der Anfrage: " + res.status);
                }).then(data => {
                    if (data) {
                        //responded with id
                        context.entries.push(data);
                    } else {
                        //got no data but response was ok - update entry
                        context.updateEntry(context.formEntry);
                    }
                    dialog.close();
                }).catch(err => {
                    alert("Fehler bei der Anfrage: " + err);
                })

            }
            else {
                //input was invalid
                this.formError = true;
            }

        },
        cancelDialog: function () {
            //TODO reset dialog?
            const dialog = document.getElementById("dialog");
            this.$refs.priceInput.style.backgroundColor = "";
            this.$refs.nameInput.style.backgroundColor = "";
            dialog.close();
        },
        showEntry: function () {
            if (this.searchId == "") {
                this.isShowingSpecific = false;
                return;
            }
            if (!validateId(this.searchId)) {
                //input was invalid
                return;
            }

            let entry;
            for (let elem of this.entries) {
                if (elem.id == this.searchId) {
                    entry = [elem];
                    break;
                }
            }

            console.log(JSON.stringify(this.specificEntry));
            this.specificEntry = entry;
            this.isShowingSpecific = true;

        },
        deleteEntry: function (entry) {
            fetch(uri + "/" + entry.id, {
                method: "delete",
            }).then(function (res) {
                //check if request was successful and if so delete from entries to avoid fetching all items again
                if (checkResponse(res)) {
                    const index = vm.entries.indexOf(entry);
                    if (index >= 0) {
                        vm.entries.splice(index, 1);
                    };
                }
                console.log(res);
            })
        }
    },
    components: {
        "product": product
    }
})

// initialize page

//add function to start search with ENTER inside Searchbar
const inputField = document.getElementById("idSearchInput");
inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("showEntry").click();
    }
})

initializeProducts();
fetchProducts();



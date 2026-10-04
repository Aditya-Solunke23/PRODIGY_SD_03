const contactForm =
    document.getElementById("contactForm");

const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const contactList =
    document.getElementById("contactList");

const contactCount =
    document.getElementById("contactCount");

const searchInput =
    document.getElementById("searchInput");

const emptyState =
    document.getElementById("emptyState");

const message =
    document.getElementById("message");

const formTitle =
    document.getElementById("formTitle");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");


let contacts =
    JSON.parse(
        localStorage.getItem("contacts")
    ) || [];


let editingId = null;


/* -------------------------
   SAVE CONTACTS
------------------------- */

function saveContacts() {

    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );

}


/* -------------------------
   DISPLAY MESSAGE
------------------------- */

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className =
        `message ${type}`;

}


/* -------------------------
   DISPLAY CONTACTS
------------------------- */

function renderContacts() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredContacts =
        contacts.filter(contact => {

            return (
                contact.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                contact.phone
                    .toLowerCase()
                    .includes(searchTerm) ||

                contact.email
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    contactList.innerHTML = "";


    contactCount.textContent =
        `${contacts.length} ${
            contacts.length === 1
                ? "contact"
                : "contacts"
        }`;


    if (
        filteredContacts.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

        if (
            contacts.length > 0 &&
            searchTerm
        ) {

            emptyState.querySelector(
                "h3"
            ).textContent =
                "No matching contacts";

            emptyState.querySelector(
                "p"
            ).textContent =
                "Try a different search term.";

        } else {

            emptyState.querySelector(
                "h3"
            ).textContent =
                "No contacts found";

            emptyState.querySelector(
                "p"
            ).textContent =
                "Add your first contact using the form above.";

        }

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    filteredContacts.forEach(
        contact => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "contact-card";


            const firstLetter =
                contact.name
                    .charAt(0)
                    .toUpperCase();


            card.innerHTML = `

                <div class="contact-info">

                    <div class="contact-avatar">
                        ${firstLetter}
                    </div>

                    <div class="contact-details">

                        <h3>
                            ${escapeHTML(contact.name)}
                        </h3>

                        <p>
                            📞 ${escapeHTML(contact.phone)}
                        </p>

                        <p>
                            ✉️ ${escapeHTML(contact.email)}
                        </p>

                    </div>

                </div>


                <div class="contact-actions">

                    <button
                        class="action-btn edit-btn"
                        onclick="editContact('${contact.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteContact('${contact.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            contactList.appendChild(card);

        }
    );

}


/* -------------------------
   ADD / UPDATE CONTACT
------------------------- */

contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const email =
            emailInput.value.trim();


        if (
            name === "" ||
            phone === "" ||
            email === ""
        ) {

            showMessage(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        const phonePattern =
            /^[0-9+\-\s()]{7,20}$/;


        if (
            !phonePattern.test(phone)
        ) {

            showMessage(
                "Please enter a valid phone number.",
                "error"
            );

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        if (editingId !== null) {

            const contact =
                contacts.find(
                    item =>
                        item.id === editingId
                );


            if (contact) {

                contact.name = name;

                contact.phone = phone;

                contact.email = email;

            }


            showMessage(
                "Contact updated successfully.",
                "success"
            );

        } else {

            const newContact = {

                id:
                    Date.now().toString(),

                name: name,

                phone: phone,

                email: email

            };


            contacts.push(
                newContact
            );


            showMessage(
                "Contact added successfully.",
                "success"
            );

        }


        saveContacts();

        renderContacts();

        resetForm();

    }
);


/* -------------------------
   EDIT CONTACT
------------------------- */

function editContact(id) {

    const contact =
        contacts.find(
            item =>
                item.id === id
        );


    if (!contact) {
        return;
    }


    editingId = id;


    nameInput.value =
        contact.name;

    phoneInput.value =
        contact.phone;

    emailInput.value =
        contact.email;


    formTitle.textContent =
        "Edit Contact";

    submitBtn.textContent =
        "Update Contact";

    cancelBtn.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    nameInput.focus();

}


window.editContact =
    editContact;


/* -------------------------
   DELETE CONTACT
------------------------- */

function deleteContact(id) {

    const contact =
        contacts.find(
            item =>
                item.id === id
        );


    if (!contact) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${contact.name}?`
        );


    if (!confirmed) {
        return;
    }


    contacts =
        contacts.filter(
            item =>
                item.id !== id
        );


    saveContacts();

    renderContacts();


    if (editingId === id) {
        resetForm();
    }


    showMessage(
        "Contact deleted successfully.",
        "success"
    );

}


window.deleteContact =
    deleteContact;


/* -------------------------
   CANCEL EDIT
------------------------- */

cancelBtn.addEventListener(
    "click",
    function () {

        resetForm();

        showMessage(
            "",
            ""
        );

    }
);


/* -------------------------
   RESET FORM
------------------------- */

function resetForm() {

    contactForm.reset();

    editingId = null;

    formTitle.textContent =
        "Add New Contact";

    submitBtn.textContent =
        "Add Contact";

    cancelBtn.classList.add(
        "hidden"
    );

}


/* -------------------------
   SEARCH
------------------------- */

searchInput.addEventListener(
    "input",
    renderContacts
);


/* -------------------------
   HTML ESCAPING
------------------------- */

function escapeHTML(value) {

    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* -------------------------
   INITIAL LOAD
------------------------- */

renderContacts();
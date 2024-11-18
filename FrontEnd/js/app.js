async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error (`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (filter) {
            const filtered = json.filter((data) => data.categoryId === filter);      
            for(let i = 0; i < filtered.length; i++) {
                setFigure(filtered[i]);
                setModalFigure(filtered[i]);
            }
        } else{
            for(let i = 0; i < json.length; i++) {
                setFigure(json[i]);
                setModalFigure(json[i]);
            }
        }
        //Delete
        const trashCans = document.querySelectorAll(".fa-trash-can");
        trashCans.forEach((e) =>
            e.addEventListener("click", (event) => deleteWork(event))
        );
        
    } catch (error) {
      console.error(error.message);
    };
}
getWorks();


function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
}

function setModalFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<div class="image-container">
        <img src=${data.imageUrl} alt=${data.title}>
		<figcaption>${data.title}</figcaption>
        <i id=${data.id} class="fa-solid fa-trash-can overlay-icon"></i>
        </div>`;

    document.querySelector(".gallery-modal").append(figure);
}

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error (`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        //
         for(let i = 0; i < json.length; i++) {
            setFilter(json[i]);
            console.log(json[i]);
            //document.querySelector(".objets").addEventListener("click", .filter(word) => word.length > 6)

        }
    } catch (error) {
      console.error(error.message);
    };
}

getCategories();

function setFilter(data) {
    const div = document.createElement("div");
    div.className = data.id;
    div.addEventListener("click", () => getWorks(data.id));
    div.innerHTML = `${data.name}`;

    document.querySelector(".div-container").append(div);
}
document.querySelector(".tous").addEventListener("click", () => getWorks());

function displayAdminMode(){
    if (sessionStorage.authToken) {
        const editBanner = document.createElement("div");
        editBanner.className = "edit";
        editBanner.innerHTML =
          '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
        document.body.prepend(editBanner);

        const login = document.querySelector(".login")
        login.textContent = "logout";
    }
}

displayAdminMode();

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-stop")
        .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) return;
    //if (e.target.classList.contains("fa-trash-can")) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-close")
        .removeEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-stop")
        .removeEventListener("click", stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
    if (e.shiftkey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length -1;
    }
    focusables[index].focus();
};

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});

document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
});

//fonction de Suppression

async function deleteWork(event) {
    //event.stopPropagation();
    const id = event.srcElement.id;
    const deleteApi = "http://localhost:5678/api/works/";
    const token = sessionStorage.authToken;

    let response = await fetch(deleteApi + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (response.status == 401 || response.status == 500) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = "Il y a eu une erreur";
        document.querySelector(".modal-button-container").prepend(errorBox);
    } else {
        let result = await response.json();
        console.log(result);
    }
}

/*Modal switch

const switchModal = function () {
    console.log("clicked");
    document.querySelector(
        ".modal-wrapper"
    ).innerHTML = `<div class="close-button-container">
                <button class="js-modal-back">
					<i class="fa-solid fa-arrow-left"></i>
				</button>
				<button class="js-modal-close">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
            <h3>Ajout photo</h3>
            <div id="contact">
                <form action="#" method="post">
					<label for="name">Titre</label>
					<input type="text" name="title" id="title">
					<label for="category">Catégorie</label>
					<input type="text" name="category" id="category">
					<input type="submit" value="Envoyer">
				</form>
            </div>
            <hr>
            <div class="modal-button-container">
                <button class="validate-button"></button>
            </div>`;
//modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
//modal.querySelector("js-modal-back").addEventListener("click", closeModal);
};

const backButton = document.querySelector(".fa-arrow-left");

const addPhotoButton = document.querySelector(".add-photo");
console.log(addPhotoButton);
addPhotoButton.addEventListener("click", switchModal);*/

// Modal Toggle
const addPhotoButton = document.querySelector(".add-photo");
const backButton = document.querySelector(".js-modal-back");

addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

function toggleModal() {
    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");

    if (galleryModal.style.display === "block" ||
        galleryModal.style.display === ""
    ) {
        galleryModal.style.display = "none";
        addModal.style.display = "block";
        console.log("1");
    } else {
        galleryModal.style.display = "none";
        addModal.style.display = "block";
        console.log("2");
    }
}



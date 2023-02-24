const births = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const levels = ["Junior", "Middle", "Senior"];

let pupilsJson = localStorage.getItem("pupils");
let pupils = JSON.parse(pupilsJson) ?? [];


const pupilTable = document.getElementById("pupilTable");
const pupilForm = document.getElementById("pupilForm");
const sendBtn = document.getElementById("sendBtn");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const addressName = document.getElementById("addressName");
const pupilBirth = document.getElementById("pupilBirth");
const pupilLevel = document.getElementById("pupilLevel");

const pupilCheckWork = document.getElementById("pupilCheckWork");
const formModal = document.querySelector(".modal");
const searchInput = document.getElementById("search");
const filterGroup = document.getElementById("filterGroup");

let selected = null;

const getRow = ({ id, firstName, lastName, addressName, pupilBirth,pupilLevel, isWork }) => {
    return `
    <tr>
      <th scope="row">${id}</th>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${addressName}</td>
      <td>${pupilBirth}</td>
      <td>${pupilLevel}</td>
      <td>${isWork ? "Ha" : "Yo'q"}</td>
      <td class="text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pupilModal" onclick="editPupil(${id})">Edit</button>
        <button class="btn btn-danger" onclick="deletePupil(${id})">Delete</button>
      </td>
      </tr>
      `;
};

births.forEach((birth) => {
    pupilBirth.innerHTML += `<option value="${birth}">${birth}</option>`;
});
levels.forEach((level) => {
    pupilLevel.innerHTML += `<option value="${level}">${level}</option>`;
});

// ["Barchasi", ...groups].forEach((group) => {
//     filterGroup.innerHTML += `<option value="${group}">${group}</option>`;
// });

const getPupils = (newPupils) => {
    pupilTable.innerHTML = "";
    (newPupils || pupils).forEach((pupil) => {
        pupilTable.innerHTML += getRow(pupil);
    });
};

getPupils();

pupilForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let check = this.checkValidity();
    this.classList.add("was-validated");
    if (check) {
        bootstrap.Modal.getInstance(formModal).hide();
        let newPupil = {
            firstName: firstName.value,
            lastName: lastName.value,
            addressName: addressName.value,
            birth: pupilBirth.value,
            level:pupilLevel.value,
            isWork: pupilCheckWork.checked,
        };
        if (selected) {
            pupils = pupils.map((pupil) => {
                if (pupil.id == selected.id) {
                    return {
                        id: selected.id,
                        ...newPupil,
                    };
                } else {
                    return pupil;
                }
            });
        } else {
            newPupil.id = pupils.length;
            pupils.push(newPupil);
        }
        localStorage.setItem("pupils", JSON.stringify(pupils));
        window.location.reload(); // bo'shatish uchun
    }
    getPupils();
});

function editPupil(id) {
    let pupil = pupils.find((pupil) => pupil.id == id);
    selected = pupil;
    firstName.value = pupil.firstName;
    lastName.value = pupil.lastName;
    addressName.value = pupil.addressName;
    pupilBirth.value = pupil.birth;
    pupilLevel.value=pupil.level;
    pupilCheckWork.checked = pupil.isWork;
}

function deletePupil(id) {
    let isConfirm = confirm("O'chirishni xohlaysizmi ?");
    if (isConfirm) {
        pupils = pupils.filter((pupil) => pupil.id != id);
        localStorage.setItem("pupils", JSON.stringify(pupils));
        getPupils();
    }
}

searchInput.addEventListener("input", function () {
    let search = this.value.toLowerCase();
    searchPupils = pupils.filter(
        (pupil) =>
            pupil.firstName.toLowerCase().includes(search) ||
            pupil.lastName.toLowerCase().includes(search)
    );
    getPupils(searchPupils);
});

filterBirth.addEventListener("change", function () {
    if (this.value == "Barchasi") {
        getPupils();
    } else {
        filterPupils = pupils.filter((pupil) => pupil.birth == this.value);
        getPupils(filterPupils);
    }
});
filterLevel.addEventListener("change", function () {
    if (this.value == "Barchasi") {
        getPupils();
    } else {
        filterPupils = pupils.filter((pupil) => pupil.level == this.value);
        getPupils(filterPupils);
    }
});

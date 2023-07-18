const form = document.getElementById("form");
const msg = document.querySelector(".msg");

let gallery = [];

// user image preview
const img = document.createElement("img");
const preview = document.getElementById("preview");
const profile = document.querySelector(".profile");

form.onsubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  let finalData = [];
  if (localStorage.getItem("data")) {
    finalData = JSON.parse(localStorage.getItem("data"));
  }
  data.profile_photo = URL.createObjectURL(data.profile_photo);

  data.gallery_photo = gallery;

  if (!data.name.trim()) {
    msg.innerHTML = alertMessage("All fields are required", "danger");
  } else if (!isMobile(data.cell)) {
    msg.innerHTML = alertMessage("Cell No Not Valid", "warning");
  } else if (!isEmail(data.email)) {
    msg.innerHTML = alertMessage("Mail Not Valid", "info");
  } else {
    msg.innerHTML = alertMessage("Data Stable", "success");
    finalData.unshift(data);
    localStorage.setItem("data", JSON.stringify(finalData));
    img.remove();
    gallery_container.innerHTML = "";
    getAllData();
    form.reset();
  }
};

preview.onchange = (e) => {
  const url = URL.createObjectURL(e.target.files[0]);
  img.setAttribute("src", url);
  profile.appendChild(img);
};

// gallery preview

const gallery_preview = document.getElementById("gallery_preview");
const gallery_container = document.querySelector(".gallery-container");

gallery_preview.onchange = (e) => {
  let files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    // let img = document.createElement('img');
    // img.src = URL.createObjectURL(files[i]);
    // gallery_container.appendChild(img);
    const element = URL.createObjectURL(files[i]);
    gallery.push(element);
  }
  renderGallery();
};

const renderGallery = () => {
  gallery_container.innerHTML = "";

  gallery.map((item, index) => {
    gallery_container.innerHTML += `<div class="my-3" id="${index}">
		<img src="${item}" alt="">
		 <span><i onclick="deletePic('${item}')" class="fa fa-close"></i></span>
		 </div>`;
  });
};

const deletePic = (blop) => {
  let value = blop;

  let update = gallery.filter((data) => data != value);

  gallery = [];
  update.map((item, index) => {
    gallery.push(item);
  });
  renderGallery();
};

// show Ls data to table

const userlist = document.querySelector(".userlist");

const getAllData = () => {
  let data = JSON.parse(localStorage.getItem("data"));

  if (!data) {
    userlist.innerHTML = `
			<tr>
				<td colspan="7" class="text-center" >No User Found</td>
			</tr>
		`;
  }

  if (data) {
    let list = "";
    data.map((item, index) => {
      list += `<tr >
			<td>${index + 1}</td>
			<td>${item.name}</td>
			<td>${item.email}</td>
			<td>${item.cell}</td>
		
			<td>
				<a class="btn btn-sm btn-danger"><i class="fa fa-trash" onclick="deleteUser('${index}')"></i></a>
			</td>
		</tr>`;
    });
    userlist.innerHTML = list;
  }
};

getAllData();

//delete user

const deleteUser = (userIndex) => {
  let index = userIndex;

  let data = getData("data");

  data.splice(index, 1);
  updateData("data", data);
  getAllData();
};

const getData = (key) => {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return false;
  }
};

const updateData = (key, array) => {
  localStorage.setItem(key, JSON.stringify(array));
};

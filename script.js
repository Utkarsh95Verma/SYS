// Get DOM elements
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const saveBtn = document.getElementById("saveBtn");
const tableBody = document.querySelector("#studentsTable tbody");
const searchInput = document.getElementById("search");
const clearStorageBtn = document.getElementById("clearStorage");
const studentIdField = document.getElementById("studentId");

// Load students from localStorage
const API_URL = "https://sys-w688.onrender.com";

async function loadStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();
  
  const tableBody = document.querySelector("#studentsTable tbody");
  tableBody.innerHTML = "";
  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.course}</td>
      <td>
        <button onclick="deleteStudent(${s.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

document.getElementById("studentForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    name: document.getElementById("name").value,
    roll: document.getElementById("roll").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  e.target.reset();
  loadStudents();
});

async function deleteStudent(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadStudents();
}

loadStudents();


// Display students in table
function renderTable(filter = "") {
  tableBody.innerHTML = "";

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.roll.toLowerCase().includes(filter.toLowerCase())
  );

  filteredStudents.forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.roll}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td>
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Save to localStorage
function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Add or update student
form.addEventListener("submit", e => {
  e.preventDefault();

  const id = studentIdField.value;
  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();
  const email = emailInput.value.trim();
  const course = courseInput.value.trim();

  if (!name || !roll) {
    alert("Name and Roll Number are required!");
    return;
  }

  if (id) {
    // Update existing student
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { id, name, roll, email, course };
    }
    saveBtn.textContent = "Add Student";
  } else {
    // Add new student
    const newStudent = {
      id: Date.now().toString(),
      name,
      roll,
      email,
      course,
    };
    students.push(newStudent);
  }

  saveToStorage();
  renderTable();
  form.reset();
  studentIdField.value = "";
});

// Handle edit and delete buttons
tableBody.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("edit-btn")) {
    const student = students.find(s => s.id === id);
    if (student) {
      nameInput.value = student.name;
      rollInput.value = student.roll;
      emailInput.value = student.email;
      courseInput.value = student.course;
      studentIdField.value = student.id;
      saveBtn.textContent = "Update Student";
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this student?")) {
      students = students.filter(s => s.id !== id);
      saveToStorage();
      renderTable();
    }
  }
});

// Search functionality
searchInput.addEventListener("input", e => {
  renderTable(e.target.value);
});

// Clear localStorage
clearStorageBtn.addEventListener("click", () => {
  if (confirm("This will delete all data. Continue?")) {
    localStorage.removeItem("students");
    students = [];
    renderTable();
  }
});

// Initial render
renderTable();

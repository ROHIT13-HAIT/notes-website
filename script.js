// Update this when you add/remove files
const notesStructure = {
  "HTML": {
    "Introduction to HTML": "notes/HTML/HTML5topics.txt",
    "Forms & Inputs": "notes/HTML/Forms & Inputs.txt"
  },
  "CSS": {
    "Selectors": "notes/CSS/css.txt",
    "Flexbox": "notes/css/flexbox.txt"
  },
  "JavaScript": {
    "Basics": "notes/JavaScript/Lecture 1 JavaScript Introduction.txt",
    "Data Types and Variables": "notes/JavaScript/Lecture 2 JavaScript Data Types and Variables.txt"
  }
};

const sidebar = document.getElementById("sidebarContent");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const downloadBtn = document.getElementById("downloadBtn");
let currentFile = null;

// Build folder UI
Object.entries(notesStructure).forEach(([folder, notes]) => {
  const folderDiv = document.createElement("div");
  const title = document.createElement("div");
  title.className = "folder-title";
  title.textContent = folder;
  title.onclick = () => {
    list.style.display = list.style.display === "block" ? "none" : "block";
  };

  const list = document.createElement("ul");
  list.className = "note-list";

  Object.entries(notes).forEach(([noteName, filePath]) => {
    const li = document.createElement("li");
    li.textContent = noteName;
    li.onclick = () => {
      // Remove 'active' class from all subtopics
      document.querySelectorAll(".note-list li").forEach(el => el.classList.remove("active"));
    
      // Add 'active' class to the clicked item
      li.classList.add("active");
    
      // Update title and fetch note
      noteTitle.textContent = noteName;
      currentFile = { name: noteName, path: filePath };
      fetch(filePath)
        .then(res => res.ok ? res.text() : Promise.reject("File not found"))
        .then(text => {
          noteContent.textContent = text;
          downloadBtn.disabled = false;
        })
        .catch(err => {
          noteContent.textContent = `⚠️ ${err}`;
          downloadBtn.disabled = true;
        });
    };
    list.appendChild(li);
  });

  folderDiv.appendChild(title);
  folderDiv.appendChild(list);
  sidebar.appendChild(folderDiv);
});

// Dark mode toggle
document.getElementById("toggleDark").onclick = () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-bs-theme");
  html.setAttribute("data-bs-theme", current === "dark" ? "light" : "dark");
};

// Download note as .txt
downloadBtn.onclick = () => {
  if (!currentFile) return;
  fetch(currentFile.path)
    .then(res => res.text())
    .then(data => {
      const blob = new Blob([data], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = currentFile.name + ".txt";
      a.click();
    });
};
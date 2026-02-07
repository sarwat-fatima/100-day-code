
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter="all";
let searchQuery="";
let editIndex=null;

function getToday(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function isValidDateInput(value){
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isPastDate(value){
  return value < getToday();
}

function initDateMin(){
  const minDate = getToday();
  taskDate.setAttribute("min", minDate);
  editDate.setAttribute("min", minDate);
}

initDateMin();

/* SWITCH PAGES */
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".sidebar button").forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
}

/* SAVE */
function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD */
function addTask(){
  const text = taskText.value.trim();
  if(!text) return;
  if(!taskDate.value || !isValidDateInput(taskDate.value) || isPastDate(taskDate.value)){
    alert("Please select a valid date (YYYY-MM-DD) that is today or later.");
    return;
  }

  tasks.push({
    text,
    date:taskDate.value,
    done:false,
    priority:taskPriority.value
  });

  taskText.value="";
  taskDate.value="";
  taskPriority.value="low";

  save();
  render();
  showPage("tasks");
}

/* TOGGLE */
function toggle(i){
  tasks[i].done=!tasks[i].done;
  save();
  render();
}

/* DELETE */
function deleteTask(i){
  tasks.splice(i,1);
  save();
  render();
}

/* EDIT */
function editTask(i){
  editIndex=i;
  editText.value=tasks[i].text;
  editDate.value=tasks[i].date || "";
  editPriority.value=tasks[i].priority || "low";
  openModal();
}

/* FILTER */
function setFilter(f){
  filter=f;
  render();
}

function setSearch(q){
  searchQuery=q.toLowerCase();
  render();
}

/* MODAL */
function openModal(){
  document.getElementById("modal").classList.add("active");
}

function closeModal(){
  document.getElementById("modal").classList.remove("active");
  editIndex=null;
}

function handleBackdrop(e){
  if(e.target.id==="modal") closeModal();
}

function saveEdit(){
  if(editIndex===null) return;
  const t = editText.value.trim();
  if(!t) return;
  if(!editDate.value || !isValidDateInput(editDate.value) || isPastDate(editDate.value)){
    alert("Please select a valid date (YYYY-MM-DD) that is today or later.");
    return;
  }
  tasks[editIndex].text=t;
  tasks[editIndex].date=editDate.value;
  tasks[editIndex].priority=editPriority.value;
  save();
  render();
  closeModal();
}

/* RENDER */
function render(){
  const list=document.getElementById("taskList");
  list.innerHTML="";

  let filtered=tasks.filter(t=>{
    if(filter==="completed") return t.done;
    if(filter==="pending") return !t.done;
    return true;
  });

  if(searchQuery){
    filtered=filtered.filter(t=>t.text.toLowerCase().includes(searchQuery));
  }

  filtered.forEach((task,i)=>{
    const li=document.createElement("li");
    const priority = task.priority || "low";
    li.className="task "+(task.done?"completed ":"")+"priority-"+priority;

    li.innerHTML=`
      <div class="task-check">
        <input type="checkbox" ${task.done ? "checked" : ""} onclick="toggle(${i})">
      </div>
      <div class="task-title">${task.text}</div>
      <div class="task-date">${task.date||""}</div>
      <div class="task-priority">${priority}</div>
      <div class="task-actions">
        <button class="btn-edit" onclick="editTask(${i})">Edit</button>
        <button class="btn-delete" onclick="deleteTask(${i})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  renderReminders();
}

function renderReminders(){
  const box=document.getElementById("reminderList");
  if(!box) return;
  box.innerHTML="";

  const priorityRank={high:3, med:2, low:1};
  const pending=tasks.filter(t=>!t.done);
  pending.sort((a,b)=>{
    const pr=(priorityRank[b.priority||"low"]-priorityRank[a.priority||"low"]);
    if(pr!==0) return pr;
    return (a.date||"").localeCompare(b.date||"");
  });

  if(pending.length===0){
    const empty=document.createElement("div");
    empty.className="reminder";
    empty.innerHTML=`<div class="reminder-title">No reminders</div>
      <div class="reminder-meta">All tasks are completed.</div>`;
    box.appendChild(empty);
    return;
  }

  pending.forEach(t=>{
    const level=t.priority||"low";
    const card=document.createElement("div");
    card.className=`reminder ${level}`;
    const msg = level==="high"
      ? "High priority task. Please complete it today."
      : level==="med"
        ? "Medium priority task. Keep it on your radar."
        : "Low priority task. Complete it when you can.";

    card.innerHTML=`
      <div class="reminder-title">${t.text}</div>
      <div class="reminder-meta">Due: ${t.date||"No date"} · Priority: ${level}</div>
      <div class="reminder-meta">${msg}</div>
    `;
    box.appendChild(card);
  });
}

render();


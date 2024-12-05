
let tasks = document.querySelector(".tasks");
let inputTask = document.querySelector(".add-task input");
let btnTask = document.querySelector(".add-task span");
let localData = {
  task:[]
};

loadData();
window.onload = inputTask.focus();
noTask();
tackCount();
btnTask.onclick = AddTask;

function noTask() {
  // <div class="no-task">No Task To Show</div>
  if (tasks.children.length === 0) {
    let noTask = document.createElement("div");
    noTask.className = "no-task";
    noTask.textContent = "No Task To Show";
    tasks.append(noTask);
  }
}

function AddTask() {
  if (isEmpty()) {
    error("Input Error", "Make sure the input not empty");
  } else if (isExsis()) {
    error("Task is Exsist", "Make sure the The task is Exsist");
  } else {
    createTask(inputTask.value);
    inputTask.value = "";
    tackCount();
    inputTask.focus();
  }
}
function isEmpty() {
  if (inputTask.value.trim() == "") {
    return true;
  } else {
    return false;
  }
}
function isExsis() {
  let valid = false;
  let allText = [...tasks.children].map((child) => {
    if (child.children[0]) {
      return child.children[0].textContent;
    }
  });
  allText.forEach((text) => {
    if (text === inputTask.value) {
      valid = true;
      return valid;
    }
  });
  return valid;
}
function error(errTitle, errName, type = "X") {
  let error = document.querySelector(".error");
  error.children[0].textContent = type;
  error.children[1].textContent = errTitle;
  error.children[2].textContent = errName;
  error.classList.add("show");
}
function createTask(task,type=true) {
  /*
    <div class="task">
    <p>Task One</p>
    <div class="button">
      <span class="done">Done</span>
      <span class="delete">Delete</span>
    </div>
  </div> 
  */
  // delete no task message
  if (type) {
    if (tasks.children.item(0).className === "no-task") {
      tasks.children.item(0).remove();
    }
  }

  let div = document.createElement("div");
  let p = document.createElement("p");
  let divBtn = document.createElement("div");
  let done = document.createElement("span");
  let del = document.createElement("span");

  div.className = "task";
  p.textContent = task;
  divBtn.className = "button";
  done.className = "done";
  del.className = "delete";
  done.textContent = "Done";
  del.textContent = "Delete";

  divBtn.append(done, del);
  div.append(p, divBtn);
  tasks.appendChild(div);
  if (type) {
    localData.task.push(task)
    localStorage.setItem('task',JSON.stringify(localData))
  }
}
function tackCount() {
  let countSpan = document.querySelector(".num-task span");
  let count = 0;
  for (let i = 0; i < tasks.children.length; i++) {
    if (tasks.children[i].className !== "no-task") {
      count++;
    }
  }
  countSpan.textContent = count;
}

function countComplate() {
  let complate = document.querySelector(".num-complate span");
  complate.textContent = document.querySelectorAll(".task.done ").length;
}

function loadData() {
  if(localStorage.getItem('task')) {
    let data = JSON.parse(localStorage.getItem('task'));
    data.task.forEach(task => {
      createTask(task,false)
    })
  } else {
    localStorage.setItem('task',localData)
  }
}
function deleteLocal (e) {
  let data = JSON.parse(localStorage.task).task.filter (task => {
    return e.target.parentElement.parentElement.children[0].textContent != task ? task : false
  })
  localData.task = data;
  localStorage.setItem('task',JSON.stringify(localData));
}

inputTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    AddTask();
  }
});
document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    e.target.parentElement.parentElement.remove();
    deleteLocal(e)
    noTask();
    tackCount();
    countComplate();
  }
  if (e.target.className == "done") {
    e.target.parentElement.parentElement.classList.toggle("done");
    countComplate();

  }
  if (e.target.id === "error-ok") {
    e.target.parentNode.classList.remove("show");
    inputTask.focus();
  }
  if (e.target.id == "complated-all") {
    if (tasks.children[0].className=='no-task') {
      error("No Task", "you have no task today", "!");
    } else {
      [...tasks.children].forEach((task) => {
        task.classList.add("done");
        noTask();
        countComplate();
      });
    }
  }
  if (e.target.id == "delete=all") {
    if (tasks.children[0].className=='no-task') {
      error("No Task", "you have no task today", "!");
    } else {
      [...tasks.children].forEach((task) => {
        task.remove();
        noTask();
        countComplate();
        tackCount();
      });
      localStorage.task = [];
    }
  }
});

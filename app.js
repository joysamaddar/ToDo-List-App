const todo_input = document.querySelector("#todo-input");
const todo_submit = document.querySelector("#todo-submit");
const tasks = document.querySelector(".tasks");
const filterbtn = document.querySelector(".filter");
const filtercontainer = document.querySelector(".filter-container");
const allbtn = document.querySelector(".allbtn");
const incompletebtn = document.querySelector(".incompletebtn");
const completebtn = document.querySelector(".completebtn");
const closeFilterIcon = document.querySelector(".closeFilterIcon");

class Task {
  constructor(taskname) {
    this.taskname = taskname;
  }
}

class TaskUI {
  static getTasksonReload() {
    const tasks = StoreTask.getTasks();
    tasks.forEach((task) => {
      this.addTasktoUI(task);
    });
  }
  static addTasktoUI(task) {
    const cont = document.createElement("div");
    cont.className = "task-card  justify-content-center mt-4";
    cont.innerHTML = `<div class="card border-info d-inline-block">
    <div class="card-body py-3">
      ${task.taskname}
    </div>
  </div>
  <button type="button" class="btn btn-success">
    <i class="fas fa-check"></i>
  </button>
  <button type="button" class="btn btn-danger">
    <i class="fas fa-times"></i>
  </button>`;
    tasks.appendChild(cont);
  }
  static removeTask(task) {
    task.parentElement.remove();
  }
  static checkTask(task) {
    if (!task.parentElement.firstChild.classList.contains("bg-success")) {
      task.classList.add("text-white");
      task.classList.add("bg-success");
      task.classList.remove("border-info");
    } else {
      task.classList.remove("text-white");
      task.classList.remove("bg-success");
      task.classList.add("border-info");
    }
  }

  static showAlert(message, type) {
    const alertmessage = document.createElement("div");
    alertmessage.className = `alert mt-5 alert-dismissible alert-${type}`;
    alertmessage.innerHTML = `${message}`;
    document.querySelector(".container").insertBefore(alertmessage, tasks);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static addTaskCheck() {
    const tasks = StoreTask.getTasks();
    tasks.forEach((task) => {
      if (task.check) {
        const checkcont = document.querySelectorAll(".card");
        checkcont.forEach((cont) => {
          if (cont.innerText === task.taskname) {
            this.checkTask(cont);
          }
        });
      }
    });
  }
}

class StoreTask {
  static getTasks() {
    let tasks = [];
    if (localStorage.getItem("task")) {
      tasks = JSON.parse(localStorage.getItem("task"));
    } else {
      tasks = [];
    }
    return tasks;
  }

  static addTasktoStorage(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem("task", JSON.stringify(tasks));
  }

  static removeTaskfromStorage(task) {
    const tasks = this.getTasks();
    tasks.forEach((task2, index) => {
      if (
        task2.taskname.toLowerCase() ===
        task.parentElement.firstChild.textContent.trim().toLowerCase()
      ) {
        console.log(true);
        tasks.splice(index, 1);
      }
    });
    localStorage.setItem("task", JSON.stringify(tasks));
  }

  static storeCheck(taskname) {
    const tasks = this.getTasks();
    tasks.forEach((task) => {
      if (task.taskname === taskname) {
        if (!task.check) {
          task.check = true;
        } else {
          task.check = false;
        }
      }
    });
    localStorage.setItem("task", JSON.stringify(tasks));
  }
}

todo_submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (!todo_input.value == "") {
    const task = new Task(todo_input.value);
    todo_input.value = "";
    TaskUI.addTasktoUI(task);
    StoreTask.addTasktoStorage(task);
    TaskUI.showAlert("Task added successfully.", "success");
  } else {
    TaskUI.showAlert("Please enter a task.", "warning");
  }
});

tasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-danger")) {
    TaskUI.removeTask(e.target);
    TaskUI.showAlert("Task removed successfully.", "danger");
    StoreTask.removeTaskfromStorage(e.target);
  }
  if (e.target.classList.contains("btn-success")) {
    TaskUI.checkTask(e.target.parentElement.firstChild);
    StoreTask.storeCheck(e.target.parentElement.firstChild.innerText);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  TaskUI.getTasksonReload();
  TaskUI.addTaskCheck();
});

filterbtn.addEventListener("click", () => {
  filtercontainer.style.display = "flex";
});

filtercontainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("closefilter")) {
    filtercontainer.style.display = "none";
  }
});

allbtn.addEventListener("click", () => {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.style.display = "flex";
  });
  filtercontainer.style.display = "none";
});

incompletebtn.addEventListener("click", () => {
  document.querySelectorAll(".task-card").forEach((card) => {
    if (card.firstChild.classList.contains("bg-success") === true) {
      card.style.display = "none";
    } else {
      card.style.display = "flex";
    }
  });
  filtercontainer.style.display = "none";
});

completebtn.addEventListener("click", () => {
  document.querySelectorAll(".task-card").forEach((card) => {
    if (card.firstChild.classList.contains("bg-success") === false) {
      card.style.display = "none";
    } else {
      card.style.display = "flex";
    }
  });
  filtercontainer.style.display = "none";
});

closeFilterIcon.addEventListener("click", () => {
  filtercontainer.style.display = "none";
});

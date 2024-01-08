let $ = document.querySelector.bind(document);
let $$= document.querySelectorAll.bind(document);
const todo = "todo";
const page = "page"
let TODOS = [...JSON.parse(localStorage.getItem("todo") || "[]")] || [];


const setLocalStorage = (store, data) => {
    localStorage.setItem(store, JSON.stringify(data));
}
const getLocalStorage = (store) => {
    return [...JSON.parse(localStorage.getItem(store))] 

}
const htmls = ([first, ...rest], ...values) => {
    return values.reduce(
                (acc, curr) => acc.concat(curr, rest.shift()
            ), [first])
            .filter(x =>  x && x!== true || x===0)
            .join('');
}

const loadingBar = () => {
    $('.loading').style = 'display : block;'
    setTimeout(()=>{
        $('.loading').style = 'display : none;'
        app.render();
    },1000);
}
const app = {
    completePage : JSON.parse(localStorage.getItem(page)) || false,
    handleAddTask: function(){
        const nameTask = event.target.parentNode.querySelector('.add-task__name').value;
        if (!nameTask) {
            console.log("novalue");
            return;
        }
        TODOS = [
            ...TODOS, 
            {
                id: "ID"+Math.ceil(Math.random()*100000),
                name: nameTask, 
                completed: false
            }];
        setLocalStorage(todo, TODOS)
        loadingBar();
    },
    handleDeleteTask: function(id){
        const copyTodos = TODOS.filter(todo=> todo.id !== id)
        TODOS = [...copyTodos]
        setLocalStorage(todo, TODOS)
        loadingBar();
    }
    ,
    handleUpdateTask: function(){
        console.log(event.target);
        event.target.parentNode.parentNode.querySelector('.modal-update__name-task').style = 'display: block;'
       event.target.parentNode.parentNode.querySelector('.task-name span').style = 'display:none';
       event.target.parentNode.parentNode.querySelector('.btn-check').style = 'display: block !important;'
       event.target.style = 'display:none';
    },
    handleSubmitUpdate: (id) => {
        const data = event.target.parentNode.parentNode.querySelector('.modal-update__name-task').value;
        if (!data) {
            
            return;
        }
        const todoModify = TODOS.find(todo => todo.id === id);
        if (todoModify) {
            todoModify.name = data;
        }
        setLocalStorage(todo, TODOS);
        loadingBar();
    },
    handleCompleteTask: (id)=> {
        $('.btn-complete').checked = true;
        const todoCompleted = TODOS.find(todo => todo.id === id);
        if (todoCompleted) {
            todoCompleted.completed = true;
        }
        setLocalStorage(todo, TODOS);
        loadingBar();
    },
    handlePageComplete: ()=> {
        app.completePage = !app.completePage;
        setLocalStorage(page, app.completePage);
        loadingBar();
        
    },
    handleUnCompleteTask: (id)=> {
        $('.btn-complete').checked = false;
        const todoCompleted = TODOS.find(todo => todo.id === id);
        if (todoCompleted) {
            todoCompleted.completed = false;
        }
        setLocalStorage(todo, TODOS)
        loadingBar(); 
    },
    render: function(){
        const containerContent = $('.contaier-content');
        const footer = $('.todolist-footer')
        const html = htmls`
            ${  !app.completePage
                &&
                `<div class="todolist__add-task">
                    <input type="text" class="todolist_input add-task__name" placeholder="Task name">
                     <button class="btn add-task__btn" onclick="app.handleAddTask()">Add task</button>
                </div>`

            }
            <table>
                <thead>
                    <th>#</th>
                    <th>Task name</th>
                    <th>Acction</th>
                </thead>
                <tbody>
                ${
                    app.completePage === false && (TODOS.length === 0 ||  TODOS.every((todo) => todo.completed === true))
                    ?
                    `<tr>
                        <td class = "notask" colspan="3">No task</td>
                    </tr>` 
                    :
                    `
                    ${
                       !app.completePage
                       ? 
                       TODOS.filter((todo)=>  todo.completed === false).map((todo, index) => {
                        return `<tr>
                            <td>${index + 1}</td>
                            <td class="task-name">
                                <span>${todo.name}</span>
                                <input class="modal-update__name-task" type="text" placeholder="Enter task name">
                            </td>
                            <td class="task-acction">
                                <i class="fa-solid fa-square-check btn-check" onclick="app.handleSubmitUpdate('${todo.id}')"></i>
                                <i class="fa-regular fa-pen-to-square btn-modify" onclick="app.handleUpdateTask()"></i>
                                <i class="fa-solid fa-trash btn-delete" onclick="app.handleDeleteTask('${todo.id}')"></i>
                                <input type="checkbox" class="checkbox-input btn-complete" onclick="app.handleCompleteTask('${todo.id}')">
                            </td>
                            </tr>
                        
                        `            
                       } ).join("") 
                       :

                       app.completePage === true && (TODOS.every((todo) => todo.completed === false))
                       ?
                       `<tr>
                           <td class = "notask" colspan="3">No task</td>
                       </tr>` 
                       :
                       TODOS.filter((todo)=>  todo.completed === true).map((todo, index) => {
                        return `<tr>
                            <td>${index + 1}</td>
                            <td class="task-name">
                                <span>${todo.name}</span>
                                <input class="modal-update__name-task" type="text" placeholder="Enter task name">
                            </td>
                            <td class="task-acction">
                            <i class="fa-solid fa-square-check btn-check" onclick="app.handleSubmitUpdate('${todo.id}')"></i>
                            <i class="fa-regular fa-pen-to-square btn-modify" onclick="app.handleUpdateTask()"></i>
                            <i class="fa-solid fa-trash btn-delete" onclick="app.handleDeleteTask('${todo.id}')"></i>
                            <input type="checkbox" checked class="checkbox-input btn-complete" onclick="app.handleUnCompleteTask('${todo.id}')">
                        </td>
                            </tr>
                        
                        `            
                       } ).join("") 
                    }
                    `
                }
                </tbody>
            </table>
        
        `
      containerContent.innerHTML = html
      footer.innerHTML = htmls`
        <button onclick="app.handlePageComplete()">${!app.completePage?"Task completed ": "Task pending"}</button>        
      `
    }
    ,
    start: function(){
        this.render();
    }


}

app.start()
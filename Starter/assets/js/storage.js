function addToDatabase(newTask){
    let listOfTasks;
    if(localStorage.getItem("tasks") == null){
        listOfTasks = [];
    }else{
        listOfTasks = JSON.parse(localStorage.getItem("tasks"));
    }
    listOfTasks.push(newTask);
    localStorage.setItem("tasks",JSON.stringify(listOfTasks));
}

function loadFromDB(){
    let listOfTasks;
    if(localStorage.getItem("tasks") == null){
        listOfTasks = [];
    }else{
        listOfTasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return listOfTasks;
}

// Clear from Local Storage 
function clearAllTasksfromDB() 
{
    localStorage.clear();
}

// Remove Task function definition 
function removeFromDB(taskItem) {
    let taskList;
   
    if(localStorage.getItem("tasks") == null){
        taskList = [];
    }else{
        taskList = JSON.parse(localStorage.getItem("tasks"));
    }
    taskList.forEach( function(task, index){
            if (taskItem.textContent.trim() === task.trim()){
                taskList.splice(index, 1);
            }
                
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));

 }
 
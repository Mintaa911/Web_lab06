// Define UI Variables 
const taskInput = document.querySelector('#task'); //the task input text field
const form = document.querySelector('#task-form'); //The form at the top
const filter = document.querySelector('#filter'); //the task filter text field
const taskList = document.querySelector('.collection'); //The UL
const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 



let DB;

document.addEventListener("DOMContentLoaded",()=>{
    let taskDB;
    let taskArray = [];
    taskDB = indexedDB.open("task",1);
    taskDB.onsuccess = function(){
        console.log("indexedDB ready");
        DB = taskDB.result;
        displayTaskList();
    }
    taskDB.onerror = function(){
        console.log("Some error occured!");
    }
    taskDB.onupgradeneeded = function(e){
        let db = e.target.result;
        let objectStore = db.createObjectStore("taskTable",{keyPath: 'id', autoIncrement: true});
        objectStore.createIndex("taskname","name",{unique:false});
        objectStore.createIndex("date","date",{unique:false});
        
    }


    form.addEventListener('submit',addNewTask);

    function addNewTask(e){
        e.preventDefault();

        let newTask = {
            name:taskInput.value,
            date:new Date()
        };

        let transaction = DB.transaction(['taskTable'],'readwrite');
        let objectStore = transaction.objectStore('taskTable');

        let request = objectStore.add(newTask);

        request.onerror = ()=>{console.log("There is some error!")};
        request.onsuccess = ()=>{form.reset()}
        transaction.oncomplete = ()=>{
            console.log("new task added");
            displayTaskList();
        }
    }

    function displayTaskList(){
        while(taskList.firstChild){
            taskList.removeChild(taskList.firstChild);
        }

        let objectStore = DB.transaction('taskTable').objectStore('taskTable');
        objectStore.openCursor().onsuccess = function(e){
            let cursor = e.target.result;
            if(cursor){
                const li = document.createElement('li');             // Create an li element when the user adds a task
                li.className = 'collection-item';       
                li.setAttribute('data-task-id',cursor.value.id)                                           // Adding a class
                li.appendChild(document.createTextNode(cursor.value.name));            // Create text node and append it 
                const link = document.createElement('a');                        // Create new element for the link 
                link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
                link.innerHTML = `<i class="fa fa-remove"></i>  &nbsp;<a href="../edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a> ;`;
                li.appendChild(link);                                                    // Append link to li
                taskList.appendChild(li);  
                
                cursor.continue();
                
            }

        }
        
        
    }
   
    clearBtn.addEventListener('click', clearAllTasks);

    function clearAllTasks() {
       
        let transaction = DB.transaction("taskTable", "readwrite"); 
        let tasks = transaction.objectStore("taskTable");

       
        tasks.clear(); 
      
        displayTaskList();

        console.log("Tasks Cleared !!!");
    }
  
     taskList.addEventListener('click', removeTask);

     function removeTask(e) {
 
         if (e.target.parentElement.classList.contains('delete-item')) {
             if (confirm('Are You Sure about that ?')) {
                 
                 let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                 // use a transaction
                 let transaction = DB.transaction(['taskTable'], 'readwrite');
                 let objectStore = transaction.objectStore('taskTable');
                 objectStore.delete(taskID);
 
                 transaction.oncomplete = () => {
                     e.target.parentElement.parentElement.remove();
                 }
 
             }
         }
     }

    const sortBtn = document.querySelector('.dropdown-trigger');  
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, sortBtn);

    const sortContent = document.querySelectorAll('.option');
    let ascending = sortContent[0];
    let dscending = sortContent[1];

    ascending.addEventListener('click',ascend);
    dscending.addEventListener('click',dscend);

    function ascend(){
        let index = 0;
        let objectStore = DB.transaction('taskTable').objectStore('taskTable');
        objectStore.openCursor().onsuccess = function(e){
            let cursor = e.target.result;
            if(cursor){
                taskArray[index] = cursor.value;
                index++;
                cursor.continue();
            }
        }
        
        taskArray.sort(function(a,b){return a.name - b.name});
        taskList.innerHTML ="";
        for (let i = 0; i < taskArray.length; i++) {
            
            const li = document.createElement('li');             // Create an li element when the user adds a task
            li.className = 'collection-item';       
            li.setAttribute('data-task-id',taskArray[i].id)                                           // Adding a class
            li.appendChild(document.createTextNode(taskArray[i].name));            // Create text node and append it 
            const link = document.createElement('a');                        // Create new element for the link 
            link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
            link.innerHTML = '<i class="fa fa-remove"></i>  &nbsp;<a href="../edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a> ;';
            li.appendChild(link);                                                       // Append link to li
            taskList.appendChild(li); 
        }

    }
    function dscend(){
        let index = 0;
        let objectStore = DB.transaction('taskTable').objectStore('taskTable');
        objectStore.openCursor().onsuccess = function(e){
            let cursor = e.target.result;
            if(cursor){
                taskArray[index] = cursor.value;
                index++;
                cursor.continue();
            }
        }
        taskArray.sort(function(a,b){return b.name - a.name});
        
       

        taskList.innerHTML ="";
        
        for (let i = 0; i < taskArray.length; i++) {
            
            const li = document.createElement('li');             // Create an li element when the user adds a task
            li.className = 'collection-item';       
            li.setAttribute('data-task-id',taskArray[i].id)                                           // Adding a class
            li.appendChild(document.createTextNode(taskArray[i].name));            // Create text node and append it 
            const link = document.createElement('a');                        // Create new element for the link 
            link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
            link.innerHTML = '<i class="fa fa-remove"></i>  &nbsp;<a href="../edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a> ;';
            li.appendChild(link);                                                       // Append link to li
            taskList.appendChild(li); 
        }
    }

   

});






// document.addEventListener("DOMContentLoaded",loadTaskFromDB);
// form.addEventListener('submit',addNewTask);
// taskInput.addEventListener("click",()=>{
//     taskInput.style.borderColor = 'black';
// })

// taskList.addEventListener('click',removeTask);
// clearBtn.addEventListener('click',clearStack);

// function addNewTask(e) {
    
//     e.preventDefault();
//     if(taskInput.value === ""){
//         taskInput.style.borderColor = "red";
//         return
//     }else{
//         addToDatabase(taskInput.value);
//     }
    
    
// }
// function loadTaskFromDB(){
//     let listofTasks = loadFromDB();

//     if (listofTasks.length != 0) {
       
//         listofTasks.forEach(function(eachTask) {

//           const li = document.createElement('li');             // Create an li element when the user adds a task
//           li.className = 'collection-item';                                                  // Adding a class
//           li.appendChild(document.createTextNode(eachTask));            // Create text node and append it 
//           const link = document.createElement('a');                        // Create new element for the link 
//           link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
//           link.innerHTML = '<i class="fa fa-remove"> </i>';
//           li.appendChild(link);                                                    // Append link to li
//           taskList.appendChild(li);                                            // Append to UL 
//         });
//     }

// }

// function removeTask(e){
    
//     if(e.target.parentElement.classList.contains('delete-item')){
//         console.log("clicked");
//         if(confirm("Are you sure?")){
//             e.target.parentElement.parentElement.remove();
//             removeFromDB(e.target.parentElement.parentElement);
//         }
//     }
// }

// function clearStack(){
//     clearAllTasksfromDB();
// }































// // Add Event Listener  [Form , clearBtn and filter search input ]

// // form submit 
// form.addEventListener('submit', addNewTask);
// // Clear All Tasks
// clearBtn.addEventListener('click', clearAllTasks);
// //   Filter Task 
// filter.addEventListener('keyup', filterTasks);
// // Remove task event [event delegation]
// taskList.addEventListener('click', removeTask);
// // Event Listener for reload 
// reloadIcon.addEventListener('click', reloadPage);

// document.addEventListener('DOMContentLoaded',loadTaskFromDB)



// // Add New  Task Function definition 
// function addNewTask(e) {

//     e.preventDefault(); //disable form submission


//     // Check empty entry
//     if (taskInput.value === '') {
//         taskInput.style.borderColor = "red";

//         return;
//     }

//     // Create an li element when the user adds a task 
//     const li = document.createElement('li');
//     // Adding a class
//     li.className = 'collection-item';
//     // Create text node and append it 
//     li.appendChild(document.createTextNode(taskInput.value));
//     // Create new element for the link 
//     const link = document.createElement('a');
//     // Add class and the x marker for a 
//     link.className = 'delete-item secondary-content';
//     link.innerHTML = '<i class="fa fa-remove"></i>';
//     // Append link to li
//     li.appendChild(link);
//     // Append to UL 
//     taskList.appendChild(li);
//     addToDatabase(taskList);



// }





// // Clear Task Function definition 
// function clearAllTasks() {

//     //This is the first way 
//     // taskList.innerHTML = '';

//     //  Second Wy 
//     while (taskList.firstChild) {
//         taskList.removeChild(taskList.firstChild);
//     }
//     clearAllTasksfromDB();

// }



// // Filter tasks function definition 
// function filterTasks(e) {

//     /*  
//     Instruction for Handling the Search/filter 
    
//     1. Receive the user input from the text input 
//     2. Assign it to a variable so the us can reuse it 
//     3. Use the querySelectorAll() in order to get the collection of li which have  .collection-item class 
//     4. Iterate over the collection item Node List using forEach
//     5. On each element check if the textContent of the li contains the text from User Input  [can use indexOf]
//     6 . If it contains , change the display content of the element as block , else none
    
    
//     */

// }

// // Remove Task function definition 
// function removeTask(e) {
//     if (e.target.parentElement.classList.contains('delete-item')) {
//         if (confirm('Are You Sure about that ?')) {
//             e.target.parentElement.parentElement.remove();
//             removeFromDB(e.target.parentElement.parentElement);
//         }

//     }
// }


// // Reload Page Function 
// function reloadPage() {
//     //using the reload fun on location object 
//     location.reload();
// }


// function loadTasksfromDB()
// {
//     let listofTasks = loadfromDB();
//     if (listofTasks.length != 0) {

//         listofTasks.forEach(function(eachTask) {

//           const li = document.createElement('li');             // Create an li element when the user adds a task
//           li.className = 'collection-item';                                                  // Adding a class
//           li.appendChild(document.createTextNode(eachTask));            // Create text node and append it 
//           const link = document.createElement('a');                        // Create new element for the link 
//           link.className = 'delete-item secondary-content';          // Add class and the x marker for a 
//           link.innerHTML = '<i class="fa fa-remove"> </i>';
//           li.appendChild(link);                                                    // Append link to li
//           taskList.appendChild(li);                                            // Append to UL 
//         });
//     }



// }

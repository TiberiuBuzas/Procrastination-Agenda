const addBtn = document.getElementById("addBtn"); 
const ulList = document.getElementById("ulList");
const deleteBtns = document.querySelectorAll(".trashIcon");

addBtn.addEventListener("click", ()=>{
    const inputTodoElement = document.getElementById("inputTodo");

    if(inputTodoElement.value == null || inputTodoElement.value == "" || inputTodoElement.value == undefined){

        inputTodoElement.placeholder = "Please insert some text...";
        inputTodoElement.classList.add("insertTextAlert");
        setTimeout(() => inputTodoElement.classList.remove("insertTextAlert") , 1000);

    } else {
        addToLocalStorage(createLiElement(Date.now(), inputTodoElement.value));
    }
    inputTodoElement.value = "";
})

function createLiElement(pID, pText, pChecked = false, preventAnimation = false){

    const liElement = document.createElement("li");
    liElement.setAttribute("id", pID);
    
    const inputCheckboxElement = document.createElement("input");
    inputCheckboxElement.type = "checkbox";

    let pElement = document.createElement("p");
    pElement.innerText = pText

    let trashIcon = document.createElement("i");
    trashIcon.classList.add("trashIcon", "fa-solid", "fa-trash-can");

    liElement.appendChild(inputCheckboxElement);
    liElement.appendChild(pElement);
    liElement.appendChild(trashIcon);

    ulList.appendChild(liElement);

    // Transform every word from the p element into a span, so that the line through animation works on multiple line phrases.
    pElement.innerHTML = pElement.textContent.split(' ').map(word => `<span>${word} </span>`).join('');

    if(pChecked){
        inputCheckboxElement.checked = pChecked;
        let spans = pElement.querySelectorAll("span");

        if(!preventAnimation){
            let currentIndex = 0;
            const setAnimation = () => {
                if(currentIndex < spans.length) {
                    let currentSpan = spans[currentIndex]
                    currentSpan.classList.add("lineThrough");
                    currentSpan.addEventListener("animationend", ()=>{
                        currentIndex++;
                        setAnimation();
                    });
                }
            };
            setAnimation();
        } else {
            spans.forEach((span) => {
                span.classList.add("lineThrough");
            })
        }
    }

    // Start the lineThrough animation for li elements from local storage when checkbox is clicked
    inputCheckboxElement.addEventListener("change", (e)=>{
        let spans = pElement.querySelectorAll("span");
    
        if(e.target.checked == true){
            let currentIndex = 0;
            
            const setAnimation = () => {
                if(currentIndex < spans.length) {
                    let currentSpan = spans[currentIndex]
                    currentSpan.classList.add("lineThrough");
    
                    currentSpan.addEventListener("animationend", ()=>{
                        currentIndex++;
                        setAnimation();
                    });
                }
            }
            
            setAnimation();
        } else {
            spans.forEach((span) => {
                span.classList.remove("lineThrough");
            })
        }

        updateCheckedLocalStorage(pID, e.target.checked);
    })

    trashIcon.addEventListener("click", (e)=> {
        let parentLiElement = e.target.parentElement;

        removeFromLocalStorage(parentLiElement.id);
        parentLiElement.remove();
    });


    let liObject = {
        id: pID,
        text: pText,
        checked: pChecked
    }

    return liObject;
}

function updateCheckedLocalStorage(pID, pCheckStatus){
    let localStorageItems = JSON.parse(localStorage.getItem("liElements")) || [];
    

    if(localStorageItems.length != 0){
        localStorageItems.forEach((e)=>{
            if(e.id == pID){
                e.checked = pCheckStatus;
            }
        })

        localStorage.setItem("liElements", JSON.stringify(localStorageItems));   
    }
}

function addToLocalStorage(pLiObject){
    let localStorageItems = JSON.parse(localStorage.getItem("liElements")) || [];
    localStorageItems.push(pLiObject);
    
    localStorage.setItem("liElements", JSON.stringify(localStorageItems));
}

function removeFromLocalStorage(pID){
    let localStorageItems = JSON.parse(localStorage.getItem("liElements")) || [];

    if(localStorageItems.length != 0){
        let newArray = localStorageItems.filter((liElement)=>{
            return liElement.id != pID;
        });
    
        localStorage.setItem("liElements", JSON.stringify(newArray));
    }
}

function loadLiElementsFromLocalStorage(){
    let savedLiElements = JSON.parse(localStorage.getItem("liElements")) || [];

    savedLiElements.forEach((e)=>{
        createLiElement(e.id, e.text, e.checked, true);
    })
}

window.addEventListener("DOMContentLoaded",()=>{ 
    loadLiElementsFromLocalStorage();
});

const waveAnimations = [
    KUTE.fromTo('#wave21', { path: '#wave21' }, { path: '#wave11' }, { repeat: Infinity, duration: 3000, yoyo: true, easing: 'easingCubicInOut' }),
    KUTE.fromTo('#wave22', { path: '#wave22' }, { path: '#wave12' }, { repeat: Infinity, duration: 3000, yoyo: true, easing: 'easingCubicInOut' }),
    KUTE.fromTo('#wave23', { path: '#wave23' }, { path: '#wave13' }, { repeat: Infinity, duration: 3000, yoyo: true, easing: 'easingCubicInOut' }),
    KUTE.fromTo('#wave24', { path: '#wave24' }, { path: '#wave14' }, { repeat: Infinity, duration: 3000, yoyo: true, easing: 'easingCubicInOut' }),
    KUTE.fromTo('#wave25', { path: '#wave25' }, { path: '#wave15' }, { repeat: Infinity, duration: 3000, yoyo: true, easing: 'easingCubicInOut' })
];

waveAnimations.forEach(animation => animation.start());

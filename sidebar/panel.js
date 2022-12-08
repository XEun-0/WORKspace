class Project {
    name;
    notes = "";
    links = {};

    constructor(name) {
        this.name = name;
    }
    getLinks() {
        return this.links;
    }
    addLink(title, link) {
        this.links[title] = link;
    }

    SetLinks(linksArr) {
        for(let i = 0; i < linksArr; i++) {
            this.links.push(linksArr[i]);
        }
    }

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getNotes() {
        return this.notes;
    }
    setNotes(notes) {
        this.notes = notes;
    }
}

let myWindowId;
const cb_1 = document.querySelector("#content-notes");
const projectArray = [];
let currProject;

/*
Add Project on Click
 */

const addProject = document.querySelector("#project-add");
const projName = document.querySelector("#proj-name");
const dropdown = document.querySelector("#project-list");
const plusLink = document.querySelector("#add-link");
const linkName = document.querySelector("#link-name");

addProject.addEventListener("click", addProj);
plusLink.addEventListener("click", addLink);
dropdown.addEventListener("change", displayFromStorage);

async function addProj() {
    if (projName.value.replace(/\s+/g, '') != "") {
        //console.log("addProj()"); //DEBUG
        projectArray.push(new Project(projName.value));
        saveProjectArray();
        await loadFromStorage();
        projName.value = "";
    }
}

async function addLink() {
    if (projectArray.length > 0) {
        document.querySelector("#no-links").innerHTML = "";
        listOfLinks = projectArray[dropdown.selectedIndex - 1].links;
        //console.log(projectArray[dropdown.selectedIndex].name);
        browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
            let tab = tabs[0]; // Safe to assume there will only be one result
            if(linkName.value.replace(/\s+/g, '') != "") {
                listOfLinks[linkName.value] = tab.url;
                document.querySelector("#link-list").innerHTML += "<div><li><a href ='" + listOfLinks[linkName.value] + "' target=\"_blank\" rel=\"noopener noreferrer\">" + linkName.value + "</a></li>";
            }
        }, console.error)
    } else {
        document.querySelector("#no-links").innerHTML = "You have added no links yet! Create a project before you add links!";
    }
    
    saveProjectArray();
    
}

async function displayFromStorage() {
    cb_1.textContent = projectArray[dropdown.selectedIndex - 1].notes;
    listOfLinks = projectArray[dropdown.selectedIndex - 1].links;
    
    document.querySelector("#link-list").innerHTML = "";
    
    let keyNum = Object.keys(listOfLinks);
    if(keyNum != 0) {
        document.querySelector("#no-links").innerHTML = "";
        for(let i = 0; i < keyNum.length; i++) {
            document.querySelector("#link-list").innerHTML += "<div><li><a href ='" + listOfLinks[keyNum[i]] + "' target=\"_blank\" rel=\"noopener noreferrer\">" + keyNum[i] + "</a></li>";
        }
    } else {
        document.querySelector("#no-links").innerHTML = "You have added no links yet!";
    }
    //document.querySelector("#link-list").innerHTML += "<div><li><a href ='" + listOfLinks[i] + "' target=\"_blank\" rel=\"noopener noreferrer\">" + keyNum + "</a></li>";
    
    saveProjectArray();
}

async function loadFromStorage() {
    browser.storage.local.get("names").then((obj) => {
        //console.log("called loadFromStorage():"); //DEBUGGING
        let temp = obj["names"];
        projectArray.splice(0, projectArray.length);
        for(let i = 0; i < temp.length; i++) {
            //console.log(temp.length); //DEBUG
            let proj = new Project(temp[i]["name"]);
            proj.links = temp[i]["links"];
            proj.notes = temp[i]["notes"];
            projectArray.push(proj);
            //console.log("adding temp stuff"); //DEBUG
            //console.log(projectArray); //DEBUG
        }
        updateDropDown();
    }).catch((e) => {
        console.error(e.message);
    });
}

function saveProjectArray() {
    
    console.log(projectArray);
    let listOfNames = {};
    listOfNames["names"] = projectArray;
    browser.storage.local.set(listOfNames);
}

async function updateDropDown() {
    console.log("called updateDropDown(): ");
    console.log(projectArray);
    dropdown.innerHTML = "<option selected disabled>Select Project</option>";
    for (let i = 0; i < projectArray.length; i++) {
        let newOpt = new Option(projectArray[i].name, i.toString());
        dropdown.add(newOpt, undefined);
    }
}

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  cb_1.setAttribute("contenteditable", true);
  projectArray[dropdown.selectedIndex - 1].notes = cb_1.textContent;
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
    cb_1.setAttribute("contenteditable", false);

    if (projectArray > 0) {
        let nNotes = projectArray[dropdown.selectedIndex - 1].notes;
        nNotes = cb_1.textContent;
    }

    projectArray[dropdown.selectedIndex - 1].notes = cb_1.textContent;
});

/*
Update the sidebar's content.
*/
/*function updateContent() {
    let component = cb_1;
    let cName = component.id;

    browser.storage.local.get(cName).then((nameToLook) => {
          component.textContent = nameToLook[Object.keys(nameToLook)[0]];
    });

    //updateDropDown();
}*/

window.addEventListener("load", async (event) => {
    //console.log("page loaded"); //DEBUG
    await loadFromStorage();
})
/*
Update content when a new tab becomes active.
*/
//browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
//browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then(async () => {
    await loadFromStorage();
});
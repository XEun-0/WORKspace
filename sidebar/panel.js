class Project {

    name;
    notes = "";
    links = [];

    constructor(name) {
        this.name = name;
    }

    addLink(link) {
        links.push(link);
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
const cb_1 = document.querySelector("#content_1");
//const cb_2 = document.querySelector("#content_2");
//const cb_3 = document.querySelector("#content_3");
//const cb_4 = document.querySelector("#content_4");

const projectArray = [];


/*
Add Project on Click
 */

const addProject = document.querySelector("#add-project");
const projName = document.querySelector("#proj-name");
const dropdown = document.querySelector("#projects-list");
const plusLink = document.querySelector("#add-link");

addProject.addEventListener("click", addProj);
plusLink.addEventListener("click", addLink);

function addProj() {
    projectArray.push(new Project(projName.value));
    console.log(projectArray.length.toString());

    /*
    Update Dropdown
    */

    dropdown.innerHTML = "<option selected disabled>Select Project</option>";

    for (i = 0; i < projectArray.length; i++) {
        let newOpt = new Option(projectArray[i].getName(), i.toString());
        dropdown.add(newOpt, undefined);
    }
}

function addLink() {
    if (projectArray.length > 0) {

    } else {
        document.querySelector("#no-links").innerHTML = "You have added no links yet! Create a project before you add links!";
    }
}



/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  cb_1.setAttribute("contenteditable", true);
  //cb_2.setAttribute("contenteditable", true);
  //cb_3.setAttribute("contenteditable", true);
  //cb_4.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  cb_1.setAttribute("contenteditable", false);
  //cb_2.setAttribute("contenteditable", false);
  //cb_3.setAttribute("contenteditable", false);
  //cb_4.setAttribute("contenteditable", false);
  //browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
  let contentToStore = {};
  //contentToStore[tabs[0].url] = contentBox.textContent;
    let cName = cb_1.id;
    let tc = cb_1.textContent;
    console.log(tc);
    contentToStore[cName] = tc;

  console.log(contentToStore);
  browser.storage.local.set(contentToStore);
  //});
});

/*
Update the sidebar's content.
*/
function updateContent() {
    let component = cb_1;
    let cName = component.id;

    browser.storage.local.get(cName)
    .then((text) => {
        return text;
    })
    .then((nameToLook) => {
          component.textContent = nameToLook[Object.keys(nameToLook)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});
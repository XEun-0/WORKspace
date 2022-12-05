let myWindowId;
const cb_1 = document.querySelector("#content_1");
const cb_2 = document.querySelector("#content_2");
const cb_3 = document.querySelector("#content_3");
const cb_4 = document.querySelector("#content_4");
const cbArray = [
  cb_1, cb_2, cb_3, cb_4
];


/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  for(i = 0; i < cbArray.length; i++) {
    cbArray[i].setAttribute("contenteditable", true);
  }
  //cb_1.setAttribute("contenteditable", true);
  //cb_2.setAttribute("contenteditable", true);
  //cb_3.setAttribute("contenteditable", true);
  //cb_4.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  cb_1.setAttribute("contenteditable", false);
  cb_2.setAttribute("contenteditable", false);
  cb_3.setAttribute("contenteditable", false);
  cb_4.setAttribute("contenteditable", false);
  //browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
  let contentToStore = {};
  //contentToStore[tabs[0].url] = contentBox.textContent;
  for(i = 0; i < cbArray.length; i++) {
    let cName = cbArray[i].id;
    let tc = cbArray[i].textContent;
    console.log(tc);
    contentToStore[cName] = tc;
  }
  console.log(contentToStore);
  browser.storage.local.set(contentToStore);
  //});
});

/*
Update the sidebar's content.
*/
function updateContent() {
  for(i = 0; i < cbArray.length; i++) {
    let component = cbArray[i];
    let cName = component.id;

    browser.storage.local.get(cName)
    .then((text) => {
        return text;
    })
    .then((nameToLook) => {
          component.textContent = nameToLook[Object.keys(nameToLook)[0]];
    });
  }
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
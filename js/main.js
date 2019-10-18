import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db = prodb("Productdb", {
    products: `++id, name, media, notes`
  });
  
  // input tags
  const userid = document.getElementById("userid");
  const proname = document.getElementById("proname");
  const mediatype = document.getElementById("mediatype");
  const notes = document.getElementById("notes");
  
  // create button
  const btncreate = document.getElementById("btn-create");
  const btnread = document.getElementById("btn-read");
  const btnupdate = document.getElementById("btn-update");
  const btndelete = document.getElementById("btn-delete");
  
  // user data
  
  // event listerner for create button
  btncreate.onclick = event => {
    // insert values
    let flag = bulkcreate(db.products, {
      name: proname.value,
      media: mediatype.value,
      notes: notes.value
    });
    // reset textbox values
    //proname.value = "";
    //seller.value = "";
    // price.value = "";
    proname.value = mediatype.value = notes.value = "";
  
    // set id textbox value
    getData(db.products, data => {
      userid.value = data.id + 1 || 1;
    });

    //update data table upon creation of new record
    table();
  
    // show the appropriate message for the correct insert result
    let insertmsg = document.querySelector(".insertmsg");
    // if there is a flag, will insert movedown
    getMsg(flag, insertmsg);
  };
  
  // event listerner for create button
  btnread.onclick = table;
  
  // button update
  btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
        // Dexie update method - call on database
      // Dexie's update method takes two params: id of record to update and 
      // values that should be updated
      db.products.update(id, {
        name: proname.value,
        media: mediatype.value,
        notes: notes.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        // display message, reference proper html tag
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        // set textbox value to none/empty
        proname.value = mediatype.value = notes.value = "";
        //console.log(get);
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete.onclick = () => {
    db.delete();
    db = prodb("Productdb", {
      products: `++id, name, media, notes`
    });
    db.open();
    table();
    textID(userid);
    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  // applies to the window when it is loaded
  window.onload = event => {
    // set id textbox value
    textID(userid);
  };
  
  
  
  
  // create dynamic table
  function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remove all childs from current data instance first
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }
  
  
    getData(db.products, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
            });
          }
          // Only create one edit/delete button
          createEle("td", tr, td => {
              // manage the i tag, add fontawesome classes
            createEle("i", td, i => {
              i.className += "fas fa-edit btnedit";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = editbtn;
            });
          })
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-trash-alt btndelete";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = deletebtn;
            });
          })
        });
      } else {
        notfound.textContent = "No record found in the database...!";
      }
  
    });
  }
  
  const editbtn = (event) => {
    // convert the id attribute to an integer
    let id = parseInt(event.target.dataset.id);
    // for a given ID in the dataset
    db.products.get(id, function (data) {
      let newdata = SortObj(data);
      userid.value = newdata.id || 0;
      proname.value = newdata.name || "";
      mediatype.value = newdata.media || "";
      notes.value = newdata.notes || "";
    });
  }
  
  // delete icon remove element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
  }
  
  // Gets the current ID and increments it
  function textID(textboxid) {
    getData(db.products, data => {
      textboxid.value = data.id + 1 || 1;
    });
  }
  
  // function msg
  function getMsg(flag, element) {
      // if true - if there is a value in the flag
    if (flag) {
      // set movedown class for the current element
      element.className += " movedown";
  
        // controls time of display
      setTimeout(() => {
          // get movedown - if the class is movedown, remove it
        element.classList.forEach(classname => {
          classname == "movedown" ? undefined : element.classList.remove('movedown');
        })
        // 4000 refers to miliseconds
      }, 4000);
    }
  }
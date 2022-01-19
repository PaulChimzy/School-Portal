const getStateList = async () => {
  let stateResponse = await fetch("/static/states-locagov.json");
  let stateList = await stateResponse.json();
  stateList.forEach((element) => {
    var newOption = document.createElement("option");
    var newOptionText = document.createTextNode(element["state"]);
    newOption.appendChild(newOptionText);
    let newCloneOption = newOption.cloneNode(true);
    document.getElementById("state").appendChild(newCloneOption);
    document.getElementById("state_of_origin").appendChild(newOption);
  });
  return stateList;
};

window.onload = async function () {
  document
    .getElementsByClassName("toggle-button")[0] //Listens for click event on the toggle-buttton for opening the side navigation pane on small screen devices
    .addEventListener("click", function () {
      document.querySelector("body").style.overflowY = "hidden"; //Ensures the body is not scrollable when the side navigation is open
      this.classList.add("open"); //Transforms the toggle button icon to a close button
      document.getElementsByClassName("sideNav")[0].classList.add("change"); //Adds class "Change" to the side Navigation pane which causes it to slide out.
      document.getElementsByClassName("bodyCover").style.visibility = "visible";
    });

  document
    .getElementsByClassName("closeMarker")[0]
    .addEventListener("click", function () {
      //Closes the side Navigation pane
      this.classList.remove("open");
      document.getElementsByClassName("sideNav")[0].classList.remove("change");
      document.querySelector("body").style.overflowY = "visible";
      document.getElementsByClassName("bodyCover").style.visibility = "hidden";
    });

  const statesList = await getStateList();

  document
    .getElementById("state_of_origin")
    .addEventListener("change", function () {
      var selectedState = this.value;
      var selectedStateIndex = statesList
        .map((element) => {
          return element.state;
        })
        .indexOf(selectedState);
      let localGovermentList = statesList[selectedStateIndex]["local"];
      localGovermentList.forEach((element) => {
        var newOption = document.createElement("option");
        var newOptionText = document.createTextNode(element);
        newOption.appendChild(newOptionText);
        document.getElementById("local_government").appendChild(newOption);
      });
    });

  //document.getElementById("myModal").modal("show"); //Causes the modal box to show

  /*$.getJSON("/static/states-locagov.json", function (data) {
    // Loads the required JSON file for states and local government
    for (let i = 0; i < data.length; i++) {
      var newOption = $("<Option></option>").text(data[i]["state"]);
      newOption.attr("value", data[i]["state"]);

      $(newOption).appendTo("#state_of_origin, #state"); //For each option, appends to both the "State of origin" & "State" Select tag
    }

    $("#state_of_origin").on("change", function () {
      // Listens to changes in the "Selesct-state of origin" tag and dynamically loads the options for local-government select tag
      let selectedStateIndex = data
        .map(function (e) {
          return e.state;
        })
        .indexOf($(this).val()); //Returns the index of selected state
      for (let i = 0; i < data[selectedStateIndex]["local"].length; i++) {
        //Loads the local-goverment dropdown list based on selected state
        var newOption = $("<Option></option>").text(
          data[selectedStateIndex]["local"][i]
        );
        newOption.attr("value", data[selectedStateIndex]["local"][i]);

        $(newOption).appendTo("#local_government"); //Appends each new option for the selected state to the local goverment; Thsi has been defined in the "lgaList" object for each state
      }
    });
  });*/

  $("#fullName").on("keyup", function () {
    /* This is a searchbar that searches for names on the table based on the current input value*/ $(
      "#jambScore"
    ).val("");
    $("#AdmissionStatus").prop("selectedIndex", 0);
    $("#searchGender").prop("selectedIndex", 0); //CLears other input fields while searching in this field

    var value = $(this).val().toLowerCase(); //Listens to a keyUp event on the search bar,collects the current input and converts to lower case

    $("tbody tr").each(function () {
      $(this).toggle(
        $(this).children("td").eq(1).text().toLowerCase().indexOf(value) > -1
      ); //It searches the first colomn (Name column) each row to see if it contains the/matches this input value
    });
  });

  $("#jambScore").on("keyup", function () {
    //Does same thing as descrbed above but this time for the Jamb score search bar; refer to the HTML Markup for clarity.
    $("#fullName").val("");
    $("#AdmissionStatus").prop("selectedIndex", 0);
    $("#searchGender").prop("selectedIndex", 0);
    var value = $(this).val();

    $("tbody tr").each(function () {
      $(this).toggle($(this).children("td").eq(3).text().indexOf(value) > -1);
    });
  });

  $("#AdmissionStatus").on("change", function () {
    //Does same as above but this time listens to a change in the admission status "select" tag

    $("#fullName").val("");
    $("#jambScore").val("");
    $("#searchGender").prop("selectedIndex", 0);
    var value = $(this).val();

    $("tbody tr").each(function () {
      $(this).toggle($(this).children("td").eq(4).text().indexOf(value) > -1);
    });
  });

  $("#searchGender").on("change", function () {
    //Does same as above but this time listens to a change in gender value "select" tag

    $("#fullName").val("");
    $("#jambScore").val("");
    $("#AdmissionStatus").prop("selectedIndex", 0);
    var value = $(this).val();

    $("tbody tr").each(function () {
      $(this).toggle($(this).children("td").eq(2).text().indexOf(value) > -1);
    });
  });
};

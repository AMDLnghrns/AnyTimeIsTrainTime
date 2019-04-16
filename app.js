//=======================================================
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBoiNU-J4qX45NGQhZZMdcNDU571-bys3c",
  authDomain: "test-e3362.firebaseapp.com",
  databaseURL: "https://test-e3362.firebaseio.com",
  projectId: "test-e3362",
  storageBucket: "test-e3362.appspot.com",
  messagingSenderId: "886122661865"
};
firebase.initializeApp(config);

var database = firebase.database();
//=======================================================

$("#submit").click(function(event) {
  event.preventDefault();
  let employee = $("#emp-name").val(); //train name
  let role = $("#emp-role").val(); //destination
  let month = $("#emp-stmonth").val(); //first train time
  let year = $("#emp-styear").val(); //frequency

  database.ref().push({
    employee: employee,
    role: role,
    year: year,
    month: month
  });
});

database.ref().on("child_added",function(snapshot) {
    let months = moment(snapshot.val().month,"hh:mm:ss").format("hh:mm");
    let today = moment().format("hh:mm");
    let frequency = snapshot.val().year;
    let difference = moment(today,"hh:mm:ss").add(frequency,"minute").format("hh:mm");
    let startTime = moment.utc(months,"hh:mm");
    let endTime = moment.utc(today,"hh:mm");

    let timeDifference = ((moment.duration(endTime.diff(startTime))/1000)/60);
    let minutesAway = ((Math.ceil((timeDifference/frequency)))*frequency) - timeDifference;
    let trainTime = moment(startTime).add((Math.ceil((timeDifference/frequency))*frequency),"minutes").format("hh:mm");

    // console.log(months); //first train time
    // console.log(today); //current time
    // console.log(frequency); //how often the train comes
    // console.log(difference); //current time plus frequency
    // console.log(startTime); //first train time
    // console.log(endTime); //current time
    console.log(timeDifference); //total time since the first train
    console.log(minutesAway); //amount of time until the next train
    console.log(trainTime); //exact time of the next train arrival
    
    //the next arrival does not update automatically until minutes away until it is one minute away. 

    $("tbody").append(`
    <tr>
        <td id="employee-name">${snapshot.val().employee}</td>
        <td id="role">${snapshot.val().role}</td>
        <td id="monthly-rate">${snapshot.val().year}</td>
        <td id="start-date">${trainTime}</td>
        <td id="new-time">${minutesAway}</td>
        <hr>
    </tr>
  `);
  },

  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

const events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

buildDD();

// adds the city names to the dropdown
//driver function
function buildDD(){

    // grab the ul menu for the dropdown
    let eventDD = document.getElementById("eventDropDown");
    // clear out any li before adding
    eventDD.innerHTML = "";

    // grab a copy of the template 
    let ddItemTemplate = document.getElementById("cityDD-template");
    let ddItemNode = document.importNode(ddItemTemplate.content,true);
    let ddItem = ddItemNode.querySelector("a");
    ddItem.textContent = "All";
    ddItem.setAttribute("data-string", "All");
    eventDD.appendChild(ddItemNode);

    let currentEvents = getEventData();

    //return a distinct list of cities
    let distinctCities = [...new Set(currentEvents.map((e) => e.city))];

    for (let index = 0; index < distinctCities.length; index++) {
        let cityName = distinctCities[index];
        ddItemNode = document.importNode(ddItemTemplate.content,true);
        ddItem = ddItemNode.querySelector("a");
        ddItem.textContent = cityName;
        ddItem.setAttribute("data-string", cityName);
        eventDD.appendChild(ddItemNode);
    }

    displayStats(currentEvents);
    displayData(currentEvents);

}

//displays stats
function displayStats(currentEvents){

    let total = 0;
    let average = 0;
    let most = 0;
    let least = currentEvents[0].attendance;

    for (let index = 0; index < currentEvents.length; index++) {
        let attendance = currentEvents[index].attendance;
        // total attendance
        total += attendance;
        // most attendance
        if(most<attendance){
            most = attendance;
        }
        //least attended
        if(least>attendance || least < 0){
            least = attendance;
        }
       
    }
    //average attendance
    average = total/currentEvents.length;

    
    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString(
        "en-US",{
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );
}

// remember "this" is being pass which is an a tag
function getEvents(element){

    let city = element.getAttribute("data-string");
    
    document.getElementById("statsHeader").innerHTML = `Stats For ${city} Events`;

    let currentEvents = getEventData();

    //filter array by city name
    if(city != "All"){
        currentEvents = currentEvents.filter(
            function(event){
                if(event.city == city){
                    return event;
                }
        });
    }
    displayStats(currentEvents);
    displayData(currentEvents);
}

// gets event data
function getEventData(){

    let currentEvents = JSON.parse(localStorage.getItem("eventData"));

    if(currentEvents == null){
        currentEvents = events;
        localStorage.setItem("eventData",JSON.stringify(currentEvents));
    }

    return currentEvents;

}

//displays data
function displayData(currentEvents){
    let eventTemplate = document.getElementById("eventData-template");
    let eventBody = document.getElementById("eventBody");
    eventBody.innerHTML = "";

    for (let index = 0; index < currentEvents.length; index++) {
        
        let eventNode = document.importNode(eventTemplate.content, true);

        let eventItems = eventNode.querySelectorAll("td");

        eventItems[0].textContent = currentEvents[index].event;
        eventItems[1].textContent = currentEvents[index].city;
        eventItems[2].textContent = currentEvents[index].state;
        eventItems[3].textContent = currentEvents[index].attendance.toLocaleString();
        eventItems[4].textContent = new Date(currentEvents[index].date).toLocaleDateString();

        eventBody.appendChild(eventNode);
        
    }

}

function saveEventData(){
    let currentEvents = getEventData();

    let eventObj = {
        event: "",
        city: "",
        state: "",
        attendance: 0,
        date: "",
    };

    eventObj.event = document.getElementById("newEventName").value;
    eventObj.city = document.getElementById("newEventCity").value;

    let selectedState = document.getElementById("newEventState");
    eventObj.state = selectedState.options[selectedState.selectedIndex].text;

    let attendance = document.getElementById("newEventAttendance").value;
    attendance = parseInt(attendance);
    eventObj.attendance = attendance;

    let eventDate = document.getElementById("newEventDate").value;
    let formattedEventDate = `${eventDate} 00:00`;
    eventObj.date = new Date(formattedEventDate).toLocaleDateString();

    currentEvents.push(eventObj);

    localStorage.setItem("eventData", JSON.stringify(currentEvents));

    //reset page
    buildDD();
}
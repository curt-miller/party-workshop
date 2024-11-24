const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-FT/events`;

// === state ===

const state = {
  events: [],
};

console.log(state.events);

/** updates state with API data */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.events = json.data;
    console.log("updated state", state.events);
  } catch (error) {}
}

/** create a new event */
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    console.log("response status", response.status);

    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// === render ===
const eventList = document.querySelector("#events"); //gotta globally define this one

/** renders events from state */
function renderEvents() {

  if (!state.events.length) {
    eventList.innerHTML = "no events.";
    return;
  }

  const eventCards = state.events.map((event) => {
    const card = document.createElement("li");
    card.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.description}</p>
    <p>${event.date}</p>
    <p>${event.location}</p>
    <p><button  id="delete-button" data-id="${event.id}">Delete</button></p>
    `;
    return card;
  });
  eventList.replaceChildren(...eventCards);


}

/** syncs state with the API and rerender */
async function render() {
  await getEvents();
  renderEvents();
}

//delete button:

eventList.addEventListener("click", async (event) => {
    if (event.target.matches("#delete-button")) {
      const id = event.target.dataset.id;
      await deleteEvent(id);
      render();
    }
  });


async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("error deleting event", error);
  }
}

//submit form:
const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const eventInfo = {
    name: form.eventName.value,
    description: form.description.value,
    date: new Date(form.date.value).toISOString(),
    location: form.location.value,
  };

  form.reset();

  console.log(eventInfo);

  await addEvent(eventInfo);
  render();
});

render();


// THIS ONE WAS HARD, OK!?
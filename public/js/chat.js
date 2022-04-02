const socket = io();

// Elements
const $messageFrom = document.querySelector("#message-form");
const $messageFromInput = $messageFrom.querySelector("input");
const $messageFromButton = $messageFrom.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationMessageTemplate, {
    url,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageFrom.addEventListener("submit", (e) => {
  e.preventDefault();

  // disabled
  $messageFromButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    // remove disabled
    $messageFromButton.removeAttribute("disabled");
    $messageFromInput.value = "";
    $messageFromInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});

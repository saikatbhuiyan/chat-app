const socket = io();

// Elements
const $messageFrom = document.querySelector("#message-form");
const $messageFromInput = $messageFrom.querySelector("input");
const $messageFromButton = $messageFrom.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");

socket.on("message", (message) => {
  console.log(message);
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

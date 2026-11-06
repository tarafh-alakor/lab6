
const ACCESS_KEY = "pl57FlsFXYVW8AjEg009LUpLTiHYVn1Ig62YUIDqJKA";

const searchInput = document.getElementById("searchInput");
const imageContainer = document.getElementById("imageContainer");
const message = document.getElementById("message");

const xhrBtn = document.getElementById("xhrBtn");
const promiseBtn = document.getElementById("promiseBtn");
const asyncBtn = document.getElementById("asyncBtn");

function getURL() {
  const query = searchInput.value.trim();

  if (query === "") {
    message.textContent = "Please enter a search term.";
    return null;
  }

  imageContainer.innerHTML = "";
  message.textContent = "Loading images...";

  return "https://api.unsplash.com/search/photos?query="
    + encodeURIComponent(query) + "&per_page=12";
}

function displayImages(data) {
  imageContainer.innerHTML = "";

  if (data.results.length === 0) {
    message.textContent = "No images found.";
    return;
  }

  message.textContent = "";

  data.results.forEach(function(photo) {
    const card = document.createElement("div");
    card.className = "photo";

    const img = document.createElement("img");
    img.src = photo.urls.small;
    img.alt = photo.alt_description || "Unsplash photo";

    const photographer = document.createElement("p");
    photographer.textContent = "By " + photo.user.name;

    img.addEventListener("click", function() {
      window.open(photo.links.html, "_blank", "noopener");
    });

    card.appendChild(img);
    card.appendChild(photographer);
    imageContainer.appendChild(card);
  });
}

function searchXHR() {
  const url = getURL();
  if (!url) return;

  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", "Client-ID " + ACCESS_KEY);

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      displayImages(data);
    } else {
      message.textContent = "Error: " + xhr.status;
    }
  };

  xhr.onerror = function() {
    message.textContent = "Network error.";
  };

  xhr.send();
}

function searchPromises() {
  const url = getURL();
  if (!url) return;

  fetch(url, {
    headers: {
      Authorization: "Client-ID " + ACCESS_KEY
    }
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP Error: " + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    displayImages(data);
  })
  .catch(function(error) {
    message.textContent = error.message;
  });
}

async function searchAsync() {
  const url = getURL();
  if (!url) return;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Client-ID " + ACCESS_KEY
      }
    });

    if (!response.ok) {
      throw new Error("HTTP Error: " + response.status);
    }

    const data = await response.json();
    displayImages(data);

  } catch (error) {
    message.textContent = error.message;
  }
}

xhrBtn.addEventListener("click", searchXHR);
promiseBtn.addEventListener("click", searchPromises);
asyncBtn.addEventListener("click", searchAsync);


searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchAsync();
  }
});

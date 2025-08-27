const accessKey = "I556eWh-QjK6OV7GiCbzspIS6JAA-rB5wD0ZESvRZ74";

function searchImage() {
  const query = document.getElementById("searchInput").value;
  const container = document.getElementById("image-container");
  container.innerHTML = "Laddar bild...";

  fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";
      if (data.results.length > 0) {
        const image = document.createElement("img");
        image.src = data.results[0].urls.regular;
        image.alt = query;
        image.style.maxWidth = "100%";
        image.style.borderRadius = "8px";
        image.style.marginTop = "1rem";
        container.appendChild(image);

        const credit = document.createElement("p");
        credit.innerHTML = `Foto: ${data.results[0].user.name} / Unsplash`;
        container.appendChild(credit);
      } else {
        container.innerText = "Ingen bild hittades.";
      }
    })
    .catch(error => {
      container.innerText = "Något gick fel: " + error;
    });
}
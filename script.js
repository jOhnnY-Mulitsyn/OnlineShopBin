fetch("https://63e278a1109336b6cb089166.mockapi.io/items")
  .then((response) => {
    return response.json();
  })
  .then((result) => {
    result.forEach((obj) => {
      obj.checked = false;
    });
    renderItems(result);
  });

function renderItems(data) {
  let container = document.body.querySelector(".items.container");
  let selectAllHTML = document.querySelector(".visually-hidden");

  container.innerHTML = null;
  if (data.length === 0) {
    container.innerHTML = `<div class="basket-null" id="cart">
                              <img src="data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='64' height='64' rx='32' fill='%23EDEDED'/%3E%3Cpath d='M25.3334 45.3332C24.6 45.3332 23.9725 45.0723 23.4507 44.5505C22.928 44.0278 22.6667 43.3998 22.6667 42.6665C22.6667 41.9332 22.928 41.3052 23.4507 40.7825C23.9725 40.2607 24.6 39.9998 25.3334 39.9998C26.0667 39.9998 26.6943 40.2607 27.216 40.7825C27.7387 41.3052 28 41.9332 28 42.6665C28 43.3998 27.7387 44.0278 27.216 44.5505C26.6943 45.0723 26.0667 45.3332 25.3334 45.3332ZM38.6667 45.3332C37.9334 45.3332 37.3058 45.0723 36.784 44.5505C36.2614 44.0278 36 43.3998 36 42.6665C36 41.9332 36.2614 41.3052 36.784 40.7825C37.3058 40.2607 37.9334 39.9998 38.6667 39.9998C39.4 39.9998 40.028 40.2607 40.5507 40.7825C41.0725 41.3052 41.3334 41.9332 41.3334 42.6665C41.3334 43.3998 41.0725 44.0278 40.5507 44.5505C40.028 45.0723 39.4 45.3332 38.6667 45.3332ZM24.2 23.9998L27.4 30.6665H36.7334L40.4 23.9998H24.2ZM25.3334 38.6665C24.3334 38.6665 23.5778 38.2274 23.0667 37.3492C22.5556 36.4718 22.5334 35.5998 23 34.7332L24.8 31.4665L20 21.3332H18.6334C18.2556 21.3332 17.9445 21.2052 17.7 20.9492C17.4556 20.6941 17.3334 20.3776 17.3334 19.9998C17.3334 19.6221 17.4614 19.3052 17.7174 19.0492C17.9725 18.7941 18.2889 18.6665 18.6667 18.6665H20.8334C21.0778 18.6665 21.3112 18.7332 21.5334 18.8665C21.7556 18.9998 21.9223 19.1887 22.0334 19.4332L22.9334 21.3332H42.6C43.2 21.3332 43.6112 21.5554 43.8334 21.9998C44.0556 22.4443 44.0445 22.9109 43.8 23.3998L39.0667 31.9332C38.8223 32.3776 38.5 32.7221 38.1 32.9665C37.7 33.2109 37.2445 33.3332 36.7334 33.3332H26.8L25.3334 35.9998H40.0334C40.4111 35.9998 40.7223 36.1274 40.9667 36.3825C41.2112 36.6385 41.3334 36.9554 41.3334 37.3332C41.3334 37.7109 41.2054 38.0274 40.9494 38.2825C40.6943 38.5385 40.3778 38.6665 40 38.6665H25.3334Z' fill='%23777777'/%3E%3C/svg%3E">
                              <p style="color: #777777">Корзина пуста</p>
                            </div>`;
    selectAllHTML.disabled = true;
    selectAllHTML.checked = false;
    document.querySelector(".all").style.color = "#CCCCCC";
  }

  let htmlElements = data.map((obj) => {
    return `<div class="container">
        <div class="card" data-id=${obj.id}>
            <div class="cardimg-wrap">
                <img src= "./img/${obj.img}">
            </div>
            <div class="cardinfo">
                <label class="check-wrap">
                    <span class="name">${obj.name}</span>
                    <input class="visually-hidden checkbox" type="checkbox" data-mark${
                      obj.id
                    }>
                    <span class="visible-check card__visible-check"></span>
                </label>
                <span class="price">${obj.price.toLocaleString()} &#8381</span>
                <button class="btn btn--delete"></button>
            </div>
        </div>
    </div>`;
  });
  container.insertAdjacentHTML("beforeend", htmlElements.join(""));

  container.querySelectorAll(".visually-hidden").forEach((elem) => {
    elem.addEventListener("click", (event) => handleClick(event, data));
  });
  container.querySelectorAll(".btn--delete").forEach((elem) => {
    elem.addEventListener("click", (event) => deleteItem(event, data));
  });
  selectAllHTML.addEventListener("click", (event) => selectAll(event, data));

  markSelected(data);
  calcPriceAndCount(data);
  calcReports(data);
}

// =============================================== Подсчёты ===========================================
function calcPriceAndCount(data) {
  let priceHTML = document.querySelector(".sum-all");
  let countHTML = document.querySelector(".sum-request");

  let sum = 0;
  let count = 0;
  data.forEach((obj) => {
    if (obj.checked === true) {
      sum += obj.price;
      count++;
    }
  });

  priceHTML.innerHTML = sum.toLocaleString();
  countHTML.innerHTML = count;
  changeBtnState(data);
}

function calcReports(data) {
  let reportsHTML = document.querySelector(".sum-reports");
  let countReports = data.length;
  reportsHTML.innerHTML = countReports;
}

// ======================================== Checkbox ==================================
function handleClick(event, data) {
  let currentCard = event.target.closest(".card");

  data.map((obj) => {
    if (obj.id === currentCard.dataset.id) {
      obj.checked = !obj.checked;
    }
  });
  calcPriceAndCount(data);
}

function selectAll(event, data) {
  let itemsHTML = document.querySelectorAll(".card");
  let isChecked = event.target.checked;
  if (isChecked) {
    data.map((obj) => (obj.checked = true));
    itemsHTML.forEach((elem) => {
      elem.querySelector(".visually-hidden").checked = true;
    });
  } else {
    data.map((obj) => (obj.checked = false));
    itemsHTML.forEach((elem) => {
      elem.querySelector(".visually-hidden").checked = false;
    });
  }
  calcPriceAndCount(data);
}

function markSelected(data) {
  data.forEach((obj) => {
    if (obj.checked === true) {
      document.querySelector(`[data-mark${obj.id}]`).checked = true;
    }
  });
}

// ======================================= Удаление элементов =====================================
function deleteItem(event, data) {
  let id = event.target.closest(".card").dataset.id;
  let newArray = data.filter((elem) => elem.id !== id);
  renderItems(newArray);
}

// ====================================== Кнопка оформления заказа ==================================
function changeBtnState(data) {
  const btnActive = document.querySelector(".active");
  const btnUnactive = document.querySelector(".unactive-first");
  const btnUnactiveSecond = document.querySelector(".unactive-second");
  let count = 0;
  data.forEach((obj) => {
    if (obj.checked === true) count += 1;
  });

  if (data.length == 0) {
    btnUnactive.style.display = "block";
    btnActive.style.display = "none";
    btnUnactiveSecond.style.display = "none";
  } else if (count == 0) {
    btnUnactive.style.display = "none";
    btnActive.style.display = "none";
    btnUnactiveSecond.style.display = "block";
  } else {
    btnUnactive.style.display = "none";
    btnActive.style.display = "block";
    btnUnactiveSecond.style.display = "none";
  }
}

var milkData = JSON.parse(localStorage.getItem("milkData")) || {};
var priceData = JSON.parse(localStorage.getItem("priceData")) || {};
var currentDate = new Date();

function setPrice() {
  let id = `${currentDate.getFullYear()}_${currentDate.getMonth()}`;
  priceData[id] = document.getElementById("milkPrice").value;
  localStorage.setItem("priceData", JSON.stringify(priceData));
  calculateBill(currentDate.getFullYear(), currentDate.getMonth());
}

function generateCalendar(year, month) {
  let calendarDiv = document.getElementById("calendar");
  let date = new Date(year, month);
  let table = "<table>";
  document.getElementById(
    "currentMonth"
  ).innerHTML = `Showing data for ${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;
  let id = `${year}_${month}`;
  document.getElementById("milkPrice").value = priceData[id] || 0;
  while (date.getMonth() === month) {
    let id = `${year}_${month}_${date.getDate()}`;
    if (milkData[id] === undefined) {
      milkData[id] = 0;
    }
    table += `<tr><td class="${getClass(
      date
    )}">${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}</td><td><input id="${id}" type="number" value="${
      milkData[id]
    }" onchange="updateMilkData('${id}')" onfocus="updateInput('${id}')" ></td></tr>`;
    date.setDate(date.getDate() + 1);
  }
  table += "</table>";
  calendarDiv.innerHTML = table;
  calculateBill(year, month);
}

function getClass(date) {
  const now = new Date();
  return now.getDate() == date.getDate() &&
    now.getMonth() == date.getMonth() &&
    now.getFullYear() == date.getFullYear()
    ? "date-highlight"
    : "";
}

function updateInput(id) {
  const val = document.getElementById(id).value;
  if (val == 0 || val == "0") {
    document.getElementById(id).value = "";
  }
}

function updateMilkData(id) {
  milkData[id] = document.getElementById(id).value;
  localStorage.setItem("milkData", JSON.stringify(milkData));
  calculateBill(currentDate.getFullYear(), currentDate.getMonth());
}

function calculateBill(year, month) {
  let totalBill = 0;
  let id = `${year}_${month}`;
  let price = priceData[id] || 0;
  if (price == 0) {
    document.getElementById("warning").style.display = "block";
  } else {
    document.getElementById("warning").style.display = "none";
  }
  for (let i = 1; i <= 31; i++) {
    let id = `${year}_${month}_${i}`;
    if (milkData[id] !== undefined) {
      totalBill += +milkData[id];
    }
  }
  totalBill *= price;
  document.getElementById("totalBill").innerHTML = "Total Bill: ₹" + totalBill;
}

function prevMonth() {
  if (currentDate.getMonth() == 0) {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    currentDate.setMonth(11);
  } else {
    currentDate.setMonth(currentDate.getMonth() - 1);
  }
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

function nextMonth() {
  if (currentDate.getMonth() == 11) {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    currentDate.setMonth(0);
  } else {
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

if (window.navigator.userAgent.indexOf("iPhone") != -1) {
  if (window.navigator.standalone == true) {
  } else {
    document.getElementById("install-bar").style.display = "block";
  }
} else {
}

function shareOnWhatsApp(year, month) {
  let message = `Milk Tracker Data for ${new Date(year, month).toLocaleString(
    "default",
    { month: "long" }
  )} ${year}\n\n`;
  let totalBill = 0;
  let id = `${year}_${month}`;
  let price = priceData[id] || 0;

  message += `Date\t\tQuantity\n`;

  for (let i = 1; i <= 31; i++) {
    let id = `${year}_${month}_${i}`;
    if (milkData[id] !== undefined) {
      message += `\n${i}\t\t${milkData[id]}`;
      totalBill += +milkData[id];
    }
  }

  totalBill *= price;
  message += `\n\nTotal Bill: ₹${totalBill}\n\nGenerated via: https://tmilk.vercel.app`;

  // Encode the message and create a WhatsApp URL
  let whatsapp_url = "https://wa.me/?text=" + encodeURIComponent(message);

  // Open the URL in a new tab
  window.open(whatsapp_url, "_blank");
}

window.addEventListener("DOMContentLoaded", function () {
  const element = document.querySelector(".date-highlight + td input");
  if (element) {
    element.focus();
  }
});

window.setPrice = setPrice;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.updateInput = updateInput;
window.updateMilkData = updateMilkData;
window.shareOnWhatsApp = shareOnWhatsApp;
window.currentDate = currentDate;

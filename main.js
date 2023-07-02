import "./style.css";

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
    table += `<tr><td>${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}</td><td><input id="${id}" type="number" value="${
      milkData[id]
    }" onchange="updateMilkData('${id}')"></td></tr>`;
    date.setDate(date.getDate() + 1);
  }
  table += "</table>";
  calendarDiv.innerHTML = table;
  calculateBill(year, month);
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

if(window.navigator.userAgent.indexOf('iPhone') != -1){
  if(window.navigator.standalone == true){
    
  } else {
      document.getElementById('install-bar').style.display = 'block';
  }
} else {
  
}

function shareOnWhatsApp(year, month) {
  let message = `Milk Tracker Data for ${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}\n\n`;
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
  message += `\n\nTotal Bill: ₹${totalBill}`;

  // Encode the message and create a WhatsApp URL
  let whatsapp_url = "https://wa.me/?text=" + encodeURIComponent(message);

  // Open the URL in a new tab
  window.open(whatsapp_url, '_blank');
}

window.setPrice = setPrice;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.updateMilkData = updateMilkData;
window.shareOnWhatsApp = shareOnWhatsApp;
window.currentDate = currentDate;
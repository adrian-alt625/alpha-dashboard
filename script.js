///
const totalProfitHeading = document.querySelector("#total-profit");

function moveSlider(index) {
  const slider = document.querySelector(".slider");
  slider.style.transform = "translateX(" + index * 75 + "px)";
}

let rowsData;
let finalData;

async function readData() {
  const response = await fetch("data.csv");
  const dataText = await response.text();
  const rows = dataText.split("\n").map(
    (row) => row.replace("\r", "").split(",") // Remove \r from each row
  );

  rowsData = rows;
}

// can only use the data read from the CSV in here
readData().then(() => {
  let total = totalPercentage(rowsData);
  if (total.toString().length > 7) {
    total = total.toFixed(2); // removing unwanted numbers like +11.7199999999999%
    console.log(total);
  }
  totalProfitHeading.textContent = total + "%";
  if (totalPercentage(rowsData) >= 0) {
    totalProfitHeading.textContent = "+" + total + "%";
  }
});

function totalPercentage(arr) {
  let buyPriceArr = [];
  let sellPriceArr = [];
  arr.forEach((row) => {
    if (row[1] !== " buy-price") {
      let number = parseFloat(row[1].replace("$", "").trim());
      buyPriceArr.push(number);
    }
    if (row[2] !== " sell-price") {
      let number = parseFloat(row[2].replace("$", "").trim());
      sellPriceArr.push(number);
    }
  });

  let percentages = [];
  for (let i = 0; i < buyPriceArr.length; i++) {
    let num = (sellPriceArr[i] - buyPriceArr[i]) / buyPriceArr[i];
    num = num * 100;
    num = num.toFixed(2);
    percentages.push(num);
  }

  let total = Number(percentages[0]);
  for (let i = 1; i < percentages.length; i++) {
    total = total + Number(percentages[i]);
  }
  return total;
}

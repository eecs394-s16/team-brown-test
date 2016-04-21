console.log("Hello from app/example.js, I have window.parent.appgyver: ", window.parent.appgyver);

document.addEventListener("DOMContentLoaded", function() {
  var currentDay = moment();
  var dayElem = document.getElementById("current-day");
  var exampleDateElem = document.getElementById("example-date");

  /* Use the data-attribute defined by Composer 2.0 */
  var exampleDateFormat = window.frameElement.getAttribute('data-date-format');

  dayElem.innerText = currentDay.format("dddd");
  exampleDateElem.innerText = currentDay.format(exampleDateFormat);
});


function showDropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function selectProject() {
    console.log('PROJECT SELECTED!')
}

function generateNewPalette() {
  $('.color-container').each((index, element) => {
    let colorCode = getRandomColor()
    console.log(element)
    $(element).find('p').text(`rgb(${colorCode})`)
    $(element).css("background-color", `rgb(${colorCode})`)
  })
}

function getRandomColor(element) {
  let a, b, c;
  a = Math.floor(Math.random()*(256)+0);
  b = Math.floor(Math.random()*(256)+0);
  c = Math.floor(Math.random()*(256)+0);
  return `${a}, ${b}, ${c}`
}

function savePalette() {
  console.log('PALATE SAVED!')
}

function saveProject() {
  console.log('PROJECT SAVED!')
}



// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

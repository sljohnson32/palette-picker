
function showDropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function selectProject() {
    console.log('PROJECT SELECTED!')
}

function generateNewPalatte() {
  console.log('NEW PALATE!')
}

function savePalatte() {
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

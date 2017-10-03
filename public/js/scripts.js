$(document).ready(() => {
  generateNewPalette()
});

$('img').click((e) => {
  if ($(e.target).attr('class') == 'unlocked') {
    $(e.target).toggleClass('locked unlocked')
    $(e.target).attr('src', './imgs/locked.png')
  } else {
    $(e.target).toggleClass('locked unlocked')
    $(e.target).attr('src', './imgs/unlocked.png')
  }
})

const showDropDown = () => {
    document.getElementById("myDropdown").classList.toggle("show");
}

const selectProject = () => {
    console.log('PROJECT SELECTED!')
}

const generateNewPalette = () => {
  $('.color-container').each((index, element) => {
    if ($(element).find("img").hasClass('unlocked')) {
      let colorCode = getRandomColor()
      $(element).find('p').text(colorCode)
      $(element).css("background-color", colorCode)
    }
  })
}

const getRandomColor = () => {
  const chars = '0123456789ABCDEF'
    let colorCode = '#'
    for (let i = 0; i < 6; i++) {
        colorCode += chars[Math.floor(Math.random() * 16)]
    }
    return colorCode
}
//   let a, b, c;
//   a = Math.floor(Math.random()*(256)+0);
//   b = Math.floor(Math.random()*(256)+0);
//   c = Math.floor(Math.random()*(256)+0);
//   return `${a}, ${b}, ${c}`
// }

const savePalette = () => {
  console.log('PALATE SAVED!')
}

const saveProject = () => {
  console.log('PROJECT SAVED!')
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = (event) => {
  if (!event.target.matches('.dropbtn')) {

    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

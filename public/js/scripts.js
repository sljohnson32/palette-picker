$(document).ready(() => {
  generateNewPalette()
  populateProjects()
});

const projects = ['Project 1', 'Project 2', 'Project 3', 'Project 4']
const palettes = [
  { project: 'Project 1', colors: ['#3F856C', '#065A83', '#94AD42', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 1', colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 2', colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 3', colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 4', colors: ['#4A914E', '#E1930C', '#C54E51', '#2DAC4A', '#898117', '#8D2380'] }
]

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

const selectDropdownProject = () => {
    console.log('PROJECT DROPDOWN SELECTED!')
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

const savePalette = () => {
  console.log('PALATE SAVED!')
}

const saveProject = () => {
  console.log('PROJECT SAVED!')
}

const selectProject = () => {
  console.log('PROJECT SELECTED!')
}

const populateProjects = () => {
  projects.forEach(project => {
    let listHTML = `<a onclick="selectDropdownProject()">${project}</a>`;
    let projectHTML = getProjectHTML(project);
    $('#myDropdown').append(listHTML);
    $('.saved-palette-container').append(projectHTML)
  })
  populateProjectPalettes()
}

const getProjectHTML = (project) => {
  let html = `<div class='project-container' onclick='selectProject()'>
                <h2>${project}</h2>
                <div class=${project}>
                </div>
              </div>`;
  return html;
}

const populateProjectPalettes = () => {
  console.log("Populating Saved Palettes")
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

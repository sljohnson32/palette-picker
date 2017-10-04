$(document).ready(() => {
  generateNewPalette()
  populateProjects()
});

const projects = ['Project 1', 'Project 2', 'Project 3', 'Project 4']
const palettes = [
  { project: 'Project 1', name: 'Palette Uno', colors: ['#3F856C', '#065A83', '#94AD42', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 1', name: 'Palette Dos', colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 2', name: 'Palette Uno',colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 3', name: 'Palette Uno', colors: ['#68608F', '#49C262', '#AB50E5', '#BBB345', '#6303D0', '#604B3B'] },
  { project: 'Project 4', name: 'Palette Uno', colors: ['#4A914E', '#E1930C', '#C54E51', '#2DAC4A', '#898117', '#8D2380'] }
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

$('.dropdown-project').on('click', (e) => {
  console.log($(e.target))
})

const showDropDown = () => {
    document.getElementById("myDropdown").classList.toggle("show");
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
    let listHTML = `<a class="dropdown-project">${project}</a>`;
    let projectHTML = getProjectHTML(project);
    let paletteHTML = populateProjectPalettes(project)
    $('#myDropdown').append(listHTML);
    $('.saved-palette-container').append(projectHTML)
    $('.palette-container:last').append(paletteHTML)
  })
}

const getProjectHTML = (project) => {
  let html = `<div class='project-container' onclick='selectProject()'>
                <h2>${project}</h2>
                <div class='palette-container'>
                </div>
              </div>`;
  return html;
}

const populateProjectPalettes = (project) => {
  let paletteHTML = '';
  let projectPalette = palettes.filter((palette) => {
    return palette.project == project
  })
  projectPalette.forEach(palette => {
    paletteHTML = paletteHTML.concat(generateSavedPalette(palette.name, palette.colors));
  })
  return paletteHTML;
}

const generateSavedPalette = (name, colors) => {
  let html = `
    <div class="saved-palette">
      <h3>${name}</h3>
      <ul class="color-box-container">
        <li class="color-box" style="background-color:${colors[0]}"/>
        <li class="color-box" style="background-color:${colors[1]}"/>
        <li class="color-box" style="background-color:${colors[2]}"/>
        <li class="color-box" style="background-color:${colors[3]}"/>
        <li class="color-box" style="background-color:${colors[4]}"/>
        <li class="color-box" style="background-color:${colors[5]}"/>
      </ul>
      <img src='./imgs/trash-bin.png' />
    </div>
  `
  return html;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = (event) => {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-project') ) {

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

$(document).ready(() => {
  generateNewPalette()
  fetch('/api/v1/projects')
    .then((response) => {
      return response.json();
  }).then((data) => {
    populateProjects(data)
  })
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

const selectPalette = (id) => {
  console.log('PALETTE SELECTED!', id)
}

const selectProjectDropdown = (e) => {
  console.log('DROPDOWN SELECTED!', e.target.id)
}

const populateProjects = (projects) => {
  console.log('Passed Data', projects)
  projects.forEach(project => {
    let { id, name } = project;
    let listHTML = $(`<a id=${id} class="dropdown-project">${name}</a>`);
    listHTML.click(e => selectProjectDropdown(e))
    let projectHTML = getProjectHTML(id, name);
    $('#myDropdown').append(listHTML);
    $('.saved-palette-container').append(projectHTML)
    populateProjectPalettes(id)
  })

}

const getProjectHTML = (id, name) => {
  let html = `<div class='project-container'>
                <h2>${name}</h2>
                <div id=${id} class='palette-container'>
                </div>
              </div>`;
  return html;
}

const populateProjectPalettes = (projectID) => {
  fetch(`/api/v1/palettes/${projectID}`)
    .then((response) => {
      return response.json()
    }).then((data) => {
      data.forEach(palette => {
        let { id, name, color_1, color_2, color_3, color_4, color_5, color_6, project_id } = palette;
        let colors = [ color_1, color_2, color_3, color_4, color_5, color_6 ];
        $(`#${projectID}.palette-container`).append(generateSavedPalette(id, name, colors))
      })
    })
}

const generateSavedPalette = (id, name, colors) => {
  let paletteHTML = $(`
    <div id=${id} class="saved-palette">
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
  `);
  paletteHTML.click(() => selectPalette(id));
  return paletteHTML;
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

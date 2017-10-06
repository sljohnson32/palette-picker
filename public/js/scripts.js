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

$('#input-palette-name').on('keyup', (e) => {
  if ($(e.target).val() != '' && $('.palette-save-btn').attr('disabled') != false)   {
    $('.palette-save-btn').attr('disabled', false)
  } else $('.palette-save-btn').attr('disabled', true)
})

$('#input-project-name').on('keyup', (e) => {
  if ($(e.target).val() != '' && $('.project-save-btn').attr('disabled') != false)   {
    $('.project-save-btn').attr('disabled', false)
  } else $('.project-save-btn').attr('disabled', true)
})


const showDropDown = () => {
    document.getElementById("dropdowns").classList.toggle("show");
}

const generateNewPalette = () => {
  $('.color-container').each((index, element) => {
    if ($(element).find("img").hasClass('unlocked')) {
      let colorCode = getRandomColor()
      $(element).find('p').text(colorCode);
      $(element).attr('id', colorCode);
      $(element).css("background-color", colorCode);
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

const selectProjectDropdown = (e, name) => {
  let id = e.target.id;
  $('h4.dropdown-name').text(`${name}`);
  $('#dropdowns').toggleClass('show');
  $('#dropdowns').attr("ref", id);
}

const savePalette = () => {

  let projectName = $('#input-project-name').val();
  fetch('/api/v1/projects', {
    method: 'post',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({ name: projectName })
  })
  .then(response => response.json())
  .then(data => {
    let projectID = data.id
    fetch('/api/v1/palettes', {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(getPaletteBody(projectID))
    })
    .then(response => response.json())
    .then(data => populateProjects([{ id: projectID, name: projectName }]));
  })
}

const getPaletteBody = (id) => {
  return {
    name: $('#input-palette-name').val(),
    color_1: $($('.color-container')[0]).attr('id'),
    color_2: $($('.color-container')[1]).attr('id'),
    color_3: $($('.color-container')[2]).attr('id'),
    color_4: $($('.color-container')[3]).attr('id'),
    color_5: $($('.color-container')[4]).attr('id'),
    color_6: $($('.color-container')[5]).attr('id'),
    project_id: id
  }
}

const setProject = () => {
  console.log('PROJECT SAVED!')


}


const selectPalette = (e, id) => {
  if (!$(e.target).hasClass('delete-button')) {
    console.log('PALETTE SELECTED!', id)
  }
}

const deletePalette = (e) => {
  console.log('DELETED', e.target.id)
}

const populateProjects = (projects) => {
  projects.forEach(project => {
    let { id, name } = project;
    let listHTML = $(`<a id=${id} class="dropdown-project">${name}</a>`);
    listHTML.click(e => selectProjectDropdown(e, name))
    let projectHTML = getProjectHTML(id, name);
    $('#dropdowns').append(listHTML);
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
  console.log(projectID)
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
  let paletteContainer = $(`<div id=${id} class="saved-palette"></div>`)
  paletteContainer.click(e => selectPalette(e, id));

  let paletteHTML = $(`
      <h3>${name}</h3>
      <ul class="color-box-container">
        <li class="color-box" style="background-color:${colors[0]}"/>
        <li class="color-box" style="background-color:${colors[1]}"/>
        <li class="color-box" style="background-color:${colors[2]}"/>
        <li class="color-box" style="background-color:${colors[3]}"/>
        <li class="color-box" style="background-color:${colors[4]}"/>
        <li class="color-box" style="background-color:${colors[5]}"/>
      </ul>
  `);

  let trashHTML = $(`<img id=${id} class='delete-button' src='./imgs/trash-bin.png' />`)
  trashHTML.click((e) => deletePalette(e))

  paletteContainer.append(paletteHTML)
  paletteContainer.append(trashHTML)

  return paletteContainer;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = (event) => {
  if (!event.target.matches('.dropdown-button') && !event.target.matches('.dropdown-project') ) {

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

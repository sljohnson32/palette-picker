//Page load
$(document).ready(() => {
  generateNewPalette()
  fetchProjects()
  .then((data) => {
    if (typeof data == 'object') {
      populateProjects(data)
    }
  })
});

//Initial event listeners
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
  if ($(e.target).val() != '' && $('.palette-save-btn').attr('disabled') != false && $('.dropdown-button').hasClass('selected')) {
    $('.palette-save-btn').attr('disabled', false)
  } else $('.palette-save-btn').attr('disabled', true)
})

$('#input-project-name').on('keyup', (e) => {
  if ($(e.target).val() != '' && $('.project-set-btn').attr('disabled') != false)   {
    $('.project-set-btn').attr('disabled', false)
  } else $('.project-set-btn').attr('disabled', true)
})

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

//HTML generators
const generateNewPalette = (colors, id) => {
  if (colors != undefined) {
    $('.color-container').attr('ref', id)
    $('.color-container').each((index, element) => {
      if ($(element).find("img").hasClass('unlocked')) {
        let colorCode = colors[index]
        $(element).find('p').text(colorCode);
        $(element).attr('id', colorCode);
        $(element).css("background-color", colorCode);
      }
    })
  } else {
    $('.color-container').each((index, element) => {
      if ($(element).find("img").hasClass('unlocked')) {
        let colorCode = getRandomColor()
        $(element).find('p').text(colorCode);
        $(element).attr('id', colorCode);
        $(element).css("background-color", colorCode);
      }
    })
  }
}

const populateProjects = (projects) => {
  projects.forEach(project => {
    let { id, name } = project;
    let listHTML = $(`<a id=${id} class="dropdown-project">${name}</a>`);
    listHTML.click(e => selectProjectDropdown(e.target.id, name))
    let projectHTML = getProjectHTML(id, name);
    $('#dropdowns').append(listHTML);
    $('.saved-palette-container').append(projectHTML)
    populateProjectPalettes(id)
  })
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
  let paletteContainer = $(`<div id=${id} class="saved-palette"></div>`)
  let paletteHTML =
  $(` <h3>${name}</h3>
      <ul class="color-box-container">
        <li class="color-box" ref=${colors[0]} style="background-color:${colors[0]}"/>
        <li class="color-box" ref=${colors[1]} style="background-color:${colors[1]}"/>
        <li class="color-box" ref=${colors[2]} style="background-color:${colors[2]}"/>
        <li class="color-box" ref=${colors[3]} style="background-color:${colors[3]}"/>
        <li class="color-box" ref=${colors[4]} style="background-color:${colors[4]}"/>
        <li class="color-box" ref=${colors[5]} style="background-color:${colors[5]}"/>
      </ul>`);
  let trashHTML = $(`<img id=${id} class='delete-button' src='./imgs/trash-bin.png' />`)

  trashHTML.click((e) => deletePalette(e))
  paletteContainer.append(paletteHTML)
  paletteContainer.append(trashHTML)
  paletteContainer.click(e => selectPalette(e, id));

  return paletteContainer;
}

//HTML generator helpers
const getProjectHTML = (id, name) => {
  let html = `<div class='project-container'>
                <h2>${name}</h2>
                <div id=${id} class='palette-container'>
                </div>
              </div>`;
  return html;
}

const getRandomColor = () => {
  const chars = '0123456789ABCDEF'
    let colorCode = '#'
    for (let i = 0; i < 6; i++) {
        colorCode += chars[Math.floor(Math.random() * 16)]
    }
    return colorCode;
}

//Page actions
const selectProjectDropdown = (id, name) => {
  if (id) {
    $('#dropdowns').attr("ref", id);
  } else {
    $('#dropdowns').attr("ref", null);
  }
  $('.dropdown-button').text(`${name}`);
  $('.dropdown-button').addClass('selected');
  $('#dropdowns').toggleClass('show');
  $('button.dropdown-button').css('background-color', '#303F9F');
  checkPaletteBtn();
}

const showDropDown = () => {
    document.getElementById("dropdowns").classList.toggle("show");
}

const savePalette = () => {
  let projectID = $('#dropdowns').attr('ref');
  let existingPaletteID = $('.color-container').attr('ref');
  let paletteBody = getPaletteBody(projectID);

  if (existingPaletteID) {
    fetchExistingPalettes(existingPaletteID, paletteBody)
    .then(() => {
      let colors = getColors();
      let paletteHTML = generateSavedPalette(existingPaletteID, paletteBody.name, colors)
      $(`#${existingPaletteID}.saved-palette`).html(paletteHTML);
      resetControls();
    })
  } else if (projectID) {
      fetchPalettes(paletteBody)
      .then(data => {
        let paletteID = data.id;
        let colors = getColors();
        let paletteHTML = generateSavedPalette(paletteID, paletteBody.name, colors)
        $(`#${projectID}.palette-container`).append(paletteHTML);
        resetControls();
      })
    } else {
      let projectName = $('#input-project-name').val();
      fetchCreateProject(projectName)
      .then(data => {
        let projectID = data.id
        fetchCreateNewPalette(projectID)
        .then(data => {
          populateProjects([
            { id: projectID, name: projectName }
          ]);
          resetControls();
        });
      })
    }
  }

const setProject = () => {
  let projectName = $('#input-project-name').val()
  let listHTML = $(`<a class="dropdown-project selected">${projectName}</a>`);
  listHTML.click(e => selectProjectDropdown(e.target.id, projectName))
  $('button.dropdown-button').text(`${projectName}`);
  $('#dropdowns').attr("ref", null).append(listHTML);
  $('button.dropdown-button').css('background-color', '#303F9F');
  $('.dropdown-button').addClass('selected');
  checkPaletteBtn();
}

const selectPalette = (e, id) => {
  if (!$(e.target).hasClass('delete-button')) {
    let colors = [];
    $(e.target).parents('.saved-palette').children('ul').children('li').each((index, color) => {
      colors.push($(color).attr('ref'))
    })
    let projectName = $(e.target).parents('.project-container').children('h2').text();
    let paletteName = $(e.target).parents('.saved-palette').children('h3').text();
    let projectID = $(e.target).closest('.palette-container').attr('id');
    let paletteID = $(e.target).closest('.saved-palette').attr('id');
    generateNewPalette(colors, paletteID);
    selectProjectDropdown(projectID, projectName);
    $('#input-palette-name').val(paletteName);
    $('.palette-save-btn').attr('disabled', false);
  }
}

const deletePalette = (e) => {
  let paletteID = e.target.id;
  fetch(`/api/v1/palettes/${paletteID}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(() => $(`#${paletteID}`).children().remove())
}

//Page action helpers
const resetControls = () => {
  $('button.dropdown-button').html('Select Project &#9660;');
  $('#dropdowns').attr("ref", null);
  $('#input-project-name').val('');
  $('#input-palette-name').val('');
  $('button.dropdown-button').css('background-color', '#4CAF50')
  $('a.selected').toggleClass('selected');
  $('.save-set-btns').attr('disabled', true);
  $('.color-container').removeAttr('ref');
  $('.dropdown-button').removeClass('selected');
}

const getColors = () => {
  return [
    $($('.color-container')[0]).attr('id'),
    $($('.color-container')[1]).attr('id'),
    $($('.color-container')[2]).attr('id'),
    $($('.color-container')[3]).attr('id'),
    $($('.color-container')[4]).attr('id'),
    $($('.color-container')[5]).attr('id')
  ]
}

const checkPaletteBtn = () => {
  if ($('input-palette-name').val() != undefined) {
    $('.palette-save-btn').attr('disabled', false)
  }
}

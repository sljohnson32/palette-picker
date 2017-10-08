//Fetch functions
const fetchProjects = () => {
  return fetch('/api/v1/projects')
  .then((response) => { return response.json() });
}

const fetchGetPalettes = (id) => {
  return fetch(`/api/v1/palettes/${id}`)
    .then((response) => {
      return response.json()
    })
}

const fetchUpdatePalette = (id, body) => {
  return fetch(`/api/v1/palettes/${id}`, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(body)
  })
  .then(response => checkStatus(response))
}

const fetchAddPalette = (body) => {
  return fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
}

const fetchCreateProject = (name) => {
  return fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({ name })
  })
  .then(response => response.json())
}

const fetchDeletePalette = (id) => {
  return fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
}

//Fetch helper functions
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

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

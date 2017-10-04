const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.sendfile('index.html');
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json({ projects })
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json({ palettes })
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  if (!project.name) {
    return response.status(422)
      .send({ error: "Expected format: { name: <String> }. You're missing the name property."});
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  const paletteFields = ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'color_6', 'project_id']

  for (let requiredParameter of paletteFields) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, color_6: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(3000, () => {
  console.log('Projects server running on localhost:3000')
})

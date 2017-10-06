const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/', (request, response) => {
  response.sendfile('index.html');
})


app.get('/api/v1/projects', (request, response) => {
  database('projects').select().orderBy('id')
    .then((projects) => {
      response.status(200).json(projects)
    })
    .catch((error) => {
      response.status(500).json(error)
    });
});


app.get('/api/v1/palettes/:id', (request, response) => {
  const paletteID = request.params.id


  database('palettes').where('project_id', paletteID).orderBy('id').select()
    .then((palettes) => {
      if (palettes.length > 0) {
        return response.status(200).json(palettes)
      } else {
        response.status(404).json({ error: `There is no project with id: ${paletteID} in the database.` })
      }
    })
    .catch((error) => {
      response.status(500).json(error)
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
      response.status(500).json(error);
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
      response.status(500).json(error);
    });
});


app.put('/api/v1/palettes/:id', (request, response) => {
  const palette = request.body;
  const paletteID = request.params.id
  const paletteFields = ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'color_6', 'project_id']

  for (let requiredParameter of paletteFields) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, color_6: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').where("id", "=", paletteID).update(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json(error);
    });
});


app.delete('/api/v1/palettes/:id', (request, response) => {
  const paletteID = request.params.id

  database('palettes').where('id', paletteID).del()
    .then(() => {
      response.status(200).json(`Palette with id: ${paletteID} was deleted!`)
    })
    .catch(error => {
      response.status(500).json(error)
    })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
app.use(requireHTTPS);

//Serving up the initial HTML for the single page app
app.get('/', (request, response) => {
  response.sendfile('index.html');
})

//Returning all project names and ids
app.get('/api/v1/projects', (request, response) => {
  database('projects').select().orderBy('id')
    .then((projects) => {
      if (projects.length > 0) {
        return response.status(200).json(projects)
      } else return response.status(200).json('There are no projects saved to the database yet');
    })
    .catch((error) => {
      response.status(500).json(error)
    });
});

//Returning the palettes for the project_id provided in the request params
app.get('/api/v1/palettes/:id', (request, response) => {
  const projectID = request.params.id
  const isNotInteger = isNaN(parseInt(projectID))

  //Validating that the request parameter is an integer
  if (isNotInteger == true ) {
    return response.status(400).json({ error: `The request parameter for project ID must be an integer. You entered '${projectID}' which is not an integer.`})
  }
  //Validating that the request parameter for ID represents an existing project ID
  let projectExists;
  database('projects').where('id', projectID).select()
    .then(project => {
      projectExists = project;
    })

  //Making the database query and returing response if project exists
  database('palettes').where('project_id', projectID).orderBy('id').select()
    .then((palettes) => {
      if (palettes.length > 0) {
        return response.status(200).json(palettes)
      } else {
        if (projectExists.length == 0) {
          response.status(404).json({ error: `There is no project with id: ${projectID} in the database.` })
          //Returning message confirming that request worked but no palettes are saved
        } else response.status(200).json(`There are no palettes saved for project with id: ${projectID}.`)
      }
    })
    .catch((error) => {
      response.status(500).json(error)
    });
});

//Adding a projet to the DB
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  //Sending error if request body was not formatted correctly.
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

//Adding palette to DB
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  const paletteFields = ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'color_6', 'project_id']

  //Sending an error message if request body was formatted incorrectly or didn't include all required data
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

//Updating existing palette based on palette ID provided in parameter
app.put('/api/v1/palettes/:id', (request, response) => {
  const palette = request.body;
  const paletteID = request.params.id
  const paletteFields = ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'color_6', 'project_id']

  //Validating that request body is formatted correctly and includes all the necessary fields
  for (let requiredParameter of paletteFields) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, color_6: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  //Updating palette in DB
  database('palettes').where("id", paletteID).update(palette, 'id')
    .then(() => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

//Deleting palette based on id provided in request parameter
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

//Listing on the correct port for API requests
app.listen(app.get('port'), () => {
  console.log(`${app.get('env')} server is running on localhost:${app.get('port')}.`);
});

module.exports = app;

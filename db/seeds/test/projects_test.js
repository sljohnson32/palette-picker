const fakePalettes1 = [
  { id: 1, name: 'Palette 1', color_1: '#3F856C', color_2: '#065A83', color_3:'#94AD42', color_4:'#BBB345', color_5:'#6303D0', color_6:'#604B3B' },
  { id: 2, name: 'Palette 2', color_1: '#4A914E', color_2: '#E1930C', color_3: '#C54E51', color_4: '#2DAC4A', color_5: '#898117', color_6: '#8D2380' }
];

const fakePalettes2 = [
  { id: 3, name: 'This other Palette', color_1: '#68608F', color_2: '#49C262', color_3: '#AB50E5', color_4: '#BBB345', color_5: '#6303D0', color_6: '#604B3B'},
  { id: 4, name: 'The best palette ever', color_1: '#3F856C', color_2: '#065A83', color_3:'#94AD42', color_4:'#BBB345', color_5:'#6303D0', color_6:'#604B3B' }
];

const projectsData = [{
  id: 1,
  name: 'Project 1',
  palettes: fakePalettes1
},
{
  id: 2,
  name: 'Project 2',
  palettes: fakePalettes2
}];


const createProject = (knex, project) => {
  return knex('projects').insert({
    id: project.id,
    name: project.name
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, {
          id: palette.id,
          name: palette.name,
          color_1: palette.color_1,
          color_2: palette.color_2,
          color_3: palette.color_3,
          color_4: palette.color_4,
          color_5: palette.color_5,
          color_6: palette.color_6,
          project_id: projectId[0]
        })
      )
    });

    return Promise.all(palettePromises);
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex, Promise) => {
  return knex('palettes').del() // delete footnotes first
    .then(() => knex('projects').del()) // delete all papers
    .then(() => {
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

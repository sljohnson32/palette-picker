process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include("Perfect Palette Picker")
      done();
    });
  });

    it('should return a 404 for a route that doesn not exist', (done) => {
      chai.request(server)
      .get('/pancakes')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
});

describe('API Routes', () => {

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        });
      });
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Project 1');
        response.body[0].should.have.property('id')
        response.body[0].id.should.equal(1);
        done();
      });
    });

  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return an array of palettes for the project id provided ', (done) => {
      chai.request(server)
      .get('/api/v1/palettes/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('id')
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Palette 1');
        response.body[0].should.have.property('color_1');
        response.body[0].color_1.should.equal('#3F856C');
        response.body[0].should.have.property('color_2');
        response.body[0].color_2.should.equal('#065A83');
        response.body[0].should.have.property('color_3');
        response.body[0].color_3.should.equal('#94AD42');
        response.body[0].should.have.property('color_4');
        response.body[0].color_4.should.equal('#BBB345');
        response.body[0].should.have.property('color_5');
        response.body[0].color_5.should.equal('#6303D0');
        response.body[0].should.have.property('color_6');
        response.body[0].color_6.should.equal('#604B3B');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        done();
      });
    });

    it('should return a 404 error if the id provided does not match a project id in database', (done) => {
      chai.request(server)
      .get('/api/v1/palettes/44')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

});
//
// after(() => {
//   process.exit()
// });

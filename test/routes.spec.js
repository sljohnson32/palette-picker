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

  describe('GET /api/v1/projects', () => {
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

});
//
// after(() => {
//   process.exit()
// });

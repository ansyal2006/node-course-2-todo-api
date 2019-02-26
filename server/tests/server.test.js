const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [{text : 'First todo'},{text : 'Second todo'}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    //insertMany function adds elements of an array to a collection and returns a promise on which another then() call is made.
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text : text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }

      Todo.find({text : text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));

    });
  });

  it('should NOT create a new todo', (done) => {

    var text = '        ';

    request(app)
    .post('/todos')
    .send({text : text})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all the todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  })
});

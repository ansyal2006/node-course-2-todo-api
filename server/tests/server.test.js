const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [
  {
    _id : new ObjectID(),
    text : 'First todo'
  } ,
  {
    _id : new ObjectID(),
    text : 'Second todo'
  }
];

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

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${(new ObjectID).toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[1].text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(todos[1]._id.toHexString()).then((todo) =>{
        expect(todo).not.toBeTruthy();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .delete(`/todos/${(new ObjectID).toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done);
  });

});

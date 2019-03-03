const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

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


describe('PATCH /todos/:id', () => {

  var testText1 = 'HARDWORK, DEDICATION!!!';
  it('should update the todo', (done) => {
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({text : testText1, completed : true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(testText1);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });

  var testText2 = 'COME ON!!';
  it('should clear completedAt when todo is NOT completed', (done) => {
    request(app)
    .patch(`/todos/${todos[1]._id.toHexString()}`)
    .send({text: testText2, completed : false})
    .expect(200)
    .expect((res) => {
        expect(res.body.todo.text).toBe(testText2);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).not.toBeTruthy();
    })
    .end(done);
  });

});

describe('GET /users/me', () => {

  it('should return a user on correct authentication', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 not authorised if user is not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'ansyal2006@gmail.com';
    var password = 'qwerty123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      });
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'dfdfvdvd';
    var password = 'wwee';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email is already in use', (done) => {
    var email = users[0].email;
    var password = 'fffffffff';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

});

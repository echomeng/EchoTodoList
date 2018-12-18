Page({
  data: {
    todos: [],
    input: "",
    leftCount: 0,
    allCompleted: false,
    logs: []
  },
  onShow: function() {
    var logs = wx.getStorageSync('todo_logs');
    var todos = wx.getStorageSync('todo_list');
    var leftCount = wx.getStorageSync('left_count')
    if (logs) {
      this.setData({
        logs: logs
      });
    }
    if (todos) {
      this.setData({
        todos:todos,
      });
    }
    if (leftCount > 0) {
      this.setData({
        leftCount: leftCount,
      });
    }
  },
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos);
    wx.setStorageSync('todo_logs', this.data.logs);
    wx.setStorageSync('left_count', this.data.leftCount);
  },
  inputChange: function (e) {
    this.setData({
      input: e.detail.value
    })
  },
  inputConfirm: function (e) {
    var input = this.data.input.trim();
    if (!input) return;
    var todos = this.data.todos?this.data.todos:[];
    var leftCount = this.data.leftCount;
    leftCount++;
    todos.push({
      name: input,
      completed: false
    });
    var log = {
      name: input,
      behave: 'Add',
      time: new Date()
    }
    var logs = this.data.logs;
    logs.push(log);
    this.setData({
      todos: todos,
      input: '',
      leftCount: leftCount,
      logs: logs,
    });
    this.save();
  },
  removeClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var logs = this.data.logs;
    var removeItem = todos.splice(index, 1)[0];
    var leftCount = this.data.leftCount;
    if (!removeItem.completed && leftCount > 0) {
      leftCount--;
    }
    if (removeItem) {
      logs.push({
        name: removeItem.name,
        behave: 'Remove',
        time: new Data()
      });
      this.setData({
        todos: todos,
        leftCount: leftCount,
        logs: logs,
      })
      this.save();
    }
  },
  handleTodo: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var logs = this.data.logs;
    todos[index].completed = !todos[index].completed;
    var leftCount = this.data.leftCount;
    if (todos[index].completed) {
      if(leftCount > 0) leftCount--;
      logs.push({
        name: todos[index].name,
        behave: 'Finish',
        time: new Date()
      });
    }
    else {
      leftCount++;
      logs.push({
        name: todos[index].name,
        behave: 'Restart',
        time: new Date()
      });
    }
    this.setData({
      todos: todos,
      leftCount: leftCount,
      logs: logs,
    });
    this.save();
  },
  clearCompleted: function (e) {
    var todos = this.data.todos;
    var logs = this.data.logs;
    var remainTodos = [];
    for (let i = 0; i < todos.length; i++) {
      if (!todos[i].completed) {
        remainTodos.push(todos[i]);
      } else {
        logs.push({
          name: todos[index].name,
          behave: 'Finish',
          time: new Data()
        })
      }
    }
    var leftCount = remainTodos.length;
    this.setData({
      todos: remainTodos,
      logs: logs,
      leftCount: leftCount,
    });
    this.save();
  },
  toggleAll: function (e) {
    this.data.completed = !this.data.completed;
    var todos = this.data.todos;
    for (let i = 0; i < todos.length; i++) {
      if (this.data.completed) {
        todos[i].completed = true;
      } else {
        todos[i].completed = false;
      }
    }
    this.setData({
      todos: todos,
    });
    this.save();
  }
})
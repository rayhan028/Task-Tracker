angular.module('taskTrackerApp', [])
.controller('MainCtrl', ['$scope', '$timeout', function($scope, $timeout) {
  var self = this;

  self.categories = ['Work', 'Personal', 'Hobby', 'Other'];
  self.newTask = {title: '', category: 'Work', completed: false};
  self.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  // Save tasks to localStorage
  self.saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(self.tasks));
    $timeout(updateChart, 0); // Update chart after DOM
  };

  // Add task
  self.addTask = function() {
    if (!self.newTask.title.trim()) return;
    self.tasks.push({
      title: self.newTask.title,
      category: self.newTask.category,
      completed: false
    });
    self.newTask.title = '';
    self.newTask.category = 'Work';
    self.saveTasks();
  };

  // Update task (on checkbox change)
  self.updateTask = function(task) {
    self.saveTasks();
  };

  // Delete task
  self.deleteTask = function(task) {
    self.tasks = self.tasks.filter(t => t !== task);
    self.saveTasks();
  };

  // Count completed tasks
  self.completedCount = function() {
    return self.tasks.filter(t => t.completed).length;
  };

  // Chart
  var ctx = document.getElementById('chart').getContext('2d');
  var chart;

  function updateChart() {
    var categories = Array.from(new Set(self.tasks.map(t => t.category)));
    var counts = categories.map(c => self.tasks.filter(t => t.category === c).length);
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: counts,
          backgroundColor: ['#ff6384','#36a2eb','#ffcd56','#4bc0c0']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Initialize chart
  $timeout(updateChart, 0);
}]);

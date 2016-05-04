angular.module('opal.pathway.controllers').controller('MultiSaveCtrl',
  function(Options, $controller, step, scope, episode) {
      "use strict";
      var vm = this;

      var parentCtrl = $controller("MultistageDefault");
      _.extend(vm, parentCtrl);

      vm.step = step;
      vm.multipleModels = [];

      vm.cleanModel = function(editing_field){
          _.each(_.keys(editing_field), function(a){
              editing_field[a] = undefined;
          });
      };

      if(episode && episode[step.api_name].length > 1){
          vm.multipleModels = angular.copy(episode[step.api_name]);
          var editing_field = scope.editing[step.api_name];
          vm.cleanModel(editing_field);
      }

      vm.isClean = function(editing_field){
          return !_.some(_.values(editing_field));
      };

      vm.addAnother = function(){
          var editing_field = scope.editing[step.api_name];

          if(!vm.isClean(editing_field)){
              vm.multipleModels.push(angular.copy(editing_field));
              vm.cleanModel(editing_field);
          }
      };

      vm.remove = function($index){
          vm.multipleModels.splice($index, 1);
      };

      vm.toSave = function(editing){
          var all_models = angular.copy(vm.multipleModels);
          if(!vm.isClean(editing[step.api_name])){
            all_models.push(editing[step.api_name]);
          }
          editing[step.api_name] = all_models;
      };
});

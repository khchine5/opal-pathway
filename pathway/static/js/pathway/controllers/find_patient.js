angular.module('opal.controllers').controller('FindPatientCtrl',
  function(scope, Episode, step, episode) {
    "use strict";

    scope.lookup_hospital_number = function() {
        Episode.findByHospitalNumber(
            scope.demographics.hospital_number,
            {
                newPatient:    scope.new_patient,
                newForPatient: scope.new_for_patient,
                error        : function(){
                    // this shouldn't happen, but we should probably handle it better
                    alert('ERROR: More than one patient found with hospital number');
                }
            });
    };

    this.initialise = function(scope){
      scope.state = 'initial';

      scope.demographics = {
        hospital_number: undefined
      };
    };

    scope.new_patient = function(result){
        scope.state = 'editing_demographics';
    };

    scope.new_for_patient = function(patient){
        scope.demographics = patient.demographics[0];
        scope.state   = 'has_demographics';
    };
    scope.showNext = function(editing){
        return scope.state === 'has_demographics' || scope.state === 'editing_demographics';
    };

    scope.preSave = function(editing){
        editing.demographics = scope.demographics;
    };

    this.initialise(scope);
});

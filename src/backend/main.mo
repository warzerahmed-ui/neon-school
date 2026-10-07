import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import OptNatValue "OptNatValue";
import Common "types/common";
import Types "types/school";
import SchoolApi "mixins/school-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let students : Map.Map<Common.StudentId, Types.Student>;
  let classes : Map.Map<Common.ClassId, Types.Class>;
  let state : { var nextStudentId : Nat; var nextClassId : Nat };

  include SchoolApi(accessControlState, students, classes, state);
  include ApiDocMixin();

  include Expose({
    entities = [
      students.toEntity("student", "Student", "id")
        .sample({ id = 0; name = ""; classId = null; enrollmentDate = 0 })
        .controllerOnly()
        .build(),
      classes.toEntity("class", "Class", "id")
        .sample({ id = 0; name = ""; subject = ""; studentCount = 0 })
        .controllerOnly()
        .build(),
    ];
  });
};

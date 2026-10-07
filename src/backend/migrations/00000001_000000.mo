import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Student = {
    id : Nat;
    name : Text;
    classId : ?Nat;
    enrollmentDate : Int;
  };

  type Class = {
    id : Nat;
    name : Text;
    subject : Text;
    studentCount : Nat;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    students : Map.Map<Nat, Student>;
    classes : Map.Map<Nat, Class>;
    state : { var nextStudentId : Nat; var nextClassId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      students = Map.empty();
      classes = Map.empty();
      state = { var nextStudentId = 0; var nextClassId = 0 };
    };
  };
};

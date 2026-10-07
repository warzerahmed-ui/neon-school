import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/school";
import SchoolLib "../lib/school";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.StudentId, Types.Student>,
  classes : Map.Map<Common.ClassId, Types.Class>,
  state : { var nextStudentId : Nat; var nextClassId : Nat },
) {
  func requireSignedIn(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: sign in required");
    };
    // Traps when the caller has never registered through the app.
    ignore AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func createStudent(input : Types.StudentInput) : async Types.Student {
    requireSignedIn(caller);
    SchoolLib.createStudent(students, state, input);
  };

  public shared ({ caller }) func updateStudent(id : Common.StudentId, input : Types.StudentInput) : async ?Types.Student {
    requireSignedIn(caller);
    SchoolLib.updateStudent(students, id, input);
  };

  public shared ({ caller }) func deleteStudent(id : Common.StudentId) : async Bool {
    requireSignedIn(caller);
    SchoolLib.deleteStudent(students, id);
  };

  public query ({ caller }) func listStudents(search : ?Text, classFilter : ?Common.ClassId) : async [Types.Student] {
    ignore caller;
    SchoolLib.listStudents(students, search, classFilter);
  };

  public shared ({ caller }) func createClass(input : Types.ClassInput) : async Types.Class {
    requireSignedIn(caller);
    SchoolLib.createClass(classes, state, input);
  };

  public shared ({ caller }) func updateClass(id : Common.ClassId, input : Types.ClassInput) : async ?Types.Class {
    requireSignedIn(caller);
    SchoolLib.updateClass(classes, id, input);
  };

  public shared ({ caller }) func deleteClass(id : Common.ClassId) : async Bool {
    requireSignedIn(caller);
    SchoolLib.deleteClass(classes, students, id);
  };

  public query ({ caller }) func listClasses() : async [Types.Class] {
    ignore caller;
    SchoolLib.listClasses(classes, students);
  };

  public query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    ignore caller;
    SchoolLib.getDashboardStats(students, classes);
  };
};

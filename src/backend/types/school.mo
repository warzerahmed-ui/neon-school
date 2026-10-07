import Common "common";

module {
  public type Student = {
    id : Common.StudentId;
    name : Text;
    classId : ?Common.ClassId;
    enrollmentDate : Common.Timestamp;
  };

  public type Class = {
    id : Common.ClassId;
    name : Text;
    subject : Text;
    studentCount : Nat;
  };

  public type DashboardStats = {
    totalStudents : Nat;
    totalClasses : Nat;
    averageClassSize : Float;
  };

  public type StudentInput = {
    name : Text;
    classId : ?Common.ClassId;
    enrollmentDate : Common.Timestamp;
  };

  public type ClassInput = {
    name : Text;
    subject : Text;
  };
};

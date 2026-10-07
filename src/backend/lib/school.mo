import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import Types "../types/school";

module {
  public func createStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    state : { var nextStudentId : Nat },
    input : Types.StudentInput,
  ) : Types.Student {
    let id = state.nextStudentId;
    state.nextStudentId := id + 1;
    let student : Types.Student = {
      id;
      name = input.name;
      classId = input.classId;
      enrollmentDate = input.enrollmentDate;
    };
    students.add(id, student);
    student;
  };

  public func updateStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    id : Common.StudentId,
    input : Types.StudentInput,
  ) : ?Types.Student {
    switch (students.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Student = {
          id = existing.id;
          name = input.name;
          classId = input.classId;
          enrollmentDate = input.enrollmentDate;
        };
        students.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    id : Common.StudentId,
  ) : Bool {
    switch (students.get(id)) {
      case null { false };
      case (?_) {
        students.remove(id);
        true;
      };
    };
  };

  public func listStudents(
    students : Map.Map<Common.StudentId, Types.Student>,
    search : ?Text,
    classFilter : ?Common.ClassId,
  ) : [Types.Student] {
    let term = switch (search) {
      case null { null };
      case (?s) {
        let trimmed = s.trim(#predicate(func c = c == ' '));
        if (trimmed == "") { null } else { ?trimmed.toLower() };
      };
    };
    students.values().filter(func student = matches(student, term, classFilter)).toArray();
  };

  func matches(
    student : Types.Student,
    term : ?Text,
    classFilter : ?Common.ClassId,
  ) : Bool {
    let nameOk = switch (term) {
      case null { true };
      case (?t) { student.name.toLower().contains(#text t) };
    };
    let classOk = switch (classFilter) {
      case null { true };
      case (?c) { student.classId == ?c };
    };
    nameOk and classOk;
  };

  public func createClass(
    classes : Map.Map<Common.ClassId, Types.Class>,
    state : { var nextClassId : Nat },
    input : Types.ClassInput,
  ) : Types.Class {
    let id = state.nextClassId;
    state.nextClassId := id + 1;
    let cls : Types.Class = {
      id;
      name = input.name;
      subject = input.subject;
      studentCount = 0;
    };
    classes.add(id, cls);
    cls;
  };

  public func updateClass(
    classes : Map.Map<Common.ClassId, Types.Class>,
    id : Common.ClassId,
    input : Types.ClassInput,
  ) : ?Types.Class {
    switch (classes.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Class = {
          id = existing.id;
          name = input.name;
          subject = input.subject;
          studentCount = existing.studentCount;
        };
        classes.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteClass(
    classes : Map.Map<Common.ClassId, Types.Class>,
    students : Map.Map<Common.StudentId, Types.Student>,
    id : Common.ClassId,
  ) : Bool {
    switch (classes.get(id)) {
      case null { false };
      case (?_) {
        classes.remove(id);
        // Unassign students that belonged to this class; do not delete them.
        let snapshot = students.entries().toArray();
        students.clear();
        for ((studentId, student) in snapshot.values()) {
          let next = if (student.classId == ?id) {
            { student with classId = null };
          } else {
            student;
          };
          students.add(studentId, next);
        };
        true;
      };
    };
  };

  public func listClasses(
    classes : Map.Map<Common.ClassId, Types.Class>,
    students : Map.Map<Common.StudentId, Types.Student>,
  ) : [Types.Class] {
    classes.values().map(
      func(cls) {
        var count = 0;
        for (student in students.values()) {
          if (student.classId == ?cls.id) { count += 1 };
        };
        { cls with studentCount = count };
      }
    ).toArray();
  };

  public func getDashboardStats(
    students : Map.Map<Common.StudentId, Types.Student>,
    classes : Map.Map<Common.ClassId, Types.Class>,
  ) : Types.DashboardStats {
    let totalStudents = students.size();
    let totalClasses = classes.size();
    let averageClassSize = if (totalClasses == 0) {
      0.0;
    } else {
      totalStudents.toFloat() / totalClasses.toFloat();
    };
    { totalStudents; totalClasses; averageClassSize };
  };
};

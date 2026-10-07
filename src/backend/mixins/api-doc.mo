mixin () {
  /// Returns the backend's public API documentation as Markdown.
  public query func getApiDoc() : async Text {
    "# School Management Backend API\n\n" #
    "## Purpose\n\n" #
    "This canister backs a Kurdish-language school management application. It stores\n" #
    "students and classes and exposes CRUD endpoints plus dashboard statistics. All\n" #
    "persisted data is also queryable through the OQL (Object Query Layer) endpoints\n" #
    "`schema()` and `execute()`.\n\n" #
    "## Authentication and identity\n\n" #
    "The frontend authenticates users with Internet Identity. The app pins an\n" #
    "Internet Identity derivation origin, published at\n" #
    "`/.well-known/ii-derivation-origin` when available. An agent that already holds\n" #
    "the user's Internet Identity authorization derives the correct per-app\n" #
    "principal against that origin (for example\n" #
    "`icp identity link web <name> --app <host>`). Such a delegation acts with the\n" #
    "user's full authority in this app until it expires.\n\n" #
    "### Registration prerequisite\n\n" #
    "Every mutating endpoint requires a signed-in caller that has already registered\n" #
    "through the app's own frontend. Registration happens only when a caller signs in\n" #
    "through the frontend, so a principal that never did so is unregistered even when\n" #
    "it belongs to the app's owner, and a signed-in caller derived against a\n" #
    "different origin is a different principal than the one the frontend registered.\n\n" #
    "A direct API caller must register once by calling `_initialize_access_control`\n" #
    "as a signed-in caller before any role-guarded call. The first caller to\n" #
    "initialize receives the `#admin` role; every subsequent caller receives the\n" #
    "`#user` role.\n\n" #
    "An anonymous caller receives the trap `Unauthorized: sign in required` on every\n" #
    "mutating endpoint. A signed-in but unregistered caller receives the\n" #
    "authorization package's unregistered-principal trap from\n" #
    "`AccessControl.getUserRole`.\n\n" #
    "### Authorization boundaries\n\n" #
    "- `createStudent`, `updateStudent`, `deleteStudent`, `createClass`,\n" #
    "  `updateClass`, and `deleteClass` require a signed-in, registered caller.\n" #
    "- `listStudents`, `listClasses`, and `getDashboardStats` are open queries and\n" #
    "  do not check the caller.\n" #
    "- OQL `schema()` and `execute()` are controller-only for both the `student` and\n" #
    "  `class` tables.\n\n" #
    "## Methods\n\n" #
    "### Students\n\n" #
    "- `createStudent(input : StudentInput) : async Student` — creates a student and\n" #
    "  returns it with its assigned `id`.\n" #
    "- `updateStudent(id : StudentId, input : StudentInput) : async ?Student` —\n" #
    "  replaces the student's fields; returns `null` when no student has that id.\n" #
    "- `deleteStudent(id : StudentId) : async Bool` — deletes the student; returns\n" #
    "  `false` when no student has that id.\n" #
    "- `listStudents(search : ?Text, classFilter : ?ClassId) : async [Student]` —\n" #
    "  returns all students, optionally filtered by a case-insensitive name\n" #
    "  substring and/or an exact class id.\n\n" #
    "### Classes\n\n" #
    "- `createClass(input : ClassInput) : async Class` — creates a class and returns\n" #
    "  it with its assigned `id` and `studentCount = 0`.\n" #
    "- `updateClass(id : ClassId, input : ClassInput) : async ?Class` — renames a\n" #
    "  class and changes its subject; returns `null` when no class has that id.\n" #
    "- `deleteClass(id : ClassId) : async Bool` — deletes the class and unassigns\n" #
    "  every student that belonged to it (students are not deleted); returns `false`\n" #
    "  when no class has that id.\n" #
    "- `listClasses() : async [Class]` — returns all classes with a freshly computed\n" #
    "  `studentCount`.\n\n" #
    "### Dashboard\n\n" #
    "- `getDashboardStats() : async DashboardStats` — returns `totalStudents`,\n" #
    "  `totalClasses`, and `averageClassSize` (0.0 when there are no classes).\n\n" #
    "### OQL\n\n" #
    "- `schema() : async Text` — JSON schema of the exposed tables.\n" #
    "- `execute(query : Text) : async Text` — runs a JSON OQL query.\n\n" #
    "## Types and encoding\n\n" #
    "- `StudentId` and `ClassId` are `Nat` identifiers assigned by the canister,\n" #
    "  starting at 0 and incrementing independently per collection.\n" #
    "- `Timestamp` is an `Int` in nanoseconds since the Unix epoch.\n" #
    "- `Student.classId` is `?ClassId`; `null` means the student is unassigned.\n" #
    "- `Class.studentCount` is derived at read time from the students map and is not\n" #
    "  stored authoritatively.\n" #
    "- `DashboardStats.averageClassSize` is a `Float`.\n\n" #
    "## Lifecycle and polling\n\n" #
    "All endpoints are single-message calls with no asynchronous work, so there is\n" #
    "nothing to poll: a call's result is final when it returns. `listStudents`,\n" #
    "`listClasses`, and `getDashboardStats` are `query` calls and read the latest\n" #
    "committed state.\n\n" #
    "## Mutation retry safety\n\n" #
    "Mutations are not idempotent. `createStudent` and `createClass` allocate a new\n" #
    "id on every call, so retrying a call that actually succeeded creates a duplicate\n" #
    "row. `updateStudent` and `updateClass` are idempotent for a given input.\n" #
    "`deleteStudent` and `deleteClass` are idempotent in effect: a second call\n" #
    "returns `false` and changes nothing. `deleteClass` also unassigns its students,\n" #
    "which is a destructive side effect.\n\n" #
    "## Errors and gotchas\n\n" #
    "- Mutating endpoints trap with `Unauthorized: sign in required` for anonymous\n" #
    "  callers, and with the authorization package's unregistered-principal trap for\n" #
    "  signed-in callers that never registered through the frontend.\n" #
    "- `updateStudent` and `updateClass` return `null` rather than trapping when the\n" #
    "  id does not exist.\n" #
    "- `deleteClass` unassigns students instead of deleting them; their `classId`\n" #
    "  becomes `null`.\n" #
    "- OQL `schema()` and `execute()` are controller-only; a non-controller caller\n" #
    "  is rejected by the OQL authorization check.\n";
  };
};

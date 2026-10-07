import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

// A deterministic, non-anonymous caller. The backend's mutating endpoints
// require a signed-in caller that has registered through the app, so the
// first thing this suite does is register this identity.
const owner = createIdentity("school-lane-owner");

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: owner.getPrincipal(),
  }));
  actor.setIdentity(owner);
  // Registration prerequisite: the first signed-in caller to initialize
  // receives the admin role, after which role-guarded calls are permitted.
  await actor._initialize_access_control();
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  await expect(actor.listStudents([], [])).resolves.toEqual([]);
  await expect(actor.listClasses()).resolves.toEqual([]);
  await expect(actor.getDashboardStats()).resolves.toEqual({
    totalStudents: 0n,
    totalClasses: 0n,
    averageClassSize: 0,
  });
});

it("round-trips a class and a student through the real canister", async () => {
  const created = await actor.createClass({ name: "پۆلی ١٠", subject: "بیرکاری" });
  expect(created).toMatchObject({ name: "پۆلی ١٠", subject: "بیرکاری", studentCount: 0n });

  const student = await actor.createStudent({
    name: "ئاراس",
    classId: [created.id],
    enrollmentDate: 1_700_000_000_000_000_000n,
  });
  expect(student).toMatchObject({ name: "ئاراس", classId: [created.id] });

  const students = await actor.listStudents([], []);
  expect(students).toContainEqual(expect.objectContaining({ id: student.id, name: "ئاراس" }));

  const classes = await actor.listClasses();
  expect(classes).toContainEqual(expect.objectContaining({ id: created.id, studentCount: 1n }));
});

it("filters students by name and by class", async () => {
  const cls = await actor.createClass({ name: "پۆلی ١١", subject: "فیزیا" });
  await actor.createStudent({ name: "دلێر", classId: [cls.id], enrollmentDate: 0n });
  await actor.createStudent({ name: "هێمن", classId: [], enrollmentDate: 0n });

  const byName = await actor.listStudents(["دلێر"], []);
  expect(byName.map((s) => s.name)).toEqual(["دلێر"]);

  const byClass = await actor.listStudents([], [cls.id]);
  expect(byClass.map((s) => s.name)).toEqual(["دلێر"]);
});

it("updates and deletes a student, returning null/false for missing ids", async () => {
  const created = await actor.createStudent({ name: "ڕێبەر", classId: [], enrollmentDate: 0n });

  const updated = await actor.updateStudent(created.id, {
    name: "ڕێبەر ئەحمەد",
    classId: [],
    enrollmentDate: 0n,
  });
  expect(updated).toEqual([expect.objectContaining({ id: created.id, name: "ڕێبەر ئەحمەد" })]);

  await expect(actor.deleteStudent(created.id)).resolves.toBe(true);
  await expect(actor.deleteStudent(created.id)).resolves.toBe(false);
  await expect(actor.updateStudent(created.id, { name: "x", classId: [], enrollmentDate: 0n })).resolves.toEqual([]);
});

it("renames a class and returns null for a missing id", async () => {
  const created = await actor.createClass({ name: "پۆلی ٩", subject: "ئینگلیزی" });

  const renamed = await actor.updateClass(created.id, { name: "پۆلی ٩-أ", subject: "ئینگلیزی" });
  expect(renamed).toEqual([expect.objectContaining({ id: created.id, name: "پۆلی ٩-أ" })]);

  await expect(actor.updateClass(9999n, { name: "x", subject: "y" })).resolves.toEqual([]);
});

it("unassigns students when their class is deleted", async () => {
  const cls = await actor.createClass({ name: "پۆلی ١٢", subject: "کیمیا" });
  const student = await actor.createStudent({ name: "شیلان", classId: [cls.id], enrollmentDate: 0n });

  await expect(actor.deleteClass(cls.id)).resolves.toBe(true);

  const students = await actor.listStudents([], []);
  expect(students).toContainEqual(expect.objectContaining({ id: student.id, classId: [] }));
});

it("rejects an anonymous caller on a mutating endpoint", async () => {
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    guest.createStudent({ name: "guest", classId: [], enrollmentDate: 0n }),
  ).rejects.toThrow();
});

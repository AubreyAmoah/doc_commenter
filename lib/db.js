// lib/db.js
import { MongoClient, ObjectId } from "mongodb";

let client;
let db;

async function connectToDatabase() {
  if (db) return db;

  client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db("legal-case-notes");
  return db;
}

export async function getCaseNotes(caseId) {
  const db = await connectToDatabase();
  const notes = await db
    .collection("notes")
    .find({ caseId })
    .sort({ createdAt: -1 })
    .toArray();

  return notes;
}

export async function createNote(caseId, content, createdBy) {
  const db = await connectToDatabase();
  const result = await db.collection("notes").insertOne({
    caseId,
    content,
    createdBy,
    createdAt: new Date(),
  });

  return result.insertedId;
}

export async function updateNote(id, content) {
  const db = await connectToDatabase();
  await db
    .collection("notes")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { content, updatedAt: new Date() } }
    );

  return true;
}

export async function deleteNote(id) {
  const db = await connectToDatabase();
  await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

  return true;
}

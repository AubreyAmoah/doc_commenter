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

// In your db.js file, update these functions:
export async function updateNote(id, content) {
  const db = await connectToDatabase();

  // Convert string ID to ObjectId if needed
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  await db
    .collection("notes")
    .updateOne({ _id: objectId }, { $set: { content, updatedAt: new Date() } });

  return true;
}

export async function deleteNote(id) {
  const db = await connectToDatabase();

  // Convert string ID to ObjectId if needed
  const objectId = typeof id === "string" ? new ObjectId(id) : id;

  await db.collection("notes").deleteOne({ _id: objectId });

  return true;
}

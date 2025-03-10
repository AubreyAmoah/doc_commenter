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

// In lib/db.js - Improve ObjectId handling
export async function updateNote(id, content) {
  const db = await connectToDatabase();

  // Log for debugging
  console.log("Update function - ID received:", id, "Type:", typeof id);

  let objectId;
  try {
    // Handle different ID formats
    if (typeof id === "string") {
      // If it's already a valid ObjectId string
      objectId = new ObjectId(id);
    } else if (id && id.toString) {
      // If it's already an ObjectId instance
      objectId = id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  } catch (err) {
    console.error("ObjectId conversion error:", err);
    throw new Error(`Failed to create ObjectId from: ${id}`);
  }

  try {
    const result = await db
      .collection("notes")
      .updateOne(
        { _id: objectId },
        { $set: { content, updatedAt: new Date() } }
      );

    console.log("Update result:", result);
    return result.modifiedCount > 0;
  } catch (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }
}

// Similarly update the deleteNote function
export async function deleteNote(id) {
  const db = await connectToDatabase();

  console.log("Delete function - ID received:", id);

  let objectId;
  try {
    if (typeof id === "string") {
      objectId = new ObjectId(id);
    } else if (id && id.toString) {
      objectId = id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  } catch (err) {
    console.error("ObjectId conversion error:", err);
    throw new Error(`Failed to create ObjectId from: ${id}`);
  }

  try {
    const result = await db.collection("notes").deleteOne({ _id: objectId });
    console.log("Delete result:", result);
    return result.deletedCount > 0;
  } catch (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }
}

import * as admin from "firebase-admin";
import config from "../../../config";
const firestore = admin.firestore();

// Doesn't need to be user configurable
const batchSize = config.backfillOptions.batchSize;

export const getDocumentsBatch = async (
  lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null
) => {
  let query = firestore
    .collection(config.backfillOptions.collectionPath)
    .orderBy("__name__")
    .select("__name__")
    .limit(batchSize);

  if (lastDoc) query = query.startAfter(lastDoc);

  const snapshot = await query.get();
  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { snapshot, newLastDoc };
};

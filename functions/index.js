const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

async function assertAdmin(uid) {
  if (!uid) throw new HttpsError('unauthenticated', 'Login required.');
  const user = await admin.auth().getUser(uid);
  if (user.customClaims?.admin !== true) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }
}

exports.approveOrder = onCall(async (request) => {
  const { auth, data } = request;
  await assertAdmin(auth?.uid);

  const orderId = data?.orderId;
  if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required.');

  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found.');

  const order = orderSnap.data();
  const subjectId = order.subjectId || order.productId;
  if (!subjectId || !order.userId) {
    throw new HttpsError('failed-precondition', 'Order is missing subject or user data.');
  }

  const subjectSnap = await db.collection('subjects').doc(subjectId).get();
  const subject = subjectSnap.exists ? subjectSnap.data() : {};
  const purchaseRef = db.collection('purchases').doc(`${order.userId}_${subjectId}`);

  await db.runTransaction(async (tx) => {
    const freshOrder = await tx.get(orderRef);
    if (!freshOrder.exists) throw new HttpsError('not-found', 'Order not found.');
    if (freshOrder.data().status !== 'pending_approval') {
      throw new HttpsError('failed-precondition', 'Only pending orders can be approved.');
    }

    tx.update(orderRef, {
      status: 'approved',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: auth.uid
    });

    tx.set(
      purchaseRef,
      {
        userId: order.userId,
        userEmail: order.userEmail || '',
        subjectId,
        subjectName: order.subjectName || subject.name || '',
        orderId,
        amount: order.amount || subject.price || 0,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        downloadCount: 0
      },
      { merge: true }
    );
  });

  return { ok: true };
});

exports.rejectOrder = onCall(async (request) => {
  const { auth, data } = request;
  await assertAdmin(auth?.uid);

  const orderId = data?.orderId;
  if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required.');

  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found.');
  if (orderSnap.data().status !== 'pending_approval') {
    throw new HttpsError('failed-precondition', 'Only pending orders can be rejected.');
  }

  await orderRef.update({
    status: 'rejected',
    rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
    rejectedBy: auth.uid
  });

  return { ok: true };
});

exports.getDownloadUrl = onCall(async (request) => {
  const { auth, data } = request;
  const documentId = data?.documentId;
  if (!documentId) throw new HttpsError('invalid-argument', 'documentId is required.');

  const documentSnap = await db.collection('documents').doc(documentId).get();
  if (!documentSnap.exists) throw new HttpsError('not-found', 'Document not found.');

  const documentData = documentSnap.data();
  if (documentData.active === false) throw new HttpsError('permission-denied', 'Document is not active.');
  if (!documentData.filePath) throw new HttpsError('failed-precondition', 'Document file is missing.');

  const subjectSnap = await db.collection('subjects').doc(documentData.subjectId).get();
  if (!subjectSnap.exists) throw new HttpsError('not-found', 'Subject not found.');

  const subject = subjectSnap.data();
  if (subject.active === false) throw new HttpsError('permission-denied', 'Subject is not active.');

  const isFree = subject.isPaid === false || documentData.isFreePreview === true;
  if (!isFree) {
    if (!auth?.uid) throw new HttpsError('unauthenticated', 'Login required for paid downloads.');
    const purchaseSnap = await db.collection('purchases').doc(`${auth.uid}_${documentData.subjectId}`).get();
    if (!purchaseSnap.exists) {
      throw new HttpsError('permission-denied', 'Admin approval is required before download.');
    }
  }

  const [url] = await bucket.file(documentData.filePath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 10 * 60 * 1000
  });

  if (auth?.uid) {
    await db.collection('downloadLogs').add({
      userId: auth.uid,
      documentId,
      subjectId: documentData.subjectId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  if (!isFree && auth?.uid) {
    await db.collection('purchases').doc(`${auth.uid}_${documentData.subjectId}`).set(
      { downloadCount: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );
  }

  return {
    url,
    fileName: documentData.fileName || documentData.title || 'document'
  };
});

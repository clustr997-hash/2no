const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.approveOrder = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'Login required.');

  const orderId = data?.orderId;
  if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required.');

  const user = await admin.auth().getUser(auth.uid);
  const isAdmin = (user.customClaims && user.customClaims.admin) || false;
  if (!isAdmin) throw new HttpsError('permission-denied', 'Admin access required.');

  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found.');

  const order = orderSnap.data();
  await db.runTransaction(async (tx) => {
    tx.update(orderRef, {
      status: 'approved',
      approvedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const purchaseRef = db.collection('purchases').doc();
    tx.set(purchaseRef, {
      userId: order.userId,
      productId: order.productId,
      orderId,
      purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      downloadCount: 0
    });
  });

  return { ok: true };
});

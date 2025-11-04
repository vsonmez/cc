# Security Checklist - Homework Tracker Web App

## 🔒 Current Security Status

### ✅ Implemented (Secure)

1. **Firebase Configuration**
   - ✅ Main app uses environment variables (`.env` file)
   - ✅ Service worker has necessary hardcoded API key
   - ✅ No sensitive data exposed beyond what's required

2. **Firestore Security Rules**
   - ✅ FCM tokens are write-only (clients can create/update but not read)
   - ✅ All other collections deny public access by default
   - ✅ Token deletion only allowed from Cloud Functions
   - File: `firestore.rules`

3. **Code Structure**
   - ✅ Proper error handling in notification hooks
   - ✅ Service worker ready check before FCM token generation
   - ✅ Auto-migration of existing FCM tokens to Firestore

### ⚠️ Needs Action (Follow Security Guide)

1. **Google Cloud API Key Restrictions**
   - ⚠️ Add HTTP referrer restrictions
   - ⚠️ Add API restrictions to FCM only
   - 📄 Follow: `FIREBASE_SECURITY_GUIDE.md`

---

## 📋 Security Verification Steps

### Step 1: Verify Firestore Rules

```bash
firebase deploy --only firestore:rules
```

Expected output: Rules deployed successfully

### Step 2: Check FCM Token Collection

1. Go to: https://console.firebase.google.com/project/homework-tracker-3bc75/firestore/databases/-default-/data/~2FfcmTokens
2. Verify tokens have these fields:
   - `token` (string)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)
   - `userAgent` (string)
3. No unexpected fields or documents

### Step 3: Test Notifications

1. **Local Development:**
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173/settings
   - Grant notification permission
   - Click "Test Et" button
   - Should receive notification

2. **Production:**
   - Open https://cc-two-smoky.vercel.app/settings
   - Test notifications
   - Check browser console for errors

### Step 4: Monitor Firebase Usage

1. Go to: https://console.firebase.google.com/project/homework-tracker-3bc75/usage
2. Check for unusual spikes in:
   - Cloud Messaging API calls
   - Cloud Functions invocations
   - Firestore reads/writes
3. Set up usage alerts if on Blaze plan

---

## 🔐 Security Best Practices Applied

### 1. Principle of Least Privilege
- Firestore rules deny all by default
- FCM tokens only writable, not readable
- API key will be restricted to specific domains and APIs

### 2. Defense in Depth
- Environment variables for main app config
- Firestore security rules
- API key restrictions
- HTTP referrer validation

### 3. Secure Data Storage
- No sensitive user data stored in localStorage
- FCM tokens stored in Firestore with timestamps
- No personal information in notification payloads

### 4. Service Worker Security
- Only handles notification display
- No sensitive operations in background
- Proper origin checks for notification clicks

---

## 🚨 What to Monitor

### Daily Checks
- [ ] Firebase Console usage metrics
- [ ] Firestore document counts in `fcmTokens`
- [ ] Cloud Functions invocation logs

### Weekly Checks
- [ ] Google Cloud Console security alerts
- [ ] Firestore security rules are still deployed
- [ ] No unexpected API key restrictions changes

### Monthly Checks
- [ ] Review all FCM tokens (clean up old/invalid ones)
- [ ] Update Firebase SDK versions if available
- [ ] Review Cloud Functions logs for errors

---

## 📞 Security Incident Response

If you notice unusual activity:

1. **Immediate Actions:**
   - Check Firebase Console for unexpected usage spikes
   - Review Firestore data for unauthorized writes
   - Check Cloud Functions logs for suspicious invocations

2. **Investigation:**
   - Review recent changes to security rules
   - Check API key restrictions in Google Cloud Console
   - Verify no unauthorized users in Firebase Authentication (if enabled)

3. **Mitigation:**
   - Update Firestore security rules if needed
   - Regenerate API key if absolutely necessary (last resort)
   - Review and update HTTP referrer restrictions

4. **Prevention:**
   - Set up Firebase usage alerts
   - Enable Firebase App Check (additional protection)
   - Regular security rule audits

---

## 🔗 Important Links

- **Firebase Console:** https://console.firebase.google.com/project/homework-tracker-3bc75
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Firestore Rules:** https://console.firebase.google.com/project/homework-tracker-3bc75/firestore/rules
- **Cloud Functions:** https://console.firebase.google.com/project/homework-tracker-3bc75/functions
- **Usage & Billing:** https://console.firebase.google.com/project/homework-tracker-3bc75/usage

---

## 📚 Security Documentation

- `FIREBASE_SECURITY_GUIDE.md` - Step-by-step API key restriction guide
- `firestore.rules` - Database security rules
- `public/firebase-messaging-sw.js` - Service worker configuration

---

## ✅ Security Audit Summary

**Last Reviewed:** 2025-11-02

**Status:**
- ✅ Code-level security: SECURE
- ⚠️ API key restrictions: PENDING (user action required)
- ✅ Firestore rules: SECURE
- ✅ Service worker: SECURE

**Next Steps:**
1. User follows `FIREBASE_SECURITY_GUIDE.md` to add API key restrictions
2. Verify notifications still work after restrictions added
3. Monitor Firebase usage for 1 week
4. Security audit complete ✅

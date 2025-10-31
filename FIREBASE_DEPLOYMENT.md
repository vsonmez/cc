# Firebase Cloud Functions Deployment Guide

## 📋 Overview
This guide will help you deploy Firebase Cloud Functions that send daily homework reminder notifications even when the app is closed.

## ✅ Prerequisites (Already Done)
- ✅ Blaze plan activated
- ✅ Firestore database created
- ✅ Service Account key generated
- ✅ Functions code written

---

## 🚀 Deployment Steps

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

### 3. Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Deploy Firestore Rules (First Time Only)

```bash
firebase deploy --only firestore:rules
```

This will set up security rules for the FCM tokens collection.

### 5. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This will:
- Build the TypeScript code
- Upload functions to Google Cloud
- Set up the scheduled job (daily at 18:00 Turkey time)

Expected output:
```
✔  functions[sendDailyReminders] Successful create operation.
✔  functions[testNotification] Successful create operation.
Function URL (testNotification): https://europe-west1-homework-tracker-3bc75.cloudfunctions.net/testNotification
```

### 6. Enable Cloud Scheduler API

After first deployment, you may see this error:
```
HTTP Error: 400, Cloud Scheduler API has not been enabled
```

**Fix:**
1. Go to: https://console.cloud.google.com/apis/library/cloudscheduler.googleapis.com?project=homework-tracker-3bc75
2. Click **ENABLE**
3. Wait 1-2 minutes
4. Run `firebase deploy --only functions` again

---

## 🧪 Testing

### Test 1: Manual HTTP Test

Visit this URL in your browser (replace with your actual URL from deployment):
```
https://europe-west1-homework-tracker-3bc75.cloudfunctions.net/testNotification
```

You should:
1. See a JSON response with success count
2. Receive a test notification on your device (even if app is closed!)

### Test 2: Check Firestore

1. Go to Firebase Console → Firestore Database
2. Check the `fcmTokens` collection
3. You should see your device's FCM token saved

### Test 3: View Function Logs

```bash
firebase functions:log
```

Or in Firebase Console → Functions → Logs

---

## ⏰ Scheduled Function Details

**Function Name:** `sendDailyReminders`

**Schedule:** Every day at 18:00 Turkey time (Europe/Istanbul)

**What it does:**
1. Fetches all FCM tokens from Firestore
2. Sends push notifications to all registered devices
3. Cleans up invalid/expired tokens automatically

**Cron Expression:** `0 18 * * *`
- `0` = minute 0
- `18` = hour 18 (6 PM)
- `* * *` = every day, month, day of week

---

## 🔧 Common Issues

### Issue 1: "Permission denied" error
**Solution:** Make sure you're logged in with the correct Google account:
```bash
firebase logout
firebase login
```

### Issue 2: "Project not found"
**Solution:** Check `.firebaserc` file contains correct project ID:
```json
{
  "projects": {
    "default": "homework-tracker-3bc75"
  }
}
```

### Issue 3: "Cloud Scheduler API not enabled"
**Solution:** See step 6 above - enable the API in Google Cloud Console

### Issue 4: No notifications received
**Check:**
1. FCM token saved to Firestore? (Check Firebase Console)
2. Function deployed successfully? (`firebase functions:list`)
3. Check function logs: `firebase functions:log`
4. Test with HTTP endpoint first

---

## 📊 Monitoring

### View Function Metrics
Firebase Console → Functions → `sendDailyReminders` → Metrics

Shows:
- Invocations per day
- Execution time
- Errors
- Memory usage

### View Function Logs
```bash
firebase functions:log --only sendDailyReminders
```

Or in Firebase Console → Functions → Logs

### Check Scheduled Jobs
```bash
firebase functions:config:get
```

---

## 💰 Cost Estimation

**Free Tier (Blaze Plan):**
- Cloud Functions: 2,000,000 invocations/month FREE
- Cloud Scheduler: 3 jobs/month FREE

**Your Usage:**
- 1 scheduled function = 1 job
- Runs once per day = 30 invocations/month
- HTTP test function = pay per invocation (but minimal)

**Estimated cost: $0/month** (well within free tier!)

---

## 🔄 Updating Functions

After making changes to `functions/src/index.ts`:

```bash
cd functions
npm run build  # Test build locally
cd ..
firebase deploy --only functions
```

---

## 🗑️ Cleanup (If Needed)

To delete all functions:
```bash
firebase functions:delete sendDailyReminders
firebase functions:delete testNotification
```

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console → Functions → Logs
2. Run `firebase functions:log`
3. Check Firestore rules are deployed: `firebase deploy --only firestore:rules`

---

## ✅ Success Checklist

After deployment, verify:

- [ ] `firebase deploy --only functions` completed successfully
- [ ] Cloud Scheduler API is enabled
- [ ] Test notification URL works
- [ ] FCM tokens visible in Firestore
- [ ] Function logs show no errors
- [ ] Received test notification on device (app closed)

---

## 🎉 You're Done!

Once deployed:
- ✅ Users will receive daily reminders at 18:00 Turkey time
- ✅ Notifications work even when app is completely closed
- ✅ Invalid tokens are automatically cleaned up
- ✅ System scales to unlimited users (within free tier)

Enjoy your automated homework reminder system! 🎓📚

# Firebase API Key Security Guide

## ⚠️ Important: This is NOT a security vulnerability!

The Firebase API key in `public/firebase-messaging-sw.js` being publicly visible is **completely normal and safe** for Firebase web applications. Google's documentation explicitly states this is expected behavior.

However, you received a security warning from Google because the API key currently has **no restrictions**, which means anyone could use it for any Google Cloud service. We need to add restrictions.

## 🔒 Solution: Add API Key Restrictions (DO NOT Regenerate!)

### Why NOT regenerate the key?
- The key is already in use by deployed service workers
- Service workers cache for long periods
- Existing users would lose notifications
- The key is MEANT to be public - it just needs restrictions

---

## Step-by-Step Instructions

### Step 1: Access Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project: **homework-tracker-3bc75**
3. Find the API key: **AIzaSyDy2K4n2HAqCxoqTwfSrUme7bIxcJW6sRA**
4. Click the **Edit** button (pencil icon)

### Step 2: Add Application Restrictions

In the "Application restrictions" section:

1. Select: **HTTP referrers (web sites)**
2. Click **ADD AN ITEM** and add these referrers:

```
https://cc-two-smoky.vercel.app/*
https://*.vercel.app/*
http://localhost:*
http://localhost:5173/*
http://127.0.0.1:*
```

**Why these domains?**
- `https://cc-two-smoky.vercel.app/*` - Your production Vercel app
- `https://*.vercel.app/*` - Any Vercel preview deployments
- `http://localhost:*` - Local development (all ports)
- `http://localhost:5173/*` - Vite dev server specifically
- `http://127.0.0.1:*` - Alternative localhost address

### Step 3: Add API Restrictions

In the "API restrictions" section:

1. Select: **Restrict key**
2. Click **Select APIs** dropdown
3. Enable ONLY these APIs:
   - ✅ **Cloud Messaging** (for push notifications)
   - ✅ **Firebase Cloud Messaging API** (if available)
   - ✅ **Firebase Installations API** (for FCM token registration)
   - ✅ **Identity Toolkit API** (if you're using Firebase Auth)

**Important:** Do NOT enable unnecessary APIs like Compute Engine, Cloud Storage, etc.

### Step 4: Save Changes

1. Click **SAVE** at the bottom
2. Wait 5-10 minutes for changes to propagate globally
3. Test notifications on your web app

---

## ✅ Verification Steps

After adding restrictions:

1. **Test Local Development:**
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173
   - Go to Settings
   - Click "Bildirimlere İzin Ver" (if not already granted)
   - Click "Test Et"
   - You should receive a notification

2. **Test Production:**
   - Open https://cc-two-smoky.vercel.app
   - Go to Settings
   - Test notifications
   - Check FCM token is generated

3. **Check for Errors:**
   - Open browser console (F12)
   - Look for any API key errors
   - Should see ✅ messages, not ❌ errors

---

## 🔍 Additional Security Checks

### Check Firebase Console Usage

1. Go to: https://console.firebase.google.com/project/homework-tracker-3bc75/usage
2. Look for unexpected spikes in:
   - Cloud Messaging API calls
   - Firebase Cloud Functions invocations
   - Firestore reads/writes
3. Verify usage matches your expected traffic

### Check Billing (if enabled)

1. Go to: https://console.cloud.google.com/billing
2. Select project: homework-tracker-3bc75
3. Check for unexpected charges
4. Current plan: Spark (Free) or Blaze (Pay-as-you-go)?

### Review Firestore Security Rules

Your current Firestore rules only allow:
- Reading FCM tokens: Anyone can read (needed for service worker)
- Writing FCM tokens: Anyone can write (needed for registration)
- Children/Tasks: No public access (good!)

If you see unexpected data in Firestore, review rules in:
`firestore.rules`

---

## 📱 Why the API Key MUST Be Public

### For Firebase Web Apps:

1. **Service Workers run in browser** - They can't access server-side environment variables
2. **Service Workers are static files** - They're cached and served directly
3. **Firebase designed for this** - The API key is designed to be public with restrictions

### What Protects Your App:

1. **HTTP Referrer Restrictions** - Only your domains can use the key
2. **API Restrictions** - Key only works for Firebase Messaging APIs
3. **Firestore Security Rules** - Protect your data from unauthorized access
4. **Firebase App Check** (optional) - Additional layer to prevent abuse

---

## 🚨 What to Monitor

Keep an eye on:

1. **Unusual Firestore writes** - Check `fcmTokens` collection for spam
2. **High function invocations** - Cloud Functions usage spikes
3. **Security warnings from Google** - After adding restrictions, you shouldn't get more warnings

---

## 📚 Official Documentation

- [Firebase Web API Key Safety](https://firebase.google.com/docs/projects/api-keys)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)

---

## ✨ Summary

- ✅ API key in `firebase-messaging-sw.js` is **SAFE** when restricted
- ✅ Add **HTTP referrer restrictions** for your domains
- ✅ Add **API restrictions** for FCM only
- ✅ Do **NOT** regenerate the key
- ✅ Test after 5-10 minutes for changes to propagate
- ✅ Monitor usage in Firebase Console

The security warning will go away once you add these restrictions!

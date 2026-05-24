# Firebase setup for EG GarageFlow

Use this when moving the app from the sample Firebase project to your own Firebase project.

## 1. Create the Firebase project

1. Go to the Firebase console and create a project.
2. Add an Android app with this package name:

```text
com.eggarageflow.app
```

3. Download the generated `google-services.json`.
4. Replace this file in the repo:

```text
app/google-services.json
```

5. In Firebase Authentication, enable **Email/Password** sign-in.
6. In Firestore Database, create a database.

## 2. Create login accounts

Create the users in Firebase Authentication first. Suggested starter accounts:

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | admin@eggarageflow.com | Choose your own password |
| MECHANIC | mechanic@eggarageflow.com | Choose your own password |

After creating each Auth user, copy its Firebase **User UID**.

## 3. Create matching Firestore user profiles

The app signs in with Firebase Auth, then reads the profile from:

```text
users/{Firebase Auth UID}
```

Create one Firestore document for each Auth user. The document ID must be exactly the Auth UID.

Admin example:

```json
{
  "id": "PASTE_ADMIN_AUTH_UID_HERE",
  "name": "Garage Admin",
  "initials": "GA",
  "role": "ADMIN"
}
```

Mechanic example:

```json
{
  "id": "PASTE_MECHANIC_AUTH_UID_HERE",
  "name": "Garage Mechanic",
  "initials": "GM",
  "role": "MECHANIC"
}
```

Valid role values are `ADMIN` and `MECHANIC`.

## 4. Publish Firestore rules

Use `firestore.rules` from this repo. The rules allow signed-in users to use the workshop data, while user/profile management and deletes are admin-only.

If you use the Firebase CLI:

```powershell
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
```

You can also paste the contents of `firestore.rules` into the Firebase console under **Firestore Database > Rules**.

## 5. Run the app

After replacing `app/google-services.json`, rebuild and reinstall the app:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
.\gradlew.bat installDebug
```

Then log in with one of the Auth email/password accounts you created.

## Common login errors

- `User profile not found in database`: the Auth account exists, but `users/{uid}` is missing or the document ID is not the Auth UID.
- `No enum constant`: the Firestore `role` is not `ADMIN` or `MECHANIC`.
- Firebase project mismatch: `app/google-services.json` still points to the old Firebase project.

# EG GarageFlow

EG GarageFlow is a Kotlin/Jetpack Compose Android prototype for managing garage vehicle check-ins, mechanic tasks, repair progress, profiles, and admin service reports.

## What the system does

- Allows users to log in using Firebase Authentication.
- Routes users by role to the correct dashboard.
- Lets garage staff register a vehicle job with license plate, model, odometer reading, condition notes, and repair tasks.
- Lets mechanics start work, add repair notes, finish tasks, and finalize completed jobs.
- Lets admins view workshop statistics, search vehicle jobs, open service timelines, print reports, and share service reports.
- Supports light, dark, and system theme preference from the profile screen.

## UI identity

The interface was restyled for this assignment with a new EG GarageFlow identity:

- Brand name changed to **EG GarageFlow**.
- Color system changed to teal, navy, soft card backgrounds, and clean status colours.
- Buttons, cards, input fields, chips, dialogs, bottom navigation, and reports were visually refreshed.
- A new custom vector logo was added.
- The functionality, navigation flow, ViewModels, repositories, Firebase usage, and business logic were kept the same.

## How to run

1. Open the project folder in Android Studio.
2. Let Gradle sync finish.
3. For your own backend, follow `FIREBASE_SETUP.md` and replace `app/google-services.json` with your Firebase Android config.
4. Open `app/src/main/res/values/strings.xml` to confirm the app name is **EG GarageFlow**.
5. Connect an emulator or Android phone.
6. Click **Run**.

## Main modules

- `app` - Android app entry point and navigation.
- `core:model` - shared data models.
- `core:domain` - repository interfaces.
- `core:data` - Firebase repository implementations and mappers.
- `core:ui` - reusable theme, logo, buttons, text fields, cards, and chips.
- `feature:auth` - login and profile screens.
- `feature:checkin` - vehicle job intake screen.
- `feature:mechanic` - repair queue and service detail screens.
- `feature:admin` - admin overview and service timeline/report screen.

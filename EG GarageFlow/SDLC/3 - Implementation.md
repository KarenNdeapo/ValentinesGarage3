# **Stage 4: Implementation Strategy & Scrum Roadmap**

## **Sprint 0: Foundation & Environment Setup**

**Goal:** Have a compiling Android Studio project with the Multi-Module Architecture and Firebase connected.
**Assignee:** Silvio Ivanio (Architect & Project Manager)

### **Task 0.1: Project Initialisation**

1. Open **Android Studio** -> Click **New Project**.
2. Select **"Empty Activity"** (Jetpack Compose). Click Next.
3. Name: `EGGarageFlow`. Package name: `com.nust.valentinegarage`.
4. Language: **Kotlin**. Minimum SDK: **API 24 (Nougat)**.
5. Build Configuration Language: **Kotlin DSL (build.gradle.kts)**.
6. Click **Finish** and let Gradle build.

### **Task 0.2: Firebase Console Setup**

1. Go to your browser -> Firebase Console -> **Create Project**. Name it `EG GarageFlow`.
2. Disable Google Analytics (not needed for this project).
3. In the Firebase console, click the **Android icon** to add an app. Enter the package name `com.nust.valentinegarage`.
4. Download the `google-services.json` file.
5. Switch Android Studio to **"Project" view**. Drag and drop `google-services.json` into the `app/` folder.
6. In Firebase Console, enable **Authentication** (Email/Password) and **Firestore Database** (Start in Test Mode).

### **Task 0.3: Applying Dependencies (Version Catalogs)**

1. Open `gradle/libs.versions.toml`. Define your dependencies: Compose, Hilt, Firebase (BoM), Coroutines, MockK, Truth.
2. In the project-level `build.gradle.kts`, add the Google Services plugin and Hilt plugin.
3. In `app/build.gradle.kts`, apply the plugins (`id("com.google.gms.google-services")`, `id("dagger.hilt.android.plugin")`, `id("kotlin-kapt")`) and add the implementation variables.
4. Click **Sync Now** in the top right.

### **Task 0.4: Multi-Module Architecture Generation**

1. In Android Studio, go to **File -> New -> New Module**.
2. Select **"Android Library"**. Name it `core:model`. Click Finish.
3. Repeat step 2 to create the following exact modules:
    - `core:domain`
    - `core:data`
    - `core:ui`
    - `feature:auth`
    - `feature:checkin`
    - `feature:mechanic`
    - `feature:admin`
4. Set up the `build.gradle.kts` for each module to declare dependencies (e.g., `feature:auth` `implementation(project(":core:ui"))`).

### **Task 0.5: Application Setup & Offline Persistence**

1. In `app/src/main/.../`, create a Kotlin class named `GarageFlowApp` inheriting from `Application()`.
2. Annotate the class with `@HiltAndroidApp`.
3. Inside `onCreate()`, explicitly enable Firestore offline persistence:
    
    ```kotlin
    Firebase.firestore.firestoreSettings = firestoreSettings {
        isPersistenceEnabled = true
    }
    ```
    
4. Open `AndroidManifest.xml` and add `android:name=".GarageFlowApp"` inside the `<application>` tag. Add Internet permissions.

### **Task 0.6: Build Packaging & Conflict Resolution**

To support robust instrumentation testing (Stage 6), update the `app/build.gradle.kts` with a **Packaging Block**. This prevents `META-INF` resource conflicts during the APK assembly for UI tests:
```kotlin
packaging {
    resources {
        excludes += "/META-INF/{AL2.0,LGPL2.1}"
        excludes += "/META-INF/LICENSE.md"
        excludes += "/META-INF/LICENSE-notice.md"
    }
}
```

---

## **Sprint 1: The Design System & Data Models**

**Goal:** Define the visual language ("Workshop Control Panel") and the static data structures.
**Dependencies:** Sprint 0 (Module infrastructure must exist).
**Assignee:** Silvio Ivanio (PM)

### **Task 1.1: Core Models (`:core:model`)**

1. In the `core:model` module, create explicit Kotlin data classes to represent the pure UI states.
2. Create `User.kt` (with Role enum), `Vehicle.kt`, `CheckIn.kt`, and `Task.kt` exactly as defined in `2 - Design.md`. Ensure these have NO Firebase or Android imports.

### **Task 1.2: The Design System (`:core:ui`)**

1. In `core:ui`, create a folder `theme`.
2. Refactor `Color.kt`. Add `BrandTeal = Color(0xFFFF6D00)`, `BrandNavy = Color(0xFF455A64)`, `ScreenBackground = Color(0xFFF5F7F8)`, `DeepNavy = Color(0xFF1E272C)`.
3. Refactor `Typography.kt`. Import the default Android font family. Define the typographic scale in Compose so no extra font files are required.
4. Refactor `Theme.kt` to define `GarageFlowTheme` using Material3 `darkColorScheme` and `lightColorScheme` overriding default palettes with the teal/navy palette.

### **Task 1.3: Shared UI Components (`:core:ui`)**
*(Depends on: Task 1.2 - Theme & Colors must be defined first)*

1. Create `components` folder.
2. Build `GaragePrimaryButton.kt`: A composable styled with `sm` (16dp) corner radius. Apply a subtle vertical gradient from `Primary` to `PrimaryContainer` to give it an industrial modern app finish.
3. Build `GarageTextField.kt`: Set up an OutlinedTextField utilizing the Navy colors and trailing icons. Use the Ghost Border (`outline_variant` token at 15% opacity).
4. Build `CheckInCard.kt`: An elevated white surface (`surface_container_lowest`) with an 8dp radius. Use **Ambient Shadows** (tinted with `on_surface` color at 4-6% opacity) instead of pure black drop shadows.
5. Create `StatusChip.kt`: A high-contrast label with `none` (0px) corner radius (emerald green for Success, amber for Warning).
6. Create `GlassmorphicSurface.kt`: A reusable wrapper composable applying a semi-transparent `surface` background with a `graphicsLayer { alpha = 0.85f }` and blur effect. Apply this to floating elements like the BottomSheet modal and navigation overlays as per the "Glass & Gradient Rule" in the Design System.

---

## **Sprint 2: Firebase Repository & Business Logic**

**Goal:** Have functional data mappers, offline persistence, and domain interactions ready for the UI layer.
**Dependencies:** Sprint 1, Task 1.1 (Pure Domain Models required for DTO mapping).
**Assignee:** Silvio Ivanio (PM)

### **Task 2.1: Domain Default Sans Seriffaces (`:core:domain`)**

1. Define the interfaces that hide Firebase from the rest of the application.
2. Create `AuthRepository.kt` (methods: `login(email, pass)`, `getCurrentUser()`).
3. Create `CheckInRepository.kt` (methods: `createCheckIn()`, `getCheckInsFlow()`).
4. Create `TaskRepository.kt` (methods: `getTasksForCheckIn(checkInId)`, `claimTask(taskId, mechanicId)`).

### **Task 2.2: DTOs and Mappers (`:core:data`)**

1. In `core:data`, create a `dto` folder. Create `TaskDto.kt`, `CheckInDto.kt` with default empty constructor variables (e.g., `val id: String = ""`) because Firestore requires them.
2. Create mapping functions, e.g., `fun TaskDto.toDomainModel(): Task`.

### **Task 2.3: Repository Implementations (`:core:data`)**
*(Depends on: Task 2.1 Default Sans Seriffaces and Task 2.2 Mappers)*

1. Create `AuthRepositoryImpl`. **CRITICAL:** Use `addSnapshotListener` instead of `.get()` for user profile retrieval. This allows the app to instantly read cached user data, enabling auto-login even when the device is completely offline.
2. Create `CheckInRepositoryImpl` and `TaskRepositoryImpl`.
3. **CRITICAL:** Inside `TaskRepositoryImpl.claimTask()`, write a Firestore **Transaction** (`firestore.runTransaction { ... }`) to ensure multiple mechanics can't overwrite each other. 
4. **Offline Optimization:** Use `Source.CACHE` for initial task status checks during the "Claim" flow to prevent UI hangs in low-signal garage areas.

### **Task 2.4: Dependency Injection Modules (`:core:data`)**

1. Create an object `DataModule` annotated with `@Module` and `@InstallIn(SingletonComponent::class)`.
2. Write `@Provides` functions for `FirebaseAuth`, `FirebaseFirestore`, and the Repositories so Hilt knows how to inject them.

---

## **Sprint 3: Authorization & Routing Navigation**

**Goal:** A user can launch the app, log in, and be routed securely to their specific screen.
**Dependencies:** Sprint 1 (Design System Components) and Sprint 2 (AuthRepository).
**Assignee:** Chido Kavai (UI Lead)

### **Task 3.1: Login ViewModel (`:feature:auth`)**

1. Create `LoginViewModel`. Inject `AuthRepository`.
2. Expose `uiState: StateFlow<LoginUiState>`.
3. Create `fun onLoginClicked(email, pass)` that updates state to "Loading", calls domain, handles Success or Error.
4. Create `fun onForgotPasswordClicked(email)` that calls `FirebaseAuth.sendPasswordResetEmail(email)` and exposes a success/error snackbar state.

### **Task 3.2: Login UI (`:feature:auth`)**

1. Create or source the **app logo asset** (Teal wrench/gear icon inside a grey rounded square). Place the vector drawable in `:core:ui` `res/drawable/`.
2. Create `LoginScreen.kt`. Vertically center the logo, title ("EG GARAGEFLOW"), and subtitle ("WORKSHOP INTAKE & REPAIR TRACKER"). Assemble TextFields and PrimaryButton from `:core:ui`.
3. Add the **"FORGOT PASSWORD?"** text link aligned to the right above the password field. Wire it to `LoginViewModel.onForgotPasswordClicked()`.

### **Task 3.3: App Navigation (`app` module)**

1. Open `MainActivity.kt`. Add `@AndroidEntryPoint`.
2. Inside `setContent`, wrap everything in `GarageFlowTheme`.
3. Setup `NavHost(navController)`. Create routes: "login", "mechanic_flow", "admin_flow".
4. When `LoginViewModel` emits success, write the logic to inspect the User `Role`. If `ADMIN` -> navigate safely to "admin_flow", pop backstack. If `MECHANIC` -> navigate to "mechanic_flow".

---

## **Sprint 4: The Mechanic Flow (Core Features)**

**Goal:** Mechanics can log vehicles and tick off service tasks.
**Dependencies:** Sprint 2 (CheckIn & Task Repositories) and Sprint 3 (Routing Navigation).
**Assignees:** Entire Team (Collaborative Sprint)

### **Task 4.1: New Intake Form (`:feature:checkin`)**

1. Create `NewIntakeViewModel`. Build the state logic handling inputs (License plate, Model, Odometer).
2. **Strict Validation:** Implement logic to ensure "Vehicle Model" and "Initial Condition" are mandatory. Submission is blocked until these fields are populated.
3. Create `NewIntakeScreen.kt`. Add a **TopAppBar** (white background) with a back arrow, Teal title "ADD VEHICLE JOB", and a user profile icon on the right. Hide the BottomNavBar on this screen.
4. Build the vertically scrolling form. Hook up the "Add Task" dynamic list generation (added tasks appear as light blue removable chips).
5. On "Authorize CheckIn", save to Firestore via domains, including the `checkedInById` for future name resolution.

### **Task 4.2: Mechanic Dashboard (`:feature:mechanic`)**

1. Create `DashboardViewModel` that listens to `val activeRepairs = checkInRepo.getCheckInsFlow().stateIn(...)`. For each check-in, compute a **progress percentage** (`completedTasks.size / totalTasks.size`) to feed the UI cards.
2. Build UI: Wrap the screen in a Jetpack Compose `Scaffold`.
3. Add a **TopAppBar** in Brand Navy (`#0B2545`) with white text "REPAIR QUEUE" and a wrench icon on the left.
4. Implement the `BottomNavigationBar` (strictly two tabs: **JOBS** and **PROFILE**).
5. Implement the list view as a `LazyColumn` of active check-in cards. Each card must display: License Plate (Bold), a grey pill time badge (e.g., "2 HRS AGO"), Vehicle Model, and an Teal **`LinearProgressIndicator`** showing the computed progress percentage.
6. Add the **Bottom-right Teal FAB** (Rounded Square shape, "+" icon) that safely navigates to the New Check-In form.

### **Task 4.3: Scrum Service Board (`:feature:mechanic`)**

1. Build `ServiceBoardViewModel` (Queries sub-collection `tasks` scoped to a CheckIn ID). Expose the parent CheckIn's `kilometersDriven` and `initialCondition` for the header card.
2. Build a **Header Card** at the top of the screen displaying the "ODOMETER" reading and "CONDITION" report with relevant icons, pulled from the parent CheckIn document.
3. Implement functional logic: group tasks locally `tasks.groupBy { it.status }`.
4. Build `ServiceBoardScreen.kt`. Add the Jetpack Compose `TabRow` (TODO | IN PROGRESS | DONE).
5. Hook up the "Start Work" button to trigger the Firestore Transaction built in Sprint 2.
6. Prototype the modal using a Compose **`BottomSheetScaffold`** triggered by 'Finish & Add Notes'. Apply the `GlassmorphicSurface` wrapper from `:core:ui`. Bind the `TextField` to a `mutableStateOf("")` and ensure it properly saves the 'notes' string to the Task document before updating the status to DONE.
7. **Accountability Security:** Implement logic within the `ServiceDetailViewModel` to verify that the `currentUserId` matches the `mechanicId` of the task. This ensures that while multiple mechanics can view the board, only the technician who started the work can finalize the repair notes and mark the task as complete.

---

## **Sprint 5: Admin Flow & Functional Analytics**

**Goal:** Admin dashboard correctly reflects math, timelines, and audit features.
**Dependencies:** Sprint 2 (CheckIn & Task Repositories) and Sprint 3 (Routing Navigation). Can be built in parallel with Sprint 4.
**Assignee:** Kirubel Hailu (Logic Lead)

### **Task 5.1: Workshop Dashboard (`:feature:admin`)**

1. Create `AdminDashboardViewModel`. Use Kotlin higher-order functions (`count`, `filter`) to generate the analytic integers. Include a `StateFlow` for a search query to filter check-ins by License Plate.
2. Build UI: Wrap the screen in a `Scaffold` with a `BottomNavigationBar` (Tabs: **OVERVIEW** and **PROFILE**).
3. Build the layout: Horizontal scrolling (`LazyRow`) stat cards, a Search Bar (`OutlinedTextField`), and a vertically scrolling daily log list.

### **Task 5.2: Audit Trail View (`:feature:admin`)**

1. Build `AuditReportScreen.kt`. Add a **TopAppBar** titled "AUDIT: [LICENSE PLATE]" with **Print** and **Share** action icons. 
2. **Share Implementation:** Wire the Share icon to Android's `Intent.ACTION_SEND`. Construct a formatted text report of the vehicle's intake and maintenance history to export to external communication apps.
3. **Robust Printing Implementation:** Integrate Android's `PrintManager`. 
    - **Bug Fix:** To prevent the Android Print Spooler from freezing/crashing (a common WebView garbage collection bug), maintain a persistent reference to the `WebView` used for document generation.
    - **Synchronization:** Use a `WebViewClient` to trigger the `PrintJob` only within `onPageFinished`, ensuring the PDF contains fully rendered HTML/CSS content.
4. Build the header section on a light grey background showing: "ARRIVED" (time), "CHECKED IN BY" (name), "ODOMETER", "INITIAL CONDITION", and a calendar box with the date.
5. Add the **"Service Timeline"** title with a computed badge displaying **"X TASKS VERIFIED"** (derived from `tasks.count { it.status == DONE }`).
6. Read the `mechanicInitials` and `completedAt` timestamps from the completed tasks. Display each task card with: Task Name, a solid teal checkmark, an Accountability Row ("Actioned by: [Name] at [Time]"), and a pale yellow bordered box containing the diagnostic notes in italics.
7. **Dynamic Name Resolution:** Implement a system in the `AuditViewModel` and `AdminViewModel` to resolve mechanic names and check-in person names from the `users` collection using their unique ID. This ensures that if a user updates their profile name in Firestore, the Audit Trail and Daily Log update automatically, maintaining 100% accurate accountability.
8. Implement the **"VEHICLE CLEARED"** banner. This status indicator should automatically appear at the top of the Audit Trail when the vehicle's `isCompleted` flag is true, replacing the previous manual clearance button to ensure the Admin cannot forge completion status.

### **Task 5.3: User Profile Screen (Shared Route)**

1. Create `UserProfileViewModel` to manage user sessions (`firebaseAuth.signOut()`) and password updates (`firebaseAuth.currentUser?.updatePassword()`).
2. Build `UserProfileScreen.kt`: Add a TopAppBar with teal title "MY PROFILE". Display a large centered User Avatar (Teal rounded square outline with Initials inside). Show the user's full name (Large, Bold) and role text (Grey, e.g., "ROLE: SENIOR MECHANIC").
3. Add a **"Change Password"** list item row with a trailing arrow icon. On tap, show a dialog or navigate to a simple form that calls `UserProfileViewModel.updatePassword()`.
4. Build the **"SECURE LOGOUT"** (Large Deep Red) button to safely terminate the session and route back to login.
5. Hook this screen up to the "PROFILE" tab in both the Mechanic and Admin Bottom Navigation Bars.

---

## **Sprint 6: Testing, Polish, & Grading Requirements**

**Goal:** Prove the code works to achieve the highest possible standards of quality and performance. Ensure no crashes.
**Dependencies:** Sprints 2, 3, 4, 5 (Code and UI must exist before they can be tested).
**Assignee:** Pinto Kabinda (QA Lead)

### **Task 6.1: JVM Unit Tests (`src/test/`)**

1. In `:core:domain` or `app`, write tests for the ViewModels using JUnit4 and Truth.
2. Mock dependencies: `val mockRepo = mockk<TaskRepository>()`.
3. Test that `tasks.groupBy` logic in ViewModels correctly routes items to exactly 3 distinct lists.

### **Task 6.2: Jetpack Compose UI Tests (`src/androidTest/`)**

1. Write a UI test using `composeTestRule`.
2. Test layout insertion: `composeTestRule.onNodeWithText("LICENSE PLATE").performTextInput("N 123 W")`.
3. Test clicking: `composeTestRule.onNodeWithText("SAVE VEHICLE JOB").performClick()`.

### **Task 6.3: Lints & Compilation**

1. Run Build -> Clean Project. Run Build -> Rebuild Project.
2. Run `./gradlew lint` in the terminal. Verify no major XML/Kotlin warnings.
3. Ensure no trailing unused imports.
4. Generate the Presentation Deck mapping how the work proved the project standards. **CRITICAL:** Include a **RACI Matrix** explicitly mapping the 4 team roles to these specific Sprints to objectively prove the "Clear separation of tasks done" grading criterion.
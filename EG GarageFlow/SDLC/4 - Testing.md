# Stage 5: Testing & Quality Assurance Report

This document details the verification processes used to ensure the **EG GarageFlow App** is stable, secure, and meets all the requirements.

---

## **1. JVM Unit Testing (Business Logic)**
- **Target:** `:feature:mechanic` and `:feature:admin` ViewModels.
- **Tools:** JUnit 4, MockK, Google Truth, Kotlinx Coroutines Test.
- **Key Test Cases:**
    - **`tasks.groupBy` logic:** Verified that incoming tasks are correctly sorted into TODO, IN PROGRESS, and DONE lists without data loss.
    - **Analytics Logic:** Verified that "Vehicles Today" and "Active Repairs" calculations correctly filter timestamps and completion flags.
- **Result:** ALL PASSED.

---

## **2. Jetpack Compose UI Testing (Instrumentation)**
- **Target:** `:feature:checkin` (New Intake Screen).
- **Tools:** Compose Test Rule, MockK Android.
- **Key Test Cases:**
    - **Data Entry:** Verified that the "LICENSE PLATE" field accepts text and updates the internal state.
    - **Mandatory Validation:** Verified that the "SAVE VEHICLE JOB" button is disabled or triggers error messages if "Vehicle Model" or "Initial Condition" are empty.
    - **Interactive Actions:** Verified that the "SAVE VEHICLE JOB" button triggers the expected view model action when all fields are valid.
- **Result:** ALL PASSED.

---

## **3. Name Resolution & Profile Synchronization (Integration)**
- **Target:** `AdminViewModel`, `AuditViewModel`, and `ServiceDetailViewModel`.
- **Test Case:**
    1. Log a task as "Mechanic A".
    2. Change User Name in Firestore to "Chido Kavai".
    3. Observe logs in Admin Dashboard and Audit Trail.
- **Observation:** The app correctly resolves the name from the `users` collection in real-time. All historical entries for that user ID successfully updated to "Chido Kavai".
- **Result:** PASSED.

---

## **3. Manual Regression & Requirements Verification**

### **A. Offline Persistence**
- **Test:** Log in -> Disable Internet -> Create Check-In -> Enable Internet.
- **Observation:** The app allowed full data entry while offline. Upon reconnection, the data was successfully synced to Firebase Firestore without user intervention.
- **Result:** PASSED.

### **B. Accountability & Security**
- **Test:** Mechanic A claims a task. Mechanic B tries to finish it.
- **Observation:** The UI correctly identifies the current mechanic and prevents unauthorized finishing. Every completed task in the Admin Audit trail displays the specific initials of the mechanic who finished it.
- **Result:** PASSED.

### **C. Navigation & Role Security**
- **Test:** Log in as Mechanic -> Try to access Admin Dashboard.
- **Observation:** The `MainActivity` navigation logic securely routes users based on their Firestore `role` property. Mechanics are locked into the Service Board and Profile flows.
- **Result:** PASSED.

---

## **4. Technical Debt & Linting**
- **Linting:** Ran `./gradlew lint`. All high-priority architectural issues resolved.
- **Memory Management:** Verified that `SnapshotListeners` are properly removed in `onCleared()` or via `awaitClose` in Flow collectors to prevent memory leaks in a long-running garage environment.

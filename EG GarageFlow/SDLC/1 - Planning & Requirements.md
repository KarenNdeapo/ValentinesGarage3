### **Stage 1: Planning & Requirement Analysis**

**1. Define Project Scope:**

The scope is to build the **EG GarageFlow App**. It must handle isolated "Check-In" events (the "airplane boarding" concept the lecturer mentioned), collaborative mechanic checklists, and accountability reporting.

**2. Set Objectives and Goals:**

- **Primary Goal:** Prevent task mismanagement and hold mechanics accountable.
- **Academic Goal:** Achieve full technical excellence in Architecture, Code, Functionality, UI/Navigation, and Presentation.

**3. Resource Planning (Team Roles):**

Since we have a group of 4, we must divide the work fairly to satisfy the "Clear separation of tasks done" requirement in the project specifications. Here is the recommended breakdown:

- **Silvio Ivanio (Architect & Project Manager):** Handles the initial foundation and core architecture. Responsible for the overall integration and technical cohesion of all project stages.
- **Chido Kavai (UI Lead):** Leads the implementation of the Authentication and Navigation flow and collaborates on the core UI features.
- **Kirubel Hailu (Business Logic Lead):** Leads the Admin and Mechanic flows.
- **Pinto Kabinda (QA Lead):** Leads the Quality Assurance (Unit/UI testing and project verification).
- *Note: Mechanic Flow is a collaborative effort involving the entire team.*

---

### **Stage 2: Defining Requirements**

**1. Functional Requirements (What the app *must* do):**

Based strictly on the assignment and explanations from the lecturer:

- **Authentication:** Users (Mechanics and Admin) must be able to log in.
- **Create Check-In Event:** A user must be able to register a truck's arrival. This must capture: Truck ID/License, Vehicle Model/Make, Current Kilometers, and Current Condition. *(Crucial: Vehicle Details and Initial Condition are mandatory fields to ensure data integrity. As the lecturer noted, if the same truck comes back 3 weeks later, it is a brand new check-in event, completely separate from the first).*
- **Collaborative Task List:** Mechanics must see a list of tasks (e.g., change oil, change wheels, check water). They must be able to tick them off and add notes.
- **Accountability Tracking:** The system must record *who* ticked off the task so no one can say "I thought he did it."
- **Admin Reports:** Admin must be able to view a summary of a check-in event, seeing the initial condition and the completed tasks with the mechanic's names.

**2. Technical Requirements (How it will be built):**

- **Language:** 100% Kotlin.
- **UI Framework:** Jetpack Compose (Declarative UI).
- **Architecture:** MVVM (Model-View-ViewModel) with Clean Architecture principles (UI Layer, Domain Layer, Data Layer).
- **State Management:** StateFlow and Coroutines.
- **Local Storage/Database:** Firebase (cloud sync).
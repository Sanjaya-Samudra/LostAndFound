# Product Requirements Document (PRD) - Lost & Found Campus Portal

## 1. Introduction & Project Scope
The **Lost & Found Campus Portal** is a web-based platform designed to help students, faculty, and campus administrators report, track, and recover lost or found items within the university ecosystem[cite: 1]. The goal of this platform is to centralize and automate a manual, fragmented paper-and-bulletin-board process into an intuitive, secure, and mobile-responsive digital hub[cite: 1].

---

## 2. Functional Requirements (FR)

### FR-1: User Authentication & Profile Management
* **FR-1.1:** The system must allow users to register an account using a valid campus email address ending with `@campus.edu`[cite: 1].
* **FR-1.2:** The system must enforce a password strength policy of at least 6 characters[cite: 1].
* **FR-1.3:** Registered users must be able to log in securely using their credentials, generating a JSON Web Token (JWT)[cite: 1].
* **FR-1.4:** Users must be able to view their personal dashboard containing stats on items they have reported and their recent activity[cite: 1].
* **FR-1.5:** Users must be able to view and edit their profile details (e.g., First Name, Last Name, Avatar)[cite: 1].

### FR-2: Lost & Found Item Management
* **FR-2.1:** Registered users must be able to post a "Lost Item" by specifying the title, description, category, and location where it was misplaced[cite: 1].
* **FR-2.2:** Registered users must be able to post a "Found Item" by specifying details and uploading a corresponding photo[cite: 1].
* **FR-2.3:** The platform must support image storage using Cloudinary integration with support for common image formats (JPEG, PNG, WEBP) up to 5MB[cite: 1].
* **FR-2.4:** Item posters must be able to update an item's status from "open" to "resolved" once it is claimed or returned[cite: 1].
* **FR-2.5:** Users must be able to edit or delete posts they originally authored[cite: 1].

### FR-3: Search & Discovery
* **FR-3.1:** Users (including unauthenticated guests) must be able to perform a keyword-based text search on item titles and descriptions[cite: 1].
* **FR-3.2:** The system must support advanced filtering of search results by category (electronics, accessories, books, clothing, documents, other), item type (lost or found), and status (open or resolved)[cite: 1].
* **FR-3.3:** Users must be able to click on any item card to view its full details page, including a photo gallery, description, location, and poster contact information[cite: 1].

### FR-4: Admin Moderation & Dashboard
* **FR-4.1:** Users with the `admin` role must have access to a secure, private Admin Dashboard[cite: 1].
* **FR-4.2:** The Admin Overview page must render dynamic charts (e.g., items per category) using Recharts[cite: 1].
* **FR-4.3:** Admins must have access to a table of registered users to search and perform moderation actions (e.g., deleting a user account or banning a malicious user)[cite: 1].
* **FR-4.4:** Admins must have access to a table of posted items to review, edit, or permanently remove listings that violate campus guidelines[cite: 1].

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Scalability
* **NFR-1.1:** Pages must achieve a First Contentful Paint (FCP) time of under 3 seconds under average 3G mobile connections[cite: 1].
* **NFR-1.2:** API response times for read operations must be under 500ms under nominal loads[cite: 1].

### NFR-2: Security & Privacy
* **NFR-2.1:** All communication between client and server must run over HTTPS to prevent intercept attacks[cite: 1].
* **NFR-2.2:** Passwords must be hashed using `bcrypt` with a minimum of 10 salt rounds before storage[cite: 1].
* **NFR-2.3:** API requests to protected endpoints must be authenticated using JWT validation in the Authorization header[cite: 1].
* **NFR-2.4:** The API must implement a rate limiter restricting users to a maximum of 100 requests per 15-minute window[cite: 1].
* **NFR-2.5:** Security headers must be configured on the backend using the `helmet` package[cite: 1].

### NFR-3: Compatibility & Usability
* **NFR-3.1:** The user interface must be fully mobile-responsive, adjusting layouts seamlessly for mobile (375px+), tablet (768px+), and desktop (1280px+) screens[cite: 1].
* **NFR-3.2:** The application must compile without errors on Vite for the frontend and TypeScript compiler (tsc) for the backend[cite: 1].
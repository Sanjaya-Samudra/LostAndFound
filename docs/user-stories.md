# User Stories & Acceptance Criteria

### ST-01: User Registration
* **Title:** As a student, I want to register for a campus portal account so that I can report lost or found items[cite: 1].
* **Sprint Milestone:** Sprint 2[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - Registration form must require Full Name, Email, Password, and Confirm Password[cite: 1].
  - Email address must validate using regex to ensure it ends with `@campus.edu`[cite: 1].
  - Password must be at least 6 characters long[cite: 1].
  - An error message must display if the email is already registered[cite: 1].
  - Successful registration must automatically redirect the user to the Login page[cite: 1].

### ST-02: User Login
* **Title:** As a registered student, I want to log in using my credentials so that I can access personalized features[cite: 1].
* **Sprint Milestone:** Sprint 2[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - Login form must require email and password[cite: 1].
  - On submit, the system must authenticate credentials via backend `/api/auth/login`[cite: 1].
  - Upon validation, a secure JWT token must be returned and stored in `localStorage`[cite: 1].
  - Unsuccessful attempts must display a generic "Invalid credentials" error[cite: 1].
  - Successful authentication redirects to the User Dashboard[cite: 1].

### ST-03: Post Lost Item
* **Title:** As a student who lost an item, I want to post a lost item report so that others can help find it[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - Authenticated users must access a "Post Lost Item" form[cite: 1].
  - Required inputs: Title, Description, Category (dropdown), Location[cite: 1].
  - Item type must be designated as `lost` automatically in the background[cite: 1].
  - Submission must save the item record in MongoDB, associated with the active user ID[cite: 1].
  - The user must be redirected to their dashboard with a success notification[cite: 1].

### ST-04: Post Found Item with Photo
* **Title:** As a student who found an item, I want to upload a photo of it so that the owner can easily identify it[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - Form must allow file uploads through a drag-and-drop or file selector[cite: 1].
  - Only common image formats (PNG, JPG, WEBP) under 5MB are accepted[cite: 1].
  - Images must be uploaded to Cloudinary, and the return secure URL stored in MongoDB[cite: 1].
  - A preview of the uploaded image must display on the frontend before submission[cite: 1].
  - Validation errors must handle missing files gracefully[cite: 1].

### ST-05: Search Items by Category & Filters
* **Title:** As a user searching for my item, I want to search keywords and filter by categories so that I can find matching posts quickly[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The Search page must present a prominent search bar input[cite: 1].
  - Search must run against backend text indexes on `title` and `description`[cite: 1].
  - Filter sidebar must allow selecting Category, Type (Lost/Found), and Status (Open/Resolved)[cite: 1].
  - Results must render in a clean grid of item cards, each showing Title, Category, Status, and Location[cite: 1].

### ST-06: View Item Details
* **Title:** As a user, I want to click on an item to view its complete details and contact info so that I can coordinate recovery[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-medium`, `frontend`[cite: 1]
* **Acceptance Criteria:**
  - Clicking an item card navigates to `/items/:id`[cite: 1].
  - Page must display the item photo, title, status badge, full description, location, and date posted[cite: 1].
  - The contact details (Name and Email) of the poster must be visible only to authenticated users[cite: 1].

### ST-07: Admin Login
* **Title:** As a campus administrator, I want to securely log in with admin privileges so that I can moderate the platform[cite: 1].
* **Sprint Milestone:** Sprint 4[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - Authentication checks for `role === 'admin'` in JWT payload[cite: 1].
  - Admin user must be redirected directly to `/admin/dashboard`[cite: 1].
  - Non-admin users trying to access administrative routes must receive a 403 Forbidden page or redirect[cite: 1].

### ST-08: Admin View All Users
* **Title:** As an administrator, I want to view a list of all registered users so that I can monitor user registrations[cite: 1].
* **Sprint Milestone:** Sprint 4[cite: 1]
* **Labels:** `user-story`, `priority-medium`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The Admin dashboard must include a "Manage Users" page[cite: 1].
  - It must display a clean data table containing Name, Email, Role, and Date Joined[cite: 1].
  - A search box must filter the table by Name or Email on the client side[cite: 1].

### ST-09: Admin Remove Item
* **Title:** As an administrator, I want to delete inappropriate item postings so that the portal remains compliant with school policies[cite: 1].
* **Sprint Milestone:** Sprint 4[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The Admin "Manage Items" page must feature a "Delete" or "Remove" action button for every listing[cite: 1].
  - Clicking Delete triggers a confirmation modal[cite: 1].
  - Upon confirmation, an API call `DELETE /api/admin/items/:id` removes the item from MongoDB[cite: 1].
  - The list must automatically refresh to show the item has been removed[cite: 1].

### ST-10: Admin Dashboard Stats
* **Title:** As an administrator, I want to view platform activity metrics so that I can evaluate the portal's effectiveness[cite: 1].
* **Sprint Milestone:** Sprint 4[cite: 1]
* **Labels:** `user-story`, `priority-medium`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The Admin Overview page must fetch aggregated stats from `/api/admin/stats`[cite: 1].
  - It must render a Recharts bar chart showing the breakdown of items across categories[cite: 1].
  - It must highlight quick numerical KPIs: Total Active Items, Total Resolved Items, and Total Users[cite: 1].

### ST-11: Responsive Mobile Layout
* **Title:** As a mobile user, I want the website layout to fit my phone screen so that I can report items on-the-go[cite: 1].
* **Sprint Milestone:** Sprint 2[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`[cite: 1]
* **Acceptance Criteria:**
  - The navigation bar must compress into a hamburger menu on viewport widths under 768px[cite: 1].
  - All multi-column grids must transition to a single-column layout on viewport widths under 640px[cite: 1].
  - Forms must scale comfortably, ensuring tap targets (buttons) are at least 44px in height[cite: 1].

### ST-12: Personal User Dashboard
* **Title:** As a student, I want to view my current posts on a personal dashboard so that I can check their status[cite: 1].
* **Sprint Milestone:** Sprint 2[cite: 1]
* **Labels:** `user-story`, `priority-medium`, `frontend`[cite: 1]
* **Acceptance Criteria:**
  - Dashboard page `/dashboard` must display statistics cards (e.g., "My Lost Posts", "My Found Posts")[cite: 1].
  - It must render a list of items posted specifically by the logged-in user[cite: 1].
  - Each item card in this list must show its current status: Open or Resolved[cite: 1].

### ST-13: Edit/Delete Own Posts
* **Title:** As an item poster, I want to edit details or delete my post if information changes or is no longer relevant[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-high`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - An "Edit" and "Delete" button must only render on `/items/:id` if the logged-in user's ID matches the item creator's ID[cite: 1].
  - The edit form must pre-populate with existing title, description, category, and location[cite: 1].
  - Updating details hits `PUT /api/items/:id`, returning the updated object[cite: 1].
  - Deleting an item triggers a warning before running `DELETE /api/items/:id`[cite: 1].

### ST-14: Claim/Resolve Item Status
* **Title:** As a student who recovered my lost item, I want to mark it as resolved so that it is cleared from active searches[cite: 1].
* **Sprint Milestone:** Sprint 3[cite: 1]
* **Labels:** `user-story`, `priority-medium`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The item creator must have a toggle or button on their dashboard saying "Mark as Resolved"[cite: 1].
  - Clicking this button updates the item's status database field to `'resolved'`[cite: 1].
  - Resolved items must display a distinct visual badge (e.g., green checkmark) in search results[cite: 1].

### ST-15: User Profile Management
* **Title:** As a user, I want to view and edit my personal profile information so that my details are accurate[cite: 1].
* **Sprint Milestone:** Sprint 2 / 5[cite: 1]
* **Labels:** `user-story`, `priority-low`, `frontend`, `backend`[cite: 1]
* **Acceptance Criteria:**
  - The Profile page `/profile` must present editable inputs for First Name and Last Name[cite: 1].
  - It must show a read-only field for the registered campus email address[cite: 1].
  - Saving updates must persist changes via `PUT /api/auth/profile` and refresh global context[cite: 1].
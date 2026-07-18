# Requirements Traceability Matrix (RTM)

This matrix maps user stories directly to functional requirements, database layers, system endpoints, and QA verification tests[cite: 1].

| Story ID | Functional Req | Core System Feature | Backend API Endpoint | Test Case ID & File | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ST-01** | FR-1.1, FR-1.2 | User Registration Page | `POST /api/auth/register`[cite: 1] | TC-01 (`auth.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-02** | FR-1.3 | User Login Authorization | `POST /api/auth/login`[cite: 1] | TC-02 (`auth.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-03** | FR-2.1 | Create Lost Item Listing | `POST /api/items`[cite: 1] | TC-03 (`items.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-04** | FR-2.2, FR-2.3 | Create Found Post + Photo | `POST /api/items` (multipart)[cite: 1] | TC-04 (`items.api.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-05** | FR-3.1, FR-3.2 | Search Interface & Filtering | `GET /api/items/search`[cite: 1] | TC-05 (`items.api.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-06** | FR-3.3 | Detailed Item Viewer Page | `GET /api/items/:id`[cite: 1] | TC-06 (`ItemCard.test.tsx`)[cite: 1] | **Pass**[cite: 1] |
| **ST-07** | FR-4.1 | Admin Dashboard Entry Gate | `GET /api/admin/stats`[cite: 1] | TC-07 (`auth.api.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-08** | FR-4.3 | Admin Users Administration | `GET /api/admin/users`[cite: 1] | TC-08 (`admin.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-09** | FR-4.4 | Admin Item Moderation/Removal | `DELETE /api/admin/items/:id`[cite: 1] | TC-09 (`admin.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-10** | FR-4.2 | Live Analytics Recharts Graph | `GET /api/admin/stats`[cite: 1] | TC-10 (`admin.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-11** | NFR-3.1 | Responsive Mobile Screen | N/A (Client CSS Media rules)[cite: 1] | TC-11 (Manual Viewport Test)[cite: 1] | **Pass**[cite: 1] |
| **ST-12** | FR-1.4 | Personal Dashboard Layout | `GET /api/items/my-items`[cite: 1] | TC-12 (`Dashboard.test.tsx`)[cite: 1] | **Pass**[cite: 1] |
| **ST-13** | FR-2.5 | Edit or Delete Personal Posts | `PUT / DELETE /api/items/:id`[cite: 1] | TC-13 (`items.api.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-14** | FR-2.4 | Status Toggle (Mark Resolved) | `PATCH /api/items/:id/status`[cite: 1] | TC-14 (`items.api.test.ts`)[cite: 1] | **Pass**[cite: 1] |
| **ST-15** | FR-1.5 | Update Profile Settings | `PUT /api/auth/profile`[cite: 1] | TC-15 (`Profile.test.tsx`)[cite: 1] | **Pass**[cite: 1] |
# Lost & Found Campus Portal - Comprehensive Final Report

## 1. Executive Summary
The **Lost & Found Campus Portal** project represents a complete, full-stack, automated web application developed over a 12-week lifecycle following Scrum methodologies[cite: 1]. The team successfully created an administrative and student portal designed to manage items misplaced on campus, achieving continuous integration and continuous deployment (CI/CD) to production using Docker, GitHub Actions, and Render on all-free tiers[cite: 1].

---

## 2. Process & Agile Execution
The project was designed and implemented across 6 distinct two-week Sprints[cite: 1]:
* **Sprints 1–2 (Weeks 1–4):** Focused on UX architecture, establishing database schemas in MongoDB Atlas, setting up repositories, and styling all frontend layout mockups with Tailwind CSS[cite: 1].
* **Sprints 3–4 (Weeks 5–8):** Focused on developing Express.js and TypeScript services, creating CRUD capabilities, implementing JWT, and integrating both backend and frontend endpoints[cite: 1].
* **Sprints 5–6 (Weeks 9–12):** Focused on containerizing systems with Docker, orchestrating continuous integration pipelines via GitHub Actions, deploying staging sites on Render, and completing functional End-to-End (E2E) QA testing[cite: 1].

---

## 3. Tech Stack & Architecture
* **Frontend Client:** Built using React 18 with TypeScript, Vite, React Router, Tailwind CSS, and Recharts[cite: 1].
* **Backend Server:** Node.js server using Express, MongoDB Atlas, Mongoose schemas, and integrated Cloudinary image handling[cite: 1].
* **DevOps Suite:** Docker files, Docker Compose scripts, GitHub Actions runner, and UptimeRobot monitoring[cite: 1].

---

## 4. Key Challenges & Technical Resolutions

### Challenge 1: Handling Large Image Uploads
* *Issue:* Large photo uploads from phone cameras crashed the API or timed out over slow campus networks[cite: 1].
* *Resolution:* Configure the backend `multer` middleware to strictly limit image files to 5MB and serve constructive error messaging back to users on the UI layer[cite: 1].

### Challenge 2: Deployed Service Cold Starts on Free Tiers
* *Issue:* Free-tier hosting on Render spins down containers after inactivity, creating a frustrating 30+ second lag on first access[cite: 1].
* *Resolution:* Configured **UptimeRobot** to issue automated GET ping requests to `/api/health` every 5 minutes to keep the backend web process warm and responsive[cite: 1].

---

## 5. Individual Team Member Contribution Ledger
The project roles and directory owners are divided as follows[cite: 1]:

* **Scrum Master:** Repository setup, branch protection, Agile project bsoard management, PR review gates, and submission logistics[cite: 1].
* **Business Analyst:** Requirement writing, workflow formulation, user story details, and RTM compilation[cite: 1].
* **UI/UX Designer:** Design system styles, typography variables, Figma wireframes, and interface layouts[cite: 1].
* **Frontend + Admin Developer:** React routing infrastructure, form interactions, Axios endpoint wiring, and Admin page statistics integration[cite: 1].
* **Backend Developer:** REST API system pathways, JSON Web Token validation controllers, security layers, and Cloudinary uploads[cite: 1].
* **Tester:** Jest suite environments, Supertest API validations, and bug reports[cite: 1].
* **Database Administrator (DBA):** MongoDB connection parameters, index strategies, seed scripts, and models[cite: 1].
* **DevOps Engineer:** Docker compose setup, CI/CD Actions workflows, Render configurations, and logs[cite: 1].
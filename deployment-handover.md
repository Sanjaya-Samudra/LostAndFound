# Deployment Handover Document
**Project:** LostAndFound

## 🌐 Live URLs
* **Frontend:** [https://lostandfound-1-4or3.onrender.com](https://lostandfound-1-4or3.onrender.com)
* **Backend:** [https://lostandfound-dr6y.onrender.com](https://lostandfound-dr6y.onrender.com)

## 🔐 Environment Variables
*(Note: Secret values are masked for security purposes as per deployment requirements.)*

### Backend (Render Web Service)
* `MONGO_URI`: `mongodb+srv://***`
* `CLOUDINARY_CLOUD_NAME`: `***`
* `CLOUDINARY_API_KEY`: `***`
* `CLOUDINARY_API_SECRET`: `***`
* `JWT_SECRET`: `***`
* `HOST`: `0.0.0.0` (Added to resolve Docker container timeout on Render)

### Frontend (Render Static Site)
* `VITE_API_URL`: `https://lostandfound-dr6y.onrender.com/api`

### GitHub Secrets (CI/CD Pipeline)
* `MONGO_URI`: `***`
* `CLOUDINARY_CLOUD_NAME`: `***`
* `CLOUDINARY_API_KEY`: `***`
* `CLOUDINARY_API_SECRET`: `***`
* `JWT_SECRET`: `***`

## 🐳 Docker Terminal Commands
The following commands were executed to build, tag, and push the local container images to the Docker Hub repository:

```bash
# 1. Build and run locally to test the Dockerfile configuration
docker compose up -d --build

# 2. Authenticate with Docker Hub
docker login

# 3. Tag images for the remote repository (strictly using lowercase username)
docker tag lostandfound-backend:latest thiranrr/lostandfound-backend:latest
docker tag lostandfound-frontend:latest thiranrr/lostandfound-frontend:latest

# 4. Push images to Docker Hub for the CI/CD pipeline to access
docker push thiranrr/lostandfound-backend:latest
docker push thiranrr/lostandfound-frontend:latest
```

# Netgrif Local Setup – IntelliJ & Docker

## What you’ll build

- A **local Netgrif Platform instance** running on your machine
- Backend running in **IntelliJ IDEA** with **Spring Boot**
- Databases (**MongoDB, Elasticsearch, Redis**) running in **Docker**
- Frontend running on **localhost:4200** (Angular dev server)
- A **Request** low-code application:
    - Uploaded and executed in your local eTask instance
    - Extended with a **custom REST API call** (randomuser.me)
    - Wired into a process via **Netgrif Builder** and an **action delegate**

---

## 🎥 Video

This tutorial follows the steps from the video:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/4FLiukKa5Vs"
    title="Netgrif Local Setup – IntelliJ & Docker"
    allowfullscreen></iframe>
</div>

---

## 1. Goal & Context

In this first episode of the **Netgrif Platform Basic Courses**, you set up:

1. **Backend**
    - From `etask-backend-starter` GitHub template
    - Imported into **IntelliJ IDEA**
    - Built with Maven and run as a Spring Boot application

2. **Databases (Docker)**
    - MongoDB
    - Elasticsearch
    - Redis
    - Started via `docker-compose.yml` from the backend project

3. **Frontend**
    - From `etask-frontend-starter` GitHub template
    - Cloned and run with **Node.js + npm**
    - Served by Angular CLI at `http://localhost:4200`

4. **Low-code application**
    - Request application uploaded into your local eTask instance
    - Extended by a custom **Groovy action delegate** calling external REST API
    - Bound to process events in **Netgrif Application Builder**

By the end, you can **run, extend, and test** a low-code app in a fully local environment.

---

## 2. Prerequisites

### 2.1 Tools & Versions

Backend side:

- **Java 11** installed (JDK 11)
- **IntelliJ IDEA** (Community or Ultimate)
- **Maven** (integrated in IntelliJ is enough)
- **Docker** running on your machine
    - On Windows: Docker Desktop + WSL2 + a Linux distro (e.g. Ubuntu)

Frontend side:

- **Node.js** (e.g. `v18.20.8`)
- **npm** (e.g. `v10.8.2`)
- An IDE for frontend (e.g. WebStorm, VS Code, etc.)

Netgrif resources:

- Backend template: `etask-backend-starter`
- Frontend template: `etask-frontend-starter`
- Netgrif Application Builder: `https://builder.netgrif.cloud`
- Request process XML (from the earlier tutorial)

---

## 3. Backend Setup – GitHub Template & IntelliJ

### 3.1 Create your backend repository from template

1. Go to GitHub and open the **`etask-backend-starter`** repository.
2. Click **“Use this template”**.
3. Create your own repository, for example:

   ```text
   showcase-tutorial-backend
   ```

4. Confirm repository creation.

### 3.2 Clone backend into IntelliJ

1. In IntelliJ IDEA, choose **Get from Version Control** (or similar).
2. Paste the Git URL of your new repo (e.g. `showcase-tutorial-backend`).
3. Clone the repository into your local machine.
4. When IntelliJ prompts, **Trust the project**.

You should now see the backend project open in IntelliJ with a standard Spring Boot structure.

---

## 4. Backend Build – Maven Dependencies

### 4.1 Check Java version

In IntelliJ’s terminal:

```bash
java -version
```

Ensure Java 11 is active.

### 4.2 Run Maven lifecycle

In IntelliJ (Maven tool window or terminal):

- Use Maven lifecycle commands **without tests**, for example:

```bash
mvn clean package install -DskipTests
```

This will:

- Download all required dependencies
- Build your backend
- Prepare it to be run with Spring Boot

Wait until the Maven build finishes **successfully**.

---

## 5. Databases – Docker Compose (Mongo, Elastic, Redis)

### 5.1 Locate `docker-compose.yml`

In the backend project:

- Find the `docker-compose.yml` file (e.g. in project root).

Open it and you will see services for:

- **MongoDB**
- **Elasticsearch**
- **Redis**

### 5.2 Ensure Docker is running

- Start Docker Desktop (on Windows/macOS), or Docker engine (Linux).
- On Windows, ensure **WSL2 + Ubuntu** are configured properly.

### 5.3 Start the database stack

In IntelliJ’s Docker integration or terminal, run:

```bash
docker-compose up
```

(or use the **green play button** next to the compose file, as shown in the video)

Wait until all services are up:

- MongoDB
- Elasticsearch
- Redis

You can verify in the Docker UI or use:

```bash
docker ps
```

---

## 6. Run Backend – Netgrif Application Engine

With:

- Maven build done
- Docker databases running

Start the backend:

1. In IntelliJ, run the main Spring Boot application class (e.g. via **green run button**).
2. If prompted:
    - Enable **annotation processing**.
    - Accept **“shorten command line”** suggestion and rerun if needed.

Watch the logs until you see that **Netgrif Application Engine** is started successfully (similar to log message shown in the video).

At this point, the backend is running locally and connected to your Docker databases.

---

## 7. Frontend Setup – GitHub Template & Node/npm

### 7.1 Create your frontend repository from template

1. In your browser, open the **`etask-frontend-starter`** repository.
2. Click **“Use this template”**.
3. Name your new repository, for example:

   ```text
   showcase-tutorial-frontend
   ```

4. Create the repository.

### 7.2 Clone frontend into your IDE

1. Open your frontend IDE (e.g. WebStorm).
2. Choose **Get from Version Control** / **Clone**.
3. Paste the Git URL of the new frontend repo.
4. Clone the repository and **trust** the project when asked.

You should see an Angular project structure with `package.json`, `src/`, etc.

---

## 8. Frontend Dependencies – `npm install`

### 8.1 Verify Node & npm versions

In the terminal of your frontend project:

```bash
node -v
npm -v
```

Example from the video:

- Node: `18.20.8`
- npm: `10.8.2`

### 8.2 Install dependencies

Run:

```bash
npm install --force
```

This will install all packages specified in `package.json`.

Wait until installation completes successfully.

---

## 9. Run Angular Frontend – `localhost:4200`

### 9.1 Start Angular dev server

In the frontend project terminal or via IDE run configuration:

```bash
ng serve
```

(or click the **green “Run Angular CLI”** button, as in the video)

Wait until the dev server starts and shows a message similar to:

```text
✔ Compiled successfully.
✔ Local:   http://localhost:4200/
```

### 9.2 Open eTask UI

Open a browser and go to:

```text
http://localhost:4200
```

Log in with default dev credentials:

- Username: `super@netgrif.com`
- Password: `password`  (string “password” used for dev/testing)

You should see:

- Dashboard with a **general card** (all cases/system cases)
- Left menu with filters, settings, etc.

---

## 10. Upload & Preview a Low-code Application

### 10.1 Upload Request process

In eTask (frontend):

1. Click the **three dots** menu as administrator.
2. Choose the option to **upload a new process**.
3. Select the **Request** application XML you prepared (from the earlier tutorial).
4. Upload it.

Once compiled and deployed by the backend, you can:

- Create new process instances
- Use the Request public form as demonstrated in the video

---

## 11. Extend the Application – Custom REST API Function

Now you will extend the backend with a custom function that:

- Calls an external REST API (`https://randomuser.me/api`)
- Returns user data (name, surname, email)
- Can be used from a low-code action in the Request process

### 11.1 Add Groovy function to `e-task-action-delegate`

1. In the backend project, locate the Groovy file:

   ```text
   e-task-action-delegate.groovy
   ```

   (Path similar to `src/main/groovy/...`)

2. Add a new function that:
    - Performs HTTP GET to `randomuser.me/api`
    - Parses JSON
    - Returns name/surname/email

3. Add required `import` statements (HTTP client, JSON parsing) at the top of the file.

4. Save the file.

### 11.2 Restart backend

To make the new function available:

1. Stop the Spring Boot application in IntelliJ (if running).
2. Run it again (green run button).

Wait until backend starts successfully.

---

## 12. Wire Function into Request Process (Builder)

Next, call this backend function from a low-code action in the Request process.

### 12.1 Define action in Builder

1. Open **Netgrif Application Builder** (`https://builder.netgrif.cloud`).
2. Open the **Request** process (the same XML you use locally).
3. Go to **Edit actions / events** for the relevant task (e.g. submit/assign of the request).
4. Add a new **action** that:
    - Calls the Groovy function you added in `e-task-action-delegate`
    - Maps returned values to data fields:
        - `name`
        - `surname`
        - `email`

For example, call the function when the task is assigned or submitted, and assign values to these fields.

### 12.2 Download updated process source

1. In Builder, download the updated Request process XML.
2. Use this updated XML in your local instance.

---

## 13. Redeploy Updated Process & Test

### 13.1 Upload updated Request process to local eTask

In your local frontend (localhost:4200):

1. Log in as `super@netgrif.com`.
2. Go to **Workflows / Processes**.
3. Upload the updated Request process XML (the one that calls your new function).
4. Confirm compilation success.

### 13.2 Execute the flow

1. Create a new Request process instance from the dashboard/workflows.
2. Open the initial task.
3. Trigger the event that calls your function (e.g. assign/submit).
4. Check that:

    - `name`
    - `surname`
    - `email`

   fields are filled automatically from the external API (random user data).

This demonstrates how easily you can **enrich a low-code application** with custom backend logic.

---

## 14. Summary

By following this tutorial, you have:

- Created your own backend repository from `etask-backend-starter`
- Built the backend with Maven in **IntelliJ IDEA**
- Started required databases (**MongoDB, Elasticsearch, Redis**) using **Docker Compose**
- Started the **Netgrif backend engine** successfully
- Created your own frontend repository from `etask-frontend-starter`
- Installed Node.js dependencies and ran the Angular app on `http://localhost:4200`
- Logged in to your local eTask environment as super admin
- Uploaded and executed a **Request** low-code process
- Extended the application by:
    - Adding a custom **Groovy action delegate** calling `randomuser.me/api`
    - Wiring it to process events via **Netgrif Builder**
    - Automatically filling user-related fields in the Request form

You now have a complete **local Netgrif Platform environment** suitable for development, experimentation, and extending low-code apps with custom logic.
# Netgrif Server Setup (Ubuntu 24.04)

## What you’ll build

- A fully deployed **Netgrif Platform (eTask)** on **Ubuntu 24.04**
- Using the **Netgrif install script** (`nae-install.sh`) to install Java, databases, Apache, and deploy your app
- A **Request** menu item in eTask that lists all Request cases and lets users create new ones

You will reuse the **backend** and **frontend** projects from the “Run locally” videos and turn them into a deployable server installation.

---

## 🎥 Video

Below is the tutorial video referenced in this guide:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/uqm1NFPNUG4"
    title="Netgrif Server Setup"
    allowfullscreen></iframe>
</div>

---

## 1. Goal & Context

In this tutorial, you will:

1. **Build deployable artifacts**
    - Backend: `app.jar` via Maven
    - Frontend: Angular `dist` build for eTask

2. **Create a single deployment package (`eTask.zip`)**
    - Structure:
        - `frontend/` → Angular build
        - `backend/app.jar` + `backend/src/main/resources/...`

3. **Upload & install on Ubuntu 24.04 using `nae-install.sh`**
    - Install Java, MongoDB, ElasticSearch, Redis, Apache, unzip
    - Configure:
        - Apache virtual host (`/var/www/<APP_NAME>/public_html`)
        - systemd service (`/etc/systemd/system/<APP_NAME>.service`)
        - Application home (`/opt/netgrif/<APP_NAME>`)

4. **Deploy from ZIP**
    - Frontend → Apache document root
    - Backend → `/opt/netgrif/<APP_NAME>/app.jar` and resources
    - Verify services and logs

5. **Bonus: Add a Request menu item in eTask**
    - Upload the **Request** process
    - Add a **post-phase action** that calls `createOrUpdateMenuItem`
    - Update the process source, re-upload, and verify:
        - Left menu “Request” folder
        - Dashboard card
        - “+” button to create new Request instances

You’ll work in three environments:

- Local IDE (VS Code / IntelliJ) to build artifacts
- File transfer (e.g. WinSCP) to upload zip + script
- Ubuntu shell (SSH) to run the **Netgrif install script**

---

## 2. Prerequisites

- Backend and frontend projects from the previous “run locally” tutorials
- Access to an Ubuntu 24.04 server with sudo rights
- File transfer tool (e.g. WinSCP) and SSH client
- Netgrif install script: `nae-install.sh`

---

## 3. Build Backend & Frontend Locally

### 3.1 Backend – build `app.jar`

1. Open the Netgrif backend project in your IDE.
2. Run:

```bash
mvn clean install
```

3. Confirm that `target/app.jar` exists.

### 3.2 Frontend – Angular build

1. Open the eTask Angular project.
2. Ensure backend URLs are set correctly:
    - `AutoResolve backend URL = true`
    - Replace all `localhost` references with server IP
3. Run:

```bash
ng build
```

4. Confirm that the `dist/eTask` folder exists.

---

## 4. Create `eTask.zip` Deployment Package

1. Navigate to the `dist` folder.
2. Rename:

```
eTask → frontend
```

3. Create a folder:

```
backend/
```

Place inside:

- `app.jar`
- Optionally `src/main/resources/**` (PDF generator etc.)

Final structure:

```
eTask.zip
├── frontend/
└── backend/
    ├── app.jar
    └── src/main/resources/
```

4. Compress both folders into **`eTask.zip`**.

---

## 5. Upload Zip & Install Script to Server

1. Connect to the server via WinSCP + SSH.
2. Upload into your home directory:

- `eTask.zip`
- `nae-install.sh`

3. Make the script executable:

```bash
chmod +x nae-install.sh
```

---

## 6. Setup Environment: Java, Databases, Apache

Run:

```bash
bash nae-install.sh
```

Choose:

```
setup → ALL[Frontend Backend Databases]
```

This installs:

- Java 11
- unzip
- MongoDB
- Redis
- ElasticSearch
- Apache 2

Verify services:

```bash
systemctl status mongod
systemctl status elasticsearch
systemctl status redis-server
```

Fix any failing service before continuing.

---

## 7. Create Application Configuration (Apache + Service)

Run:

```bash
bash nae-install.sh
```

Select:

```
install → Install new AppWeb[Frontend Backend]
```

Provide:

- Application name (lowercase, no spaces)
- Application user
- Database IP

Script creates:

- Apache vhost
- public_html directory
- systemd service
- `/opt/netgrif/<APP_NAME>`

---

## 8. Deploy From `eTask.zip`

Run:

```bash
bash nae-install.sh
```

Choose:

```
deploy
```

Select:

- your app
- `eTask.zip`

Script will:

- Deploy frontend into `/var/www/.../public_html`
- Deploy backend into `/opt/netgrif/<APP_NAME>`
- Restart services
- Tail logs

---

## 9. Fix Missing PDF Generator Resources (If Needed)

If backend logs mention missing `pdfgenerator` resources:

1. Copy `src/main/resources/pdfgenerator` from local machine into:

```
/opt/netgrif/<APP_NAME>/src/main/resources/
```

2. Restart:

```bash
sudo systemctl restart <APP_NAME>
```

3. Watch logs:

```bash
journalctl -u <APP_NAME> -f
```

---

## 10. Log in to eTask

Open your server IP in browser.

API is proxied to:

```
http://127.0.0.1:8080/api/
```

Log in using default testing credentials.

---

## 11. Bonus: Add a Request Menu Item

### 11.1 Configure in Builder

1. Open Builder
2. Upload Request process
3. Open Edit View → Post Phase
4. Add action `createOrUpdateMenuItem`
5. Fix IDs if needed
6. Re-upload process to server

### 11.2 Verify in eTask

You should see:

- a new Request card
- a Request folder in left menu
- a + button to create new Request instances

---

## 12. Key Paths

```
/opt/netgrif/<APP_NAME>/
/var/www/<APP_NAME>/public_html/
/etc/systemd/system/<APP_NAME>.service
.netgrif.ini
/opt/netgrif/<APP_NAME>/log/nae.log
```

---

## 13. Summary

You have:

- Built backend & frontend
- Bundled them into `eTask.zip`
- Installed prerequisites
- Created Apache + systemd configuration
- Deployed to an Ubuntu 24.04 server
- Added a Request menu item in eTask

Your platform is now fully deployed and extensible.
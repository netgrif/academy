# Netgrif Server Setup (Ubuntu 24.04)

Learn how to deploy the Netgrif Platform on an Ubuntu 24.04 server.  
This step-by-step **video tutorial** shows you how to take a packaged ZIP file (built in [Episode 2](./local-installations.md)) and deploy it on a live server environment.

---

## Video Tutorial

### Episode 3 – Build & Deploy to Ubuntu Server
<div class="container">
    <iframe class="responsive-iframe" src="https://www.youtube.com/embed/uqm1NFPNUG4" title="Netgrif Platform Basic Courses – Episode 3 (Server Deployment)"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
</div>

In this episode you’ll learn how to take the packaged Netgrif Platform ZIP file (built in [Episode 2](./local-installations.md)) and deploy it to an **Ubuntu 24.04 server**.
The tutorial covers installing required dependencies, running the official Netgrif installation script, manually installing Redis if necessary, and configuring backend & frontend services with Apache and systemd. By the end, you’ll have a **fully running Netgrif Platform instance** accessible from your browser — ready for testing, staging, or production use.

---

## Pre-requisites (on Ubuntu 24.04 Server)

Make sure your server has the following installed:

- [Java 11](https://jdk.java.net/java-se-ri/11)
- [Apache Maven 3.8.9](https://maven.apache.org/download.cgi)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/docs/getting-started/installation/) (manual install if not handled by script)
- [Git](https://git-scm.com/)
- [Apache HTTP Server](https://httpd.apache.org/)

The official **Netgrif installation script, that automates most of the setup and service configuration.


[️Materials used in the video](https://shorturl.at/fe7in)

---

## Deployment Steps (High-Level)

1. Prepare the combined **ZIP package** (from Episode 2) containing backend and frontend.
2. Upload the ZIP package and the official Netgrif installation script to your server (e.g. via `scp`).
3. Install prerequisites by running the installation script.
4. Manually repair that installation script did not cover.
5. Run the script to configure backend and frontend services.
6. Integrate with **Apache** and **systemd**.
7. Deploy the application from the uploaded ZIP file.
8. Test the deployment in your browser.
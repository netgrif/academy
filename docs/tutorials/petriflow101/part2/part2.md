# Petriflow 101 - Part 2
### First Deployment (Upload) in eTask - Hybrid Layout

> 💡 **What you’ll do**  
> Export your **Request** model from Builder, upload to **eTask**, submit via **public link**, and verify as a **logged‑in** user.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Flow</summary>

1. **Export** `request.xml` from Builder
2. **Register & Login** to <a target="_blank" href="https://etask.netgrif.cloud/">eTask</a>
3. **Upload** model in **Process Models**
4. **Open Public Link** → submit anonymously
5. **Verify in Cases/Tasks** as logged‑in user
</details>

<details open>
<summary>🧩 Why it matters</summary>

- Confirms **Builder ↔ eTask** pipeline
- Tests **anonymous** vs **authenticated** experience
- Establishes a baseline before future updates
</details>

---

#### ** 🎥 Video **

Watch the “First Deployment (Upload) in eTask” segment (12:40–21:33).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=760&end=1293" title="First Deployment" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Register & Login</h4>
<p>Create an account and sign in to eTask.</p>
<img src="tutorials/petriflow101/part2/register.png" alt="Register screen" />
</div>

<div class="card">
<h4>2️⃣ Uploaded Model</h4>
<p>Process appears in **Process Models** after upload.</p>
<img src="tutorials/petriflow101/part2/uploadedProcess.png" alt="Uploaded process model" />
</div>

<div class="card">
<h4>3️⃣ Public Form</h4>
<p>Open via **Public link** and submit anonymously.</p>
<img src="tutorials/petriflow101/part2/annonymous.png" alt="Anonymous view" />
</div>

<div class="card">
<h4>4️⃣ Logged‑in Verification</h4>
<p>See the submitted case in **Cases** or **Tasks**.</p>
<img src="tutorials/petriflow101/part2/loggedUser.png" alt="Logged user view" />
</div>

</div>

---

#### ** 🧾 Source & Notes **

- Builder source (Part 2):  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part1/request-form.xml">request-form.xml</a>

<details>
<summary>📄 Source code (XML file)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="https://petriflow.com/petriflow.schema.xsd">
   <id>request</id>
   <version>1.0.0</version>
   <initials>RQT</initials>
   <title>Request</title>
   <icon>device_hub</icon>
   <defaultRole>true</defaultRole>
   <anonymousRole>true</anonymousRole>
   <transitionRole>false</transitionRole>

   <data type="file">
      <id>attachment</id>
      <title>Attachment</title>
   </data>

   <data type="text">
      <id>email</id>
      <title>Email</title>
   </data>

   <data type="text"><id>name</id><title>Name</title></data>
   <data type="text"><id>surname</id><title>Surname</title></data>
   <data type="text"><id>phone</id><title>Phone number</title></data>

   <data type="text">
      <id>request_text</id>
      <title>Request</title>
   </data>

   <transition>
      <id>t1</id>
      <x>336</x>
      <y>112</y>
      <label>Request form</label>
      <assignPolicy>auto</assignPolicy>

      <dataGroup>
         <id>t1_0</id>
         <cols>4</cols>
         <layout>grid</layout>

         <dataRef>
            <id>name</id>
            <logic><behavior>editable</behavior></logic>
            <layout>
               <x>0</x><y>0</y><rows>1</rows><cols>2</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
         </dataRef>

         <dataRef>
            <id>surname</id>
            <logic><behavior>editable</behavior></logic>
            <layout>
               <x>2</x><y>0</y><rows>1</rows><cols>2</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
         </dataRef>

         <dataRef>
            <id>email</id>
            <logic><behavior>editable</behavior><behavior>required</behavior></logic>
            <layout>
               <x>0</x><y>1</y><rows>1</rows><cols>2</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
         </dataRef>

         <dataRef>
            <id>phone</id>
            <logic><behavior>editable</behavior></logic>
            <layout>
               <x>2</x><y>1</y><rows>1</rows><cols>2</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
         </dataRef>

         <dataRef>
            <id>request_text</id>
            <logic><behavior>editable</behavior><behavior>required</behavior></logic>
            <layout>
               <x>0</x><y>2</y><rows>2</rows><cols>4</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
            <component><name>textarea</name></component>
         </dataRef>

         <dataRef>
            <id>attachment</id>
            <logic><behavior>editable</behavior></logic>
            <layout>
               <x>0</x><y>4</y><rows>1</rows><cols>4</cols>
               <template>material</template><appearance>outline</appearance>
            </layout>
            <component><name>preview</name></component>
         </dataRef>
      </dataGroup>
   </transition>
</document>
```
</details>

> 🔐 **Remember:** Old cases stay on the previous version; new cases run the latest deployed model.

<!-- tabs:end -->

---

## ✅ Summary

You completed your **first deployment** to eTask and validated both **public** and **logged‑in** flows.

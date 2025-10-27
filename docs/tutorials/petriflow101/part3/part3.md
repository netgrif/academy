# Petriflow 101 - Part 3
### Rapid Change: Email Validation & Redeploy - Hybrid Layout

> ⚡ **What you’ll practice**  
> Make a **quick change** (email regex), export a new XML, and **redeploy** to eTask to see versioning in action.

---

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this part, you’ll perform your **first rapid iteration** — a small but impactful update to your process.  
You’ll see how a simple validation rule (regex for email) becomes a **new version** of your model in **eTask**, while older instances remain unaffected.

You will:
- Modify your existing **Request** model in Builder
- Add a **regex validation rule** to the *Email* field
- Export and redeploy it to **eTask**
- Observe how the system handles **multiple process versions** automatically
</details>

<details open>
<summary>🪜 Step-by-Step Flow</summary>

| Step | Action | Purpose |
|------|---------|----------|
| 1️⃣ | **Open Request** in Builder | Load the existing process from Part 2 |
| 2️⃣ | **Add regex** validation to *Email* | Introduce real-time data quality check |
| 3️⃣ | **Export updated XML** (`request_v2.xml`) | Generate a new deployable version |
| 4️⃣ | **Upload to eTask → Process Models** | Creates a new version alongside the old one |
| 5️⃣ | **Test via public link** | Verify the new rule while old cases stay intact |

> ⚡ **Tip:** Even small rule updates (like regex) require redeployment.  
> It’s a safe, versioned workflow evolution — no downtime, no lost data.
</details>

<details>
<summary>🔄 Versioning Behavior</summary>

- **Existing cases** continue running on their original XML definition
- **New instances** automatically use the updated model (`request_v2.xml`)
- **Validation logic** executes at runtime — enforcing clean inputs immediately

> 🧩 This showcases how PetriFlow supports *continuous improvement* — update, redeploy, test, repeat.
</details>

---

#### ** 🎥 Video **

Watch “Rapid Change & Second Deployment” (21:33–24:16).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=1293&end=1456" title="Rapid Change & Redeploy" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Email Validation in Builder</h4>
<p>Configured <b>regex</b> for the Email field.</p>
<img src="tutorials/petriflow101/part3/regex.png" alt="Email field validation in Builder" />
</div>

<div class="card">
<h4>2️⃣ Two Versions in eTask</h4>
<p>Original and updated versions visible.</p>
<img src="tutorials/petriflow101/part3/processV2.png" alt="Process version overview" />
</div>

<div class="card">
<h4>3️⃣ Validation in Action</h4>
<p>Running app rejects invalid emails.</p>
<img src="tutorials/petriflow101/part3/regexApp.png" alt="Regex validation in running app" />
</div>

</div>

---

#### ** 🧾 Source & Notes **

- Builder model for Part 3:  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part3/request-form.xml">request-form.xml</a>

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
      <validations>
         <validation>
            <expression>regex ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$</expression>
            <message>Please type a valid email</message>
         </validation>
      </validations>
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

> 💡 Small change, big impact: **regex** makes inputs reliable; redeploy keeps delivery fast.

<!-- tabs:end -->

---

## ✅ Summary

You executed a **rapid change** and verified **versioning** in eTask: old cases on old XML, new cases on the latest model.

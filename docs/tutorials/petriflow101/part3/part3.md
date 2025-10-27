# Petriflow 101 - Part 3
### Rapid Change: Email Validation & Redeploy - Hybrid Layout

> ⚡ **What you’ll practice**  
> Make a **quick change** (email regex), export a new XML, and **redeploy** to eTask to see versioning in action.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Rapid iteration</summary>

1. **Open Request** in Builder
2. **Add regex** to the **Email** field + message
3. **Export** updated XML (e.g., `request_v2.xml`)
4. **Upload** to eTask → now two versions exist
5. **Test** validation via the public link
</details>

<details open>
<summary>🧩 Versioning behavior</summary>

- Existing cases remain on the **old** version
- New cases use the **latest** model automatically
- Validation rules apply at runtime
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
<p>Configured **regex** for the Email field.</p>
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

# Petriflow 101 – Part 1
### Creating the First Form (Hybrid Layout)

> 💡 **What you’ll build**  
> A public **Request** form in Netgrif Application Builder, using a 4-column grid layout and role-based access.  
> This is your first real PetriFlow process — simple, visual, and deployable.

 

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this tutorial, you’ll design a **Request** process — a basic form that users can fill out and submit.  
The focus is on:
- Creating and structuring form **data fields**
- Designing a **responsive layout** (4 columns)
- Making the form **publicly accessible** through `defaultRole` and `anonymousRole`
- Adding **validation** and **visual clarity** in Builder

You’ll work entirely inside **[Netgrif Application Builder](https://builder.netgrif.cloud)**.
</details>

<details open>
<summary>🧩 Fields & Layout Overview</summary>

| Field ID | Label | Type | Required | Layout (Grid) | Component    |
|   --|  --|  |   --|     -|    --|
| `name` | Name | Text | No | Row 1 Col 1-2 | -            |
| `surname` | Surname | Text | No | Row 1 Col 3-4 | -            |
| `email` | Email | Text | ✅ Yes | Row 2 Col 1-2 | -            |
| `phone` | Phone | Text | No | Row 2 Col 3-4 | -            |
| `request_text` | Request | Textarea | ✅ Yes | Row 3 Full (4 cols × 2 rows) | textarea     |
| `attachment` | Attachment | File | No | Row 5 Full (4 cols) | preview |

**Grid layout:**  
4 columns, 5 rows – clean visual grouping of personal info, contact, message, and attachments.
</details>

<details>
<summary>⚙️ Key Process Settings</summary>

- **Process ID:** `request`
- **Initials:** `RQT`
- **Icon:** `device_hub`
- **Access:**
  - `defaultRole=true` → allows all logged-in users
  - `anonymousRole=true` → allows public (not logged-in) users
- **Task behavior:**
  - `assignPolicy="auto"` → automatically opens the form when the process starts
- **Validation:**
  - Email field uses regex pattern to ensure correct syntax
  - Request text is mandatory

> 🔍 **Tip:** Keep *Email* and *Request* fields **required** to ensure every submission is valid.
</details>

 

#### **🎥 Video**

Watch the “Form Creation” segment (00:00 – 12:40):

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/sAVgSaBOkUE?start=0&end=760"
    title="Form Creation in Builder"
    allowfullscreen></iframe>
</div>

 

#### **🧱 Visual Steps**

<div class="cards">

<div class="card">
<h4>1️⃣ Workflow & Metadata</h4>
<p>Builder’s Edit Model / Edit View with process metadata: ID, roles, version, and appearance.</p>
<img class="enlargeable" src="/tutorials/petriflow101/part1/workflow_metadata.png" alt="Workflow and metadata overview" />
</div>

<div class="card">
<h4>2️⃣ Form Layout</h4>
<p>4-column grid showing Name / Surname, Email / Phone, Request (textarea), and Attachment (file preview).</p>
<img class="enlargeable" src="/tutorials/petriflow101/part1/form.png" alt="Request form layout in Builder" />
</div>

</div>

 

#### **🗾 Source & Notes**

- Builder model (Part 1):  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part1/request-form.xml">request-form.xml</a>

<details>
<summary>📄 Source code (XML extract)</summary>

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

> ✅ **Required:** `defaultRole`, `anonymousRole`; **Immediate task:** `assignPolicy="auto"`

 

<!-- tabs:end -->

 

## ✅ Summary

You’ve successfully built your first **PetriFlow form**:
- Clean 4-column grid layout with clear grouping
- Public access through `anonymousRole`
- Required fields and validation
- Auto-assignment for seamless process start

> 🚀 Next: **Part 2 – Deploy to eTask** and test your process in a live environment.

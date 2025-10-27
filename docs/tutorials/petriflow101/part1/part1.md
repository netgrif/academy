# Petriflow 101 - Part 1
### Creating the First Form (Hybrid Layout)

> 💡 **What you’ll build**  
> A public **Request** form in Netgrif Application Builder with required fields and a clean 4‑column layout.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Goal & Context</summary>

You will create a **Request** process with:
- Personal fields (Name, Surname, Email, Phone)
- Free‑text **Request** (textarea)
- Optional **Attachment** (file preview)
- Public access via **anonymousRole**
</details>

<details open>
<summary>🧩 Key Steps</summary>

1. **Open Builder** → `builder.netgrif.cloud`
2. **Create process** → *Request* (ID `request`, initials `RQT`, icon `device_hub`)
3. **Form Editor** → layout **grid (4 columns)**
4. **Add fields** → Name/Surname · Email/Phone · Request · Attachment
5. **Access** → `defaultRole=true`, `anonymousRole=true`, `assignPolicy=auto`
6. **Validate** → email regex; **Preview** the form
</details>

> 🔍 **Tip:** Keep *Email* and *Request* **required** so the form is actionable from the start.

---

#### ** 🎥 Video **

Watch the “Form Creation” segment (00:00–12:40).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=0&end=760" title="Form Creation" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Workflow & Metadata</h4>
<p>Edit Model/Edit View overview with process metadata.</p>
<img src="tutorials/petriflow101/part1/workflow_metadata.png" alt="Workflow and metadata overview" />
</div>

<div class="card">
<h4>2️⃣ Form Layout</h4>
<p>4‑column grid with Name/Surname, Email/Phone, Request (textarea), Attachment.</p>
<img src="tutorials/petriflow101/part1/form.png" alt="Request form layout in Builder" />
</div>

</div>

---

#### ** 🧾 Source & Notes **

- Builder source (Part 1):
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

> ✅ **Required:** `defaultRole`, `anonymousRole`; **Immediate task:** `assignPolicy="auto"`

<!-- tabs:end -->

---

## ✅ Summary

- Process **Request** with a 4‑column layout and required fields
- Public behavior enabled (`anonymousRole`, auto‑assignment)
- Ready for deployment in **eTask** (see Part 2)

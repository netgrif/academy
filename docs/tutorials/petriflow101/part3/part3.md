# Petriflow 101 — Part 3
### First Update & Second Deployment

This short tutorial continues from **Part 2** and shows how to **update your application**, add **email validation**, and **redeploy** it into **eTask**.

---

## 🎯 Objective

In this part, you will:
- Edit your existing *Request* application in the **Netgrif Application Builder**
- Add an **email validation rule** (regex pattern)
- Export a **new XML version** of the process
- Deploy it again to **eTask** and observe versioning behavior

---

## Steps

1. **Open your Request process**
   - Go to [Netgrif Application Builder](https://builder.netgrif.cloud) and open the `Request` process you created earlier.

2. **Correct metadata and identifiers**
   - Update the **Title** or **Initials** if necessary (e.g., change initials from `RQT` to `REQ`).
   - Ensure `defaultRole` and `anonymousRole` are both set to **true**.

3. **Add email validation**
   - Open the **email** data field.
   - Insert a **regex expression** to validate the input (e.g., simple pattern for `@` and domain presence).
   - Add a message: `"Please enter a valid email address"`.

4. **Export the updated XML**
   - Click **Export as XML** in Builder.
   - Save it locally as the new version, e.g. `request_v2.xml`.

5. **Upload into eTask**
   - Login to [eTask](https://etask.netgrif.cloud).
   - Go to **Processes → Upload**, and choose the exported XML file.
   - Upload it as a **minor** or **major** version.
   - Note: previous instances of the process remain bound to the old version; new ones use the updated file.

6. **Verify the form**
   - Open the **public URL** again.
   - Enter test emails to check the validation feedback.
   - Confirm new submissions create instances under the updated process ID.

---

<!-- tabs:start -->

#### **🎥 Video**

Watch “First Update & Second Deployment” (21:33–24:16):

<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=1293&end=1456" 
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
</div>

#### **📄 Source Code (XML)**

[Open in Builder](https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part3/request-form.xml)

> 💡 **Tip:** Even a small change (like adding regex validation) requires redeployment to update the active version in eTask.

<details>
<summary>📄 Example XML Snippet</summary>

```xml
<data type="text">
    <id>email</id>
    <title>Email</title>
    <validations>
        <validation>
            <expression>regex ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$</expression>
            <message>Please type a valid email</message>
        </validation>
    </validations>
</data>
```
</details>

#### **🧱 Preview**

1. **Email field validation in Builder**  
   The Builder interface showing the configured **regex validation** for the Email field.  
   ![Email field validation in Builder](regex.png)

2. **Process version overview in eTask**  
   The eTask **Process Models** view displaying both the original and updated versions of the Request process.  
   ![Process version overview](processV2.png)

3. **Validation in action**  
   The running application demonstrating how the regex validation works when entering an invalid email address.  
   ![Regex validation in running app](regexApp.png)


#### **🧾 Description**

Updating the process demonstrates **version control** in the Netgrif ecosystem:

| Action | Platform | Result |
|--------|-----------|--------|
| Add regex validation | Builder | XML regenerated |
| Export XML | Builder | Creates `request_v2.xml` |
| Upload | eTask | New version registered |
| Start new instance | eTask public URL | Uses updated form |

- Old instances stay on **previous XML**
- New instances automatically use **latest deployed version**
- Validation rules are enforced dynamically

<!-- tabs:end -->

---

## ✅ Summary

You have successfully:
- Updated your application by adding **email regex validation**
- Re-exported and re-uploaded the process to eTask
- Verified how versioning works between **Builder** and **eTask**
- Prepared the base for **Part 4**, where additional workflow logic will be added

---
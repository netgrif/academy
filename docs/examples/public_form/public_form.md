# Simple Public Form Application

## Overview

The Simple Public Form application demonstrates a straightforward multi-step form workflow accessible to both authenticated and anonymous users. This guide outlines the development of the application, detailing tasks, roles, referenced tasks, and navigation functionality using the Netgrif Application Builder and Engine (NAB & NAE).

[Launch the process in Builder](https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/examples/public_form/collectData.xml)

This application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif Application Engine. Refer to [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md) for NAE CE installation instructions.

---

## Application Structure

The Simple Public Form application comprises:

### Tasks
- **Form**: Serves as the main interface and references three sub-tasks (Step 1, Step 2, Step 3).
- **Step 1**: Captures contact information such as name, email, and phone number.
- **Step 2**: Collects request details and allows file attachments.
- **Step 3**: Records user selections and service timelines.
- **Summary**: Displays submitted information for review.

### Referenced Tasks
Each referenced task brings different data components into the form:
- **Step 1:** Contact details (Name, Surname, Email, Phone).
- **Step 2:** Request details (Description, Main and Additional Attachments).
- **Step 3:** User selections (Services, Preferred timelines).

### Roles and Permissions
- **System Role:** Grants administrative access to Step 1, Step 2, and Step 3 for secure data entry.
- **No Assigned Roles:** Ensures both logged-in and anonymous users can access the Form and Summary tasks.

---

## Functionality and Navigation

### Functions
1. **Increment Step:** Advances the user to the next step in the form sequence.

```groovy
		{ def step -> 
		    def matcher = (step =~ /step(\d+)/)
            if (matcher.matches()) {
               int stepNumber = matcher[0][1] as int
               if (stepNumber < 3) {
                  return "step${stepNumber + 1}"
               }
            }
            return step
        }
```

2. **Decrement Step:** Returns the user to the previous step.

```groovy
        { def step ->
           def matcher = (step =~ /step(\d+)/)
           if (matcher.matches()) {
              int stepNumber = matcher[0][1] as int
              if (stepNumber > 1) {
                 return "step${stepNumber - 1}"
              }
           }
           return "step1"
        }
```

### Actions
1. **Next:** Moves the user forward in the workflow and updates the form step.

```groovy
      step: f.step,
      stepper: f.stepper;
      
      def nextStep = incrementStep(stepper.value)
      
      change step value { [useCase.tasks.find{it.transition==nextStep}?.task] }
      change stepper value { nextStep }
```

2. **Back:** Navigates to the previous step and displays the appropriate task.

```groovy
      step: f.step,
      stepper: f.stepper;
      
      def prevStep = decrementStep(stepper.value)
      
      change step value { [useCase.tasks.find{it.transition==prevStep}?.task] }
      change stepper value { prevStep }
```

These functions and actions ensure seamless navigation between steps while dynamically updating form content based on user progress.

---

<div class="container">
    <iframe class="responsive-iframe" src="https://www.youtube.com/embed/CpcVRpBlJ30" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
</div>

---

## Single Form View and URL Generation

A single form view is easily accessible by copying the public form URL and opening it in a new tab or window. Each time the form is accessed, a new process instance is generated.

Example workflow:
1. Copy and open a public form URL:  
   `https://etask.netgrif.cloud/process/MjAyNS1zaG93Y2FzZTkxL2NvbGxlY3REYXRh`
2. The platform generates a unique case ID in the URL, such as:  
   `https://etask.netgrif.cloud/process/MjAyNS1zaG93Y2FzZTkxL2NvbGxlY3REYXRh/678679df78fd2f3a255b5423`
3. To directly access the "Form" task (ID: t1), append `/t1` to the URL:  
   `https://etask.netgrif.cloud/process/MjAyNS1zaG93Y2FzZTkxL2NvbGxlY3REYXRh/678679df78fd2f3a255b5423/t1`

This structure allows for embedding forms dynamically on any webpage or application, enabling flexible and streamlined data collection.
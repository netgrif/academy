# Insurance and Insured - Interprocess Communication

## Overview

The **Insurance and Insured** processes demonstrate interprocess communication in the Netgrif platform. These two models represent the relationship between an insurance policy and the insured individuals. This guide covers the main workflow elements like roles, tasks, transitions, and events within the processes, highlighting how data and states are shared between them.

[Click here to launch Insurance process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/inter_process_communication/insurance-insured/insurance.xml)

[Click here to launch Insured process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/inter_process_communication/insurance-insured/insured.xml)

Change **YOUR_SPACE_NAME** in insurance.xml file to your space name.

## Insurance Process

The **Insurance** process handles the main insurance policy details. It includes actions such as creating the insurance, adding or removing insured persons, calculating the total insurance price, and setting the contract details.

### Key Components:
1. **Fields**:
    - `insurancePrice`: Displays the total price of the insurance, calculated based on the number of insured persons and the period of insurance.
    - `period`: Represents the duration of the insurance in days, with a validation to ensure it ranges between 1 and 365.
    - `insuredPersons`: Stores references to the insured individuals.
    - `objectsInsuredPersons`: Case references to insured persons linked to the insurance process.

2. **Transitions**:
    - **Creation of the Insurance** (`t2`): This transition handles the insurance creation, including setting the period and adding insured persons. The price is dynamically calculated based on the number of insured individuals.
    - **Summary of the Insurance** (`t3`): A summary transition that shows the final insurance price, the list of insured persons, and other contract details.

3. **Event Actions**:
    - **Add Insured Person**: When adding a new insured person, the system creates a new case for the person and assigns the required tasks to collect their details.
    - **Delete Insured Person**: Allows removal of selected insured persons from the insurance policy and recalculates the total price.

## Insured Process

The **Insured** process is linked to each individual insured under a policy. It tracks the personal data of the insured person and ensures that they are correctly associated with their respective insurance policy.

### Key Components:
1. **Fields**:
    - `name`, `surname`, `date`: Collects the personal data of the insured, such as name, surname, and date of birth.
    - `is_insured`: Indicates whether the person is currently insured.
    - `status`: Stores the current status of the insured, such as whether they are insured or not.

2. **Transitions**:
    - **Data of the Insured** (`t1`): This transition is used to collect and manage the personal data of the insured.
    - **Insured** (`t2`): This transition ensures that the person is correctly marked as insured once their data has been processed.

## Interprocess Communication

The **Insurance** and **Insured** processes communicate using the following techniques:
1. **Adding Insured Persons**: The insurance process creates new insured persons by invoking the **Insured** process. The insured persons' data is dynamically linked to the insurance policy.
2. **Price Calculation**: The total insurance price is calculated based on the number of insured persons and the period of the policy, ensuring real-time updates whenever an insured person is added or removed.
3. **Case Linking**: Each insured person is a separate case linked to the insurance policy, allowing for easy tracking and management of individuals under a single policy.

## Actions

```groovy
objectsInsuredPersons: f.objectsInsuredPersons,
insuredPersons: f.insuredPersons,
insurancePrice: f.insurancePrice,
period: f.period;

insuredPersons.value.each{ riadok ->
   def info_user_row = findTask({it._id.eq(riadok)});
   def case_row = findCase {it._id.eq(info_user_row.caseId)};

   if (case_row.getFieldValue("deleteat") == true) {
      change insuredPersons value { insuredPersons.value - riadok };
      change objectsInsuredPersons value { objectsInsuredPersons.value - case_row.stringId }

      workflowService.deleteCase(case_row.stringId);
   }
}
change insurancePrice value { period.value * insuredPersons.value.size() }
```

```groovy
objectsInsuredPersons: f.objectsInsuredPersons,
insuredPersons: f.insuredPersons,
insurancePrice: f.insurancePrice,
period: f.period;

def id_process_insured = workspace + "insured";
def new_insured = createCase(id_process_insured);
def new_insured_data = new_insured.tasks.find{it.transition=="t1"}?.task;

def task_data_insured = findTask({it._id.eq(new_insured_data)});

assignTask(task_data_insured);

setData("t1", new_insured, ["id_parent": ["value": useCase.stringId, "type": "text"]]);

change objectsInsuredPersons value { objectsInsuredPersons.value + new_insured.stringId }
change insuredPersons value { insuredPersons.value + new_insured_data };


change insurancePrice value { period.value * insuredPersons.value.size() }
```

## Conclusion

This example demonstrates the power of the Netgrif platform in handling complex interprocess communication scenarios. The **Insurance** and **Insured** processes are tightly integrated to ensure data consistency, efficient task management, and real-time communication between related cases.

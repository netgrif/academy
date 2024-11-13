# Loan Processing Application

## Overview

The Loan Processing application is designed to manage loan requests and approvals within an organization. The application involves several key roles such as the Applicant, Loan Officer, Credit Analyst, Risk Manager, and Loan Manager. Each role contributes to the process, from submitting a loan application to final approval and funding.

This application demonstrates the effective use of workflows, forms, data fields, roles, transitions, and metadata within the Netgrif Application Builder (NAB) and Engine (NAE).

## Key Roles and Data Fields

- **Roles:**
    - Applicant
    - Loan Officer
    - Credit Analyst
    - Risk Manager
    - Compliance Officer
    - Finance Officer
    - Loan Manager

- **Data Fields:**
    - Applicant Name
    - Loan Amount
    - Credit Score
    - Annual Income
    - Collateral
    - Loan Purpose
    - Employment Status
    - Loan Status
    - Approval Comments
    - Risk Score
    - Loan Approval Decision

## Workflow Stages

1. **Submit Loan Application:**
    - Role: Applicant
    - Key Data: Applicant Name, Loan Amount, Loan Purpose
    - Status changes to "Under Review."

2. **Review Loan Application:**
    - Role: Loan Officer
    - Loan Officer reviews the application and decides whether to proceed.
    - Status changes to "Credit Check" if approved.

3. **Perform Credit Check:**
    - Role: Credit Analyst
    - Credit Score is evaluated, and a decision is made on proceeding to risk assessment.

4. **Evaluate Risk:**
    - Role: Risk Manager
    - Risk score is evaluated based on various factors. If the score is acceptable, the loan proceeds to final approval.

5. **Final Approval:**
    - Role: Loan Manager
    - The loan is either approved or rejected based on the risk evaluation and other factors.

6. **Fund Loan:**
    - Role: Finance Officer
    - If approved, the loan is funded, and the process is completed.

## Transition Logic

- The system automates transitions between stages, utilizing data-driven decisions, such as:
    - If the credit score is above a certain threshold, the application moves to risk assessment.
    - Loan status updates based on risk evaluation results and approval decisions.

## Conclusion

The Loan Processing application is a comprehensive example of how to automate and manage loan requests using Petriflow and Netgrif Application Builder and Engine. The structured approach to data and role management ensures a smooth and efficient workflow.

[Click here to launch the process in Builder](https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/examples/loan/loan.xml)

The loan processing application is runnable in [Demo](https://etask.netgrif.cloud/) or your own instance of Netgrif Application Engine. To install NAE CE, follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

[Link to the LinkedIn post](https://www.linkedin.com/pulse/generative-ai-meets-petriflow-building-loan-app-60-minutes-petrovi%C4%8D-pyb6e/)
# Embedded Survey Application
Embedded Survey Application is a **simple three-step** (three user-based tasks) **process-based application** that gathers all user personal information.
In the first task (step), user fills all personal information and address. Mention that **phone number and email have
to have a specific format** otherwise, the system won't allow the user to continue. In this step user also fills postal
code. The postal code is then used to **call a web service script** that provides the user with all places that are connected with
the given postal code.

In the second task, the user answers the question. The last question gives the opportunity to answer "Other". When this option is selected, a **new
text field appears** on the screen and the user can fill alternative answer. This feature is done by **simple script** that changes the behaviour of the datafield.

In the last task, a review of the first two steps can be found. This task can be only viewed, nothing else can be done here.
Also **generated PDF file** is stored on top of the form. This PDF file can be downloaded by clicking on it.

<h3>Embedded application</h3>
In this use case anonymous role was used for embedded application functionality  (also admin and system roles were created extra). But any kind of external authentification can be integrated with the platform.
<iframe style="height: 1150px;" title="Request demo" src="https://demo.netgrif.com/process/6294daff12a4c25855bd490b_survey"></iframe>

<h3>Video of working with the application:</h3>
<iframe style="height:650px" src="https://www.youtube.com/embed/K4koGOg7Dpo" title="YouTube video player" frameborder="0" allow="accelerometer;
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The application was created in under 30 minutes, without deeper knowledge of any pro-code language. It contains the generation of the pdf file, the creation of complex data forms, and multiple short scripts that were
just drag'n'droped (containing postal code web service). The whole application can be easily embedded in the external web.

<h3>List of all cases</h3>
All cases created in the embedded application are securely saved in / existing in the Netgrif Application Engine web application. All of these process instances
of survey application are manageable and visible for the application administrator or for another user with a given role.
<img style="display: block;
            margin-left: auto;
            margin-right: auto;
            width: 90%;" src="examples/embedded/list.png"/>

Embedded survey application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif Application Engine.
To find out how to install NAE CE both locally or on the server follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

<a style="font-size:26px;" href="https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/embedded/survey.xml" target="_blank">Click here to launch the process in Builder</a>

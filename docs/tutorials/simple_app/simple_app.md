# Simple application - non-extended and extended

Original post in [this newsletter](https://www.linkedin.com/pulse/extend-functionality-lcnc-%C4%BEubo%C5%A1-petrovi%C4%8D/?trackingId=U3zZe1TETZOa8gbf0b%2FDcg%3D%3D).  

## Using only native funcionality

In the example, you can see the creation of a process-based application in our tool Netgrif Application Builder (NAB). After I finished creation in just a minute, the source code in the language Petrfilow was downloaded and later uploaded to another tool called eTask where our Netgrif Application Engine (NAE) is running. The eTask with the help of NAE can in run time compile/interpret source code from Petriflow on the server, without the need for deployment. The whole deployment of the Petriflow source code is done by uploading the file. And since the moment the Petriflow application is uploaded and compiled into the three-tier architecture of the eTask web application, users can (if roles allow them to do so) create new process instances that we also call cases of process-based application.

<div class="container">
    <iframe class="responsive-iframe" src="https://www.youtube.com/embed/oaZinrP5zdg" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
</div>

## Using extended funcionality by Java

Our eTask is a three-tier web application with Java Spring Boot in the backend. That means a simple thing, developers who are not full-stack web developers, but people who can implement simple functions are able to extend their/our ActionsAPI. How? By simply adding a few lines of code into the file CustomActionsDelegate in their own eTask application that can be downloaded for free on our GitHub - Netgrif free Community Edition on GitHub! Or request this functionality from us, and we will implement it into the NAE.
In the example above, a simple functionality creates an image file from the provided text. The generated picture is a QR code (in our case a link to Netgrif's LinkedIn page). On event, after the value to text field is saved a picture is generated. The first/task form contains a text field and a file field where the user can edit the values of fields. In the second form/task, the user can only see the file field, and open or download the picture.

<div class="container">
    <iframe class="responsive-iframe" src="https://www.youtube.com/embed/dPRKlFUtw-M" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
</div>
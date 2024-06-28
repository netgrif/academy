# Generic Request Application with custom Web Services

<iframe width="700" height="800" src="https://www.youtube.com/embed/o7kzoEu6VPM" title="YouTube video player"
frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

Generic Request Application and Custom Web Services application is runnable in [Demo](https://etask.netgrif.cloud/) or in
your own
instance
of Netgrif Application Engine. To find out how to install NAE CE both locally or on the server
follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

## Custom Web Service code snippet

```groovy
import javax.net.ssl.HttpsURLConnection
import groovy.json.JsonSlurper

def randomPerson(def name, def surname, def email){
   URL url = new URL("https://randomuser.me/api/");
   HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
   con.setRequestMethod("GET");
   int status = con.getResponseCode();
   Reader streamReader = null;
   if (status > 299) {
   streamReader = new InputStreamReader(con.getErrorStream());
 } else {
   streamReader = new InputStreamReader(con.getInputStream());
 }
   def json = new JsonSlurper()
   def object = json.parseText(streamReader.text)
   change name value { object.results.get(0).get("name").get("first") }
   change surname value { object.results.get(0).get("name").get("last") }
   change email value { object.results.get(0).get("email") }
}
```

## Runner code snippet

```groovy
import com.netgrif.application.engine.auth.domain.*
import com.netgrif.application.engine.petrinet.domain.roles.ProcessRole
import com.netgrif.application.engine.auth.service.interfaces.IUserService

    @Autowired
    private IUserService userService

    @Override
    void run(String... args) throws Exception {
        log.info("Calling custom runner");

        userService.saveNew(new User(
                name: "User",
                surname: "Test",
                email: "test@netgrif.com",
                password: "password",
                state: UserState.ACTIVE,
                authorities: [] as Set,
                processRoles: [] as Set))
    }
```

[Click here to launch the process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/request-ws/requestWS.xml)

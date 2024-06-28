# Import CSV as Cases

<iframe width="700" height="800" src="https://www.youtube.com/embed/VlflmcUwI5o" title="YouTube video player"
frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

Import CSV as cases application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif
Application
Engine. To find out how to install NAE CE both locally or on the server follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

## CSV pom dependency

```XML
<!--CSV pom-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-csv</artifactId>
    <version>1.6</version>
</dependency>
```

## CSV parser code snippet

```groovy
import org.apache.commons.csv.*

void importCSVFile(FileField file, String net, List fields){
try{
        def stream = new FileInputStream(new File(file.value.path))
        CSVParser parser = CSVParser.parse(stream, Charset.forName("UTF-8"), CSVFormat.EXCEL.withDelimiter(',' as char))

        for (CSVRecord record in parser.iterator()) {
            def cas = createCase(net, record[0])
            fields.eachWithIndex { String entry, int i ->
                cas.getDataField(entry).setValue(record[i])
            }
            workflowService.save(cas)
        }
    } catch (Exception e) {
        log.error("Import CSV File error", e)
    }
}
```

[Click here to launch the Mobile process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/csv-import/mobile.xml)

[Click here to launch the Import process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/csv-import/import.xml)

[CSV file for testing purposes can be download here.](https://github.com/netgrif/academy/blob/main/docs/examples/csv-import/mobile_list.csv)

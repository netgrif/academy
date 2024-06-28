# Export CSV from Cases

<iframe width="700" height="800" src="https://www.youtube.com/embed/lin-jxKO-I4" title="YouTube video player"
frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

!> This tutorial follows [the CSV Import tutorial](examples/csv-import/csv-import.md).

Export CSV from cases application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif
Application Engine. To find out how to install NAE CE both locally or on the server
follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

## CSV export code snippet

```groovy
import com.netgrif.application.engine.petrinet.domain.dataset.FileField
import com.netgrif.application.engine.workflow.domain.QCase
import com.netgrif.application.engine.workflow.domain.Case

def exportCSVFile(String net, List fields) throws IOException {
        File csvOutputFile = new File("storage/" + useCase.stringId + "_csv_file.csv")
        FileWriter writer = new FileWriter(csvOutputFile);
        workflowService.searchAll(QCase.case$.processIdentifier.eq(net)).eachWithIndex{ Case ca, int i ->
            writer.write(i.toString() + ",")
            fields.each{
                if(ca.getFieldValue(it) != null)
                    writer.write(escapeSpecialCharacters(ca.getFieldValue(it).toString()) + ",")
                else
                    writer.write(",")
            }
            writer.write(System.lineSeparator())
        }
        return new FileFieldValue(csvOutputFile.name,csvOutputFile.path)
    }

    String escapeSpecialCharacters(String data) {
        String escapedData = data.replaceAll("\\R", " ")
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"")
            escapedData = "\"" + data + "\""
        }
        return escapedData;
    }
```

[Click here to launch the process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/csv-export/export.xml)

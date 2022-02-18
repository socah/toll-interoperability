// Component
// είναι ένας πίνακας στον οποίο εμφανίζονται οι διελεύσεις του πίνακα data
// το data δίνεται ως prop
// επίσης εμφανίζεται και ένα link για να κατεβούν τα δεδομένα ως csv
function SettlementSelection({data}) {

    
    if(data.length === 0){ // αν δεν έχουμε δεδομένα
        return (<p>Δεν υπάρχουν δεδομένα προς προβολή.</p>);
    }

    // μετατροπή του data σε csv κείμενο
    function dataToCSV(){
        const heading = Object.keys(data[0]).join(",");
        const body = data.map((j) => Object.values(j).join(",")).join("\n")

        console.log(heading);
        console.log(body);
        return heading + "\n" + body;
    }

    // δημιουργία url για την λήψη του csv
    // το μόνο κακό είναι ότι το αρχείο που κατεβαίνει έχει περίεργο τυχαίο όνομα
    function getDownloadURL(){
        var data = new Blob([dataToCSV()], { type: 'text/csv' });
        var url = window.URL.createObjectURL(data);
        console.log(url);
        return url
    }

    return (

        <div>

            <a href={getDownloadURL()}>Κατέβασε CSV</a>

            <table>
                <thead>
                <tr>
                    <th scope='col'>PassID</th>
                    
                    <th scope='col'>Timestamp</th>
                    <th scope='col'>Station Name</th>
                    <th scope='col'>Charge</th>
                    <th scope='col'>Tag ID</th>
                </tr>
                </thead>
                {
                    // δημιουργία ενός row για κάθε στοιχείο του array data
                    data.map( (element) =>
                        (
                            
                            <tbody key={element.passID}>
                                <tr>
                                    <th scope="row">{element.passID}</th>

                                    <td>{element.timestamp}</td>
                                    <td>{element.stationRef}</td>
                                    <td>{element.charge}</td>
                                    <td>{element.tagID}</td>

                                </tr>
                            </tbody>
                        )
                    )

                }
            </table>

          </div>
    );
  }

  
  export default SettlementSelection;
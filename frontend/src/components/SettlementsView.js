import axios from "axios";

// Component 
function ProviderSelection({data}) {

    if(data.length === 0){ // αν δεν έχουμε δεδομένα
        return (<p>Δεν υπάρχουν δεδομένα προς προβολή.</p>);
    }

    function showSettlementPasses(element) {
        // redirect to showsettlementpasses with element parameter
        window.location.replace("/showsettlementpasses/"+element.settlementID)
    }

    let confirmPayment = (element) => {

        // popup dialog όπου ο χρήστης εισάγει τον κωδικό της τράπεζας
        const enteredCode = prompt('Εισάγετε τον κωδικό επιβεβαίωσης')
        
        const url = `https://localhost:9103/interoperability/api/settlements/PaySettlement/${element.settlementID}/${enteredCode}`;

        axios.post(url)
        .then((res) => {
          alert("Η πληρωμή επιβεβαιώθηκε επιτυχώς!")
          // αν αλλάξαμε την κατάσταση της οφειλής σε πληρωμένη κάνουμε ανανέωση της σελίδας
          window.location.replace("/showsettlements")
        }).catch((e) => {
          alert("Σφάλμα κατά την επιβεβαίωση της πληρωμής")
        })
      }

    return (

        <div id="settlements view">

        <h3> Debts </h3>

            <table>
                <thead>
                <tr>                
                    <th scope='col'>Settlement ID</th>
                    <th scope='col'>From</th>
                    <th scope='col'>To</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>Paid</th>
                    <th scope='col'>Operator Credited</th>
                    <th scope='col'></th>
                    <th scope='col'></th>
                </tr>
                </thead>
                {
                    // δημιουργία ενός row για κάθε στοιχείο του array data που αντιστοιχεί σε debt
                    data.map( (element) =>
                        { 
                            return (element.Type==="credit")? null : <tbody key={element.settlementID}>
                                <tr>
                                    <th scope="row">{element.settlementID}</th>

                                    <td>{element.dateFrom}</td>
                                    <td>{element.dateTo}</td>
                                    <td>{element.amount}</td>
                                    <td>{element.paid ? "Yes" : "No"}</td>
                                    <td>{element.operatorCredited}</td>
                                    <td>
                                        <button onClick={() => showSettlementPasses(element)}>
                                            Λεπτομέρειες
                                        </button>
                                    </td>
                                    {
                                        element.paid ? (<td> </td>) : (
                                        <td>
                                            <button id={`"${element.settlementID.toString()}"`} onClick={() => confirmPayment(element)}>
                                                Επιβεβαίωση Πληρωμής
                                            </button>
                                        </td>)
                                    }
                                </tr>
                            </tbody>
                        }
                    )
                }
            </table>

            <h3> Credits </h3>

            <table>
                <thead>
                <tr>                
                    <th scope='col'>Settlement ID</th>
                    <th scope='col'>From</th>
                    <th scope='col'>To</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>Paid</th>
                    <th scope='col'>Operator Debited</th>
                    <th scope='col'></th>
                    <th scope='col'></th>
                </tr>
                </thead>
                {
                    // δημιουργία ενός row για κάθε στοιχείο του array data που αντιστοιχεί σε credit
                    data.map( (element) =>
                        { 
                            return (element.Type==="debited")? null : <tbody key={element.settlementID}>
                                <tr>
                                    <th scope="row">{element.settlementID}</th>

                                    <td>{element.dateFrom}</td>
                                    <td>{element.dateTo}</td>
                                    <td>{element.amount}</td>
                                    <td>{element.paid ? "Yes" : "No"}</td>
                                    <td>{element.operatorDebited}</td>
                                    <td>
                                        <button  onClick={() => showSettlementPasses(element)}>
                                            Λεπτομέρειες
                                        </button>
                                    </td>
                                    {
                                        element.paid ? (<td> </td>) : (
                                        <td>
                                            <button id={`"${element.settlementID.toString()}"`} onClick={() => confirmPayment(element)}>
                                                Επιβεβαίωση Πληρωμής
                                            </button>
                                        </td>)
                                    }
                                </tr>
                            </tbody>
                        }
                    )
                }
            </table>

          </div>
    );
  }

  
  export default ProviderSelection;
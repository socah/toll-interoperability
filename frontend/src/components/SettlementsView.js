// Component 
function ProviderSelection({data}) {

    if(data.length === 0){ // αν δεν έχουμε δεδομένα
        return (<p>Δεν υπάρχουν δεδομένα προς προβολή.</p>);
    }

    function showSettlementPasses(element) {
        // redirect to showsettlementpasses with element parameter
        window.location.replace("/showsettlementpasses/"+element.settlementID)
    }

    return (

        <div id="settlements view">

            <table>
                <thead>
                <tr>                
                    <th scope='col'>Settlement ID</th>
                    <th scope='col'>From</th>
                    <th scope='col'>To</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>Paid</th>
                    <th scope='col'>Type</th>
                    <th scope='col'></th>
                </tr>
                </thead>
                {
                    // δημιουργία ενός row για κάθε στοιχείο του array data
                    data.map( (element) =>
                        (
                            
                            <tbody key={element.settlementID}>
                                <tr>
                                    <th scope="row">{element.settlementID}</th>

                                    <td>{element.dateFrom}</td>
                                    <td>{element.dateTo}</td>
                                    <td>{element.amount}</td>
                                    <td>{element.paid}</td>
                                    <td>{element.Type}</td>
                                    <td>
                                        <button id="settlement_details" onClick={() => showSettlementPasses(element)}>
                                            Λεπτομέρειες
                                        </button>
                                    </td>

                                </tr>
                            </tbody>
                        )
                    )

                }
            </table>

          </div>
    );
  }

  
  export default ProviderSelection;
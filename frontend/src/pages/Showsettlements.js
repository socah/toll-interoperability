import { useEffect, useState } from "react";
import axios from "axios";
import SettlementsView from '../components/SettlementsView'

import { useHistory } from 'react-router-dom';

var ls = require('local-storage');

function Showsettlements() {

    const history = useHistory();

    console.log("Showsettlements called")
    var [data, setData] = useState([]);

    // αν δεν είναι συνδεμένος, ανακατεύθυνση προς το login screen
    if(!ls.get("accessToken")){
      history.push("/");
    }

    useEffect(() => {
      var error_msg_elem = document.getElementById("error");

      // προετοιμασία του url και προσθήκη παραμέτρων
      var url = `https://localhost:9103/interoperability/api/settlements/GetSettlements/`;

      var config = {
        headers: {'X-OBSERVATORY-AUTH': "Bearer " + ls.get("accessToken")},
        params: {
          format: "json"
        },
      }

      // στέλνουμε request
      axios.get(url, config)
        .then((res) => {
          // αν λάβαμε response 200 OK

          // ενημερώνουμε τα data
          setData(res.data.SettlementsList);

          // debug
          console.log(res.data.SettlementsList)

        }).catch((e) => {
          // Είτε το response είναι κωδικό != 200 είτε δημιουργήθηκε κάποιο exception

          // εμφανίζουμε κατάλληλο κείμενο σφάλματος
          error_msg_elem.innerHTML = "Σφάλμα κατά το αίτημα";
          error_msg_elem.style.visibility = 'visible';
    
          //debug
          console.log(e);
        })

    }, [])

    

    return (
        <div className="container">

            <h2>Showsettlements Page</h2>

            <small id="error" style={{color: '#ff0000', visibility: 'hidden'}}></small>

            <SettlementsView data={data}/>

        </div>
    );
  }
  
  export default Showsettlements;
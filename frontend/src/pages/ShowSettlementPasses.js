import { useEffect, useState } from "react";
import axios from "axios";
import SettlementPassesView from '../components/SettlementPassesView';
import { useParams } from "react-router-dom"

const ls = require('local-storage')

function ShowSettlementPasses() {
    const {settlementID} = useParams();
    var [data, setData] = useState([]);

    useEffect(() => {
        
        var error_msg_elem = document.getElementById("error");

        // προετοιμασία του url και προσθήκη παραμέτρων
        var url = `https://localhost:9103/interoperability/api/settlements/GetPassesForSettlement/${settlementID}`;
  
        
        var config = {
          headers: {'X-OBSERVATORY-AUTH': "Bearer " + ls.get("accessToken")},
          //params: {
          //  settlement_ID: settlementID
          //},
        }
  
        // στέλνουμε request
        axios.get(url, config)
          .then((res) => {
            // αν λάβαμε response 200 OK
  
            // ενημερώνουμε τα data
            setData(res.data.PassesList);
  
            // debug
            console.log(res.data.PassesList)
  
          }).catch((e) => {
            // Είτε το response είναι κωδικό != 200 είτε δημιουργήθηκε κάποιο exception
  
            // εμφανίζουμε κατάλληλο κείμενο σφάλματος
            error_msg_elem.innerHTML = "Σφάλμα κατά το αίτημα";
            error_msg_elem.style.color = '#ff0000';
            error_msg_elem.style.visibility = 'visible';
      
            //debug
            console.log(e);
          })
  
      }, [settlementID])

      let handleClick = () => {
        
        var error_msg_elem = document.getElementById("error");

        var confirm_button = document.getElementById("confirm-payment-button")

        // popup dialog όπου ο χρήστης εισάγει τον κωδικό της τράπεζας
        const enteredCode = prompt('Εισάγετε τον κωδικό επιβεβαίωσης')
        
        const url = `https://localhost:9103/interoperability/api/settlements/PaySettlement/${settlementID}/${enteredCode}`;

        axios.post(url)
        .then((res) => {
          error_msg_elem.innerHTML = 'Η πληρωμή επιβεβαιώθηκε επιτυχώς';
          error_msg_elem.style.color = '#38ba00'; // green color
          error_msg_elem.style.visibility = 'visible';
          confirm_button.disabled = true;
        }).catch((e) => {
          error_msg_elem.innerHTML = "Σφάλμα κατά την επιβεβαίωση της πληρωμής";
          error_msg_elem.style.visibility = 'visible';

        })
      }

    return (
      <div className="container">
        <h2> Showsettelmentpasses Page </h2>
        <div className="grid">
          <small id="error" style={{color: '#ff0000', visibility: 'hidden'}}></small>
          <button id="confirm-payment-button" onClick={handleClick}> Επιβεβαίωση Πληρωμής </button>
        </div>

        

        <SettlementPassesView data={data}/>

      </div>
    );
  }

  
  export default ShowSettlementPasses;
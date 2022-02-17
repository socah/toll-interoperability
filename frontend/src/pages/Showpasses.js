import { useState } from "react";
import axios from "axios";
import ProviderSelection from '../components/ProviderSelection'
import PassesView from '../components/PassesView'

var ls = require('local-storage');

function Showpasses() {

  var [data, setData] = useState([]);

    // αν δεν είναι συνδεμένος, ανακατεύθυνση προς το login screen
    if(!ls.get("accessToken")){
      window.location.replace("/");
    }

    function handleSubmit(e){

      e.preventDefault();

      //  παίρνουμε τα element από το DOM
      var submit_button = document.getElementById("submit-button")
      var error_msg_elem = document.getElementById("error");

      // επαναφέρω τις καταστάσεις διάφορων element
      document.getElementById("date_from").setAttribute("aria-invalid", "false");
      document.getElementById("date_to").setAttribute("aria-invalid", "false");
      error_msg_elem.style.visibility = 'hidden';

      // παίρνουμε τα δεδομένα που εισάχθηκαν στο form
      var op1_ID = document.getElementById("op1_ID").value;
      var op2_ID = document.getElementById("op2_ID").value;
      var date_from = document.getElementById("date_from").value.replaceAll("-","");
      var date_to = document.getElementById("date_to").value.replaceAll("-","");

      // debug print
      console.log({op1_ID, op2_ID, date_from, date_to});

      // έλεγχος ημερομηνιών
      if(date_from > date_to){

        // κοκκινίζω τα πεδία ημερομηνιών
        document.getElementById("date_from").setAttribute("aria-invalid", "true");
        document.getElementById("date_to").setAttribute("aria-invalid", "true");

        error_msg_elem.innerHTML = "Η ημερομηνία 'Από' είναι μεταγενέστερη της 'Έως'";
        error_msg_elem.style.visibility = 'visible';
        return;
      }

      // προετοιμασία του url και προσθήκη παραμέτρων
      var url = `https://localhost:9103/interoperability/api/PassesAnalysis/${op1_ID}/${op2_ID}/${date_from}/${date_to}`;

      // εμφανίζουμε στο κουμπί το animation φορτώματος
      submit_button.setAttribute("aria-busy", "true");
      submit_button.disabled = true;

      // στέλνουμε request
      axios.get(url, null, { params: {
        format: "json"
      }})
      .then((res) => {
        // αν λάβαμε response 200 OK

        // κρύβουμε το animation φορτώματος
        submit_button.setAttribute("aria-busy", "false");
        submit_button.disabled = false;

        // ενημερώνουμε τα data
        setData(res.data.PassesList);

        // debug
        console.log(res.data.PassesList)

      }).catch((e) => {
        // Είτε το response είναι κωδικό != 200 είτε δημιουργήθηκε κάποιο exception

        // κρύβουμε το animation φορτώματος
        submit_button.setAttribute("aria-busy", "false");
        submit_button.disabled = false;

        // εμφανίζουμε κατάλληλο κείμενο σφάλματος
        error_msg_elem.innerHTML = "Σφάλμα κατά το αίτημα";
        error_msg_elem.style.visibility = 'visible';
   
        //debug
        console.log(e);
      })

    }

    return (
      <div className="container">
        <h2>Showpasses Page</h2>

        {/* form for search parameters */}
        <form onSubmit={handleSubmit}>

            <div className="grid">

              <label>
                Λειτουργός 1
                <ProviderSelection name="op1_ID" id="op1_ID"/>
              </label>

              <label>
                Λειτουργός 2
                <ProviderSelection name="op2_ID" id="op2_ID"/>
              </label>

              <label>
                Από
                <input type="date" name="date_from" id="date_from" required/>
              </label>

              <label>
                Έως
                <input type="date" name="date_to" id="date_to" required/>
              </label>

            </div>
        
            <small id="error" style={{color: '#ff0000', visibility: 'hidden'}}></small>

            <button id="submit-button"> Εύρεση </button>
          </form>

          <PassesView data={data}/>
          
      </div>
    );
}
  
  export default Showpasses;
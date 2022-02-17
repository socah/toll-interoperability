import { useState } from "react";
import axios from "axios";

var ls = require('local-storage');


function Login() {

    // if logged in go to options pages
    if(ls.get("accessToken")){
      window.location.replace("/options");
    }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // debug
      console.log({username, password});

      // παίρνουμε τα παρακάτω elements του DOM
      var submit_button = document.getElementById("login-submit-button");
      var error_msg = document.getElementById('login-error');
      error_msg.style.visibility = "hidden";

      // παίζει στο button το animation φορτώματος
      submit_button.setAttribute("aria-busy", "true");
      submit_button.disabled = true;

      // make request
      axios.post("https://localhost:9103/interoperability/api/auth/login", null, { params: {
        username, password
      }})
      .then((res) => {
        // πήραμε response με 200 ΟΚ

        // κρύβουμε το animation φορτώματος
        submit_button.setAttribute("aria-busy", "false");
        submit_button.disabled = false;
        
        // αποθηκεύουμε το JWT token
        ls.set("accessToken", res.data.accessToken);
        console.log(ls.get("accessTocken"));

        // redirect προς το /options
        window.location.replace("/options");

      }).catch((e) => {
        // Είτε το response είναι κωδικό != 200 είτε δημιουργήθηκε κάποιο exception

        // κρύβουμε το animation φορτώματος
        submit_button.setAttribute("aria-busy", "false");
        submit_button.disabled = false;

        // δείχνουμε το κειμενο σφάλματος
        error_msg.style.visibility = "visible";

        // σε περίπτωση που είχε αποθηκευτεί κάποιο JWT token, αφαίρεσε το
        ls.remove("accessToken");

        console.log(e);
      })
    }


    return (
      <div className="container">

        <h2>Login</h2>

        <div>
          <form onSubmit={handleSubmit}>

            <div className="grid">

              <label>
                Όνομα χρήστη:
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {setUsername(e.target.value)}}
                />
              </label>

              <label>
                Κωδικός πρόσβασης:
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                />
              </label>

            </div>

            <small id="login-error" style={{visibility: 'hidden', color: '#ff0000'}}>
              Λανθασμένος συνδυασμός ονόματος χρήστη και κωδικού.
            </small>          


            <button id="login-submit-button"> Σύνδεση </button>
          </form>
        </div>

        <p>Η παροχή στοιχείων εισόδου γίνεται μετά από τηλεφωνική επικοινωνία με τους διαχειριστές του συστήματος.</p>
        
      </div>
    );
  }
  
  export default Login;
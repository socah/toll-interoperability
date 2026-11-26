import { useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';

var ls = require('local-storage');


function Login() {

  const history = useHistory();

  // if logged in go to options pages
  if(ls.get("accessToken")){
    history.push("/options");
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
      history.push("/options");

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
              Username:
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </label>

          </div>

          <small id="login-error" style={{visibility: 'hidden', color: '#ff0000'}}>
            Incorrect username or password.
          </small>          


          <button id="login-submit-button"> Log in </button>
        </form>
      </div>

      <p>Login credentials are issued by the system administrators by phone.</p>
      
    </div>
  );
}
  
  export default Login;
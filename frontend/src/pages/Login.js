import { useState } from "react";
import axios from "axios";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      
      console.log({username, password});


      axios.post("https://localhost:9103/interoperability/api/auth/login", null, { params: {
        username, password
      }})
      .then(() => {
        console.log('yeah');
      })
    }


    return (
      <div>
        <h2>Login Page</h2>

        <div className="Login">
          <form onSubmit={handleSubmit}>

            <label>Όνομα χρήστη:</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
            />

            <label>Κωδικός πρόσβασης:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
            />

            <button> Σύνδεση </button>
          </form>
        </div>

        <p>Η παροχή στοιχείων εισόδου γίνεται μετά από τηλεφωνική επικοινωνία με τους διαχειριστές του συστήματος.</p>
      </div>
    );
  }
  
  export default Login;
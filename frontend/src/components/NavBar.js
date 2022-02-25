import axios from "axios"
import { useHistory } from 'react-router-dom';


var ls = require('local-storage');



function Navbar() {

    const history = useHistory();

    // αν κάνει click στο όνομα τότε πηγαίνει στο homepage
    // αν είναι συνδεμένος τότε στο /options (dashboard)
    // αλλιώς στο / (login screen)
    function gotoHomepage(){
        if(ls.get("accessToken")){
            history.push("/options");
        }else{
            history.push("/");
        }
    }

    // συνάρτηση που αποσυνδέει τον χρήστη
    function disconnect(){
        const accessToken = ls.get("accessToken")

        // make request
        axios.post("https://localhost:9103/interoperability/api/auth/logout", null, { params: {
            token: accessToken
        }})
        .then((res) => {
            // πήραμε response με 200 ΟΚ

            ls.remove("accessToken");
            history.push("/");

        }).catch((e) => {
            // Είτε το response είναι κωδικό != 200 είτε δημιουργήθηκε κάποιο exception

            // Σε αυτή την περίπτωση πάλι θα κάνουμε το ίδιο
            // Ισως πρέπει να προστεθεί κάποιο notification..
            ls.remove("accessToken");
            history.push("/");

        console.log(e);
      })
    }

    // ανακατεύθυνση προς το dashboard
    function gotoDashboard(){
        history.push("/options");
    }

    return (

        <nav>
            <ul>
                <li onClick={gotoHomepage} style={{cursor: 'pointer'}}>
                    <h1>Σύστημα Διαλειτουργικότητας Διοδίων</h1>
                </li>
            </ul>
            <ul>

                { window.location.pathname !== "/options" && ls.get("accessToken") && 
                <li>
                    <button onClick={gotoDashboard}>Dashboard</button>
                </li>
                }

                {ls.get("accessToken") && 
                <li>
                    <button onClick={disconnect}>Αποσύνδεση</button>
                </li>
                }

            </ul>
        </nav>
    );
  }

  
  export default Navbar;
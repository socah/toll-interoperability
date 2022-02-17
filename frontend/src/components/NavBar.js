
var ls = require('local-storage');


function Navbar() {

    // αν κάνει click στο όνομα τότε πηγαίνει στο homepage
    // αν είναι συνδεμένος τότε στο /options (dashboard)
    // αλλιώς στο / (login screen)
    function gotoHomepage(){
        if(ls.get("accessToken")){
            window.location.replace("/options");
        }else{
            window.location.replace("/");
        }
    }

    // συνάρτηση που αποσυνδέει τον χρήστη
    function disconnect(){
      ls.remove("accessToken");
      window.location.replace("/");
    }

    // ανακατεύθυνση προς το dashboard
    function gotoDashboard(){
        window.location.replace("/options");
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
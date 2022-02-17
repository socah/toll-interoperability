var ls = require('local-storage');

// Σελίδα "Dashboard" όπου φαίνονται όλες οι δυνατές ενέργειες
function Options() {

    // αν δεν είναι συνδεμένος, ανακατεύθυνση προς το login screen
    if(!ls.get("accessToken")){
      window.location.replace("/");
    }

    function gotoShowpasses(){
      window.location.replace("/showpasses");
    }

    function gotoShowsettlements(){
      window.location.replace("/showsettlements");
    }

    return (
      <div className="container">

        <h2>Επιλογές</h2>

        <div>

          <button onClick={gotoShowpasses}>Προβολή δεδομένων Διελεύσεων</button>
          <button onClick={gotoShowsettlements}>Προβολή οφειλών</button>

        </div>

        
      </div>
    );
  }
  
  export default Options;
import { useHistory } from 'react-router-dom';
var ls = require('local-storage');


// Σελίδα "Dashboard" όπου φαίνονται όλες οι δυνατές ενέργειες
function Options() {

  const history = useHistory();

    // αν δεν είναι συνδεμένος, ανακατεύθυνση προς το login screen
    if(!ls.get("accessToken")){
      history.push("/");
    }

    function gotoShowpasses(){
      history.push("/showpasses");
    }

    function gotoShowsettlements(){
      history.push("/showsettlements");
    }

    return (
      <div className="container">

        <h2>Options</h2>

        <div>

          <button onClick={gotoShowpasses}>View pass data</button>
          <button onClick={gotoShowsettlements}>View settlements</button>

        </div>

        
      </div>
    );
  }
  
  export default Options;

function ProviderSelection({name, id}) {

    // επιστρέφει ένα select με όλα τους providers

    // TODO: βέβαια θα ήταν καλύτερο να υπήρχε ένα API CALL
    // από το οποίο θα λαμβάναμε όλους τους διαθέσιμους providers
    // και αυτό όμως δουλεύει για τώρα

    return (

        <select name={name} id={id} required>
                <option value="aodos">Αττική Οδός</option>
                <option value="egnatia">Εγνατία Οδός</option>
                <option value="gefyra">Γέφυρα</option>
                <option value="kentriki_odos">Κεντική Οδος</option>
                <option value="moreas">Moreas</option>
                <option value="nea_odos">Νέα Οδός</option>
                <option value="olympia_odos">Ολυμπία Οδός</option>
        </select>
    );
  }

  
  export default ProviderSelection;
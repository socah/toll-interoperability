
function ProviderSelection({name, id}) {

    // επιστρέφει ένα select με όλα τους providers

    // TODO: βέβαια θα ήταν καλύτερο να υπήρχε ένα API CALL
    // από το οποίο θα λαμβάναμε όλους τους διαθέσιμους providers
    // και αυτό όμως δουλεύει για τώρα

    return (

        <select name={name} id={id} required>
                <option value="aodos">Attiki Odos</option>
                <option value="egnatia">Egnatia Odos</option>
                <option value="gefyra">Gefyra</option>
                <option value="kentriki_odos">Kentriki Odos</option>
                <option value="moreas">Moreas</option>
                <option value="nea_odos">Nea Odos</option>
                <option value="olympia_odos">Olympia Odos</option>
        </select>
    );
  }

  
  export default ProviderSelection;
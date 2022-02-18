
import Login from './pages/Login';
import Options from './pages/Options';
import Showpasses from './pages/Showpasses';
import Showsettlements from './pages/Showsettlements';
import ShowSettlementPasses from './pages/ShowSettlementPasses'

import Navbar from './components/NavBar';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">


        </header>

        <Navbar />

        <div className="ContentDiv">
        <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/options">
              <Options />
            </Route>
            <Route exact path="/showpasses">
              <Showpasses />
            </Route>
            <Route exact path="/showsettlements">
              <Showsettlements />
            </Route>
            <Route path="/showsettlementpasses/:settlementID">
              <ShowSettlementPasses />
            </Route>
        </Switch>
        </div>

      </div>
    </Router>
  );
}

export default App;

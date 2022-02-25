
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

        

        <div className="ContentDiv">
        <Switch>
            <Route exact path="/">
              <Navbar />
              <Login />
            </Route>
            <Route exact path="/options">
              <Navbar />
              <Options />
            </Route>
            <Route exact path="/showpasses">
              <Navbar />
              <Showpasses />
            </Route>
            <Route exact path="/showsettlements">
              <Navbar />
              <Showsettlements />
            </Route>
            <Route path="/showsettlementpasses/:settlementID">
              <Navbar />
              <ShowSettlementPasses />
            </Route>
        </Switch>
        </div>

      </div>
    </Router>
  );
}

export default App;

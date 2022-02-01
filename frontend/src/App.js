import Login from './pages/Login';
import Options from './pages/Options';
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
        </Switch>
        </div>

      </div>
    </Router>
  );
}

export default App;

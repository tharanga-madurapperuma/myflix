
import Home from './Containers/Home/Home.js';
import Movies from './Containers/Movies/Movies.js';
import AuthForm from './Containers/Auth/AuthForm.js';
import NotFound from './Components/NotFound/NotFound.js';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='movies' element={<Movies/>} />
          <Route path="auth/:mode" element={<AuthForm />} />
          <Route path="*" element={<NotFound />} /> {/* This route will catch all invalid routes */}

        </Routes>
      </Router>
    </div>
  );
}

export default App;

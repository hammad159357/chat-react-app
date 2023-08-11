import './App.css';
import Auth from './pages/auth/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <Auth/>
      <ToastContainer/>
    </div>
  );
}

export default App;

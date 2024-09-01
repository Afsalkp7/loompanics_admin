import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import UserAuth from './components/registerAndLogin/userAuth/UserAuth';
import PrivateRoute from './components/registerAndLogin/privateRoute/PrivateRoute';
import PublicRoute from './components/registerAndLogin/privateRoute/PublicRoute';
import Dashboard from './components/dashboard/dashboard/Dashboard';
import Customers from './components/customers/Customers';
import UserDetail from './components/customers/UserDetail';


function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={

              <PrivateRoute >
                <Dashboard /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/users"
            element={

              <PrivateRoute >
                <Customers /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/users/:_id"
            element={

              <PrivateRoute >
                <UserDetail /> 
              </PrivateRoute>
                
            }
          />
          <Route 
            path="/login" 
            element={

              <PublicRoute >
                <UserAuth />
              </PublicRoute>
             
            }
             />
             <Route path="*" element={<h1 >404 not found</h1>} />
          
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;

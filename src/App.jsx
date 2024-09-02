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
import NotFoundPage from './components/notfound/Notfound';
import Authors from './components/authors/Authors';
import AddAuthor from './components/authors/AddAuthor';
import AuthorDetail from './components/authors/AuthorDetail';


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
            path="/authors"
            element={

              <PrivateRoute >
                <Authors /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/add-author"
            element={

              <PrivateRoute >
                <AddAuthor /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/authors/:_id"
            element={

              <PrivateRoute >
                <AuthorDetail /> 
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
             <Route path="*" element={<NotFoundPage />} />
          
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;

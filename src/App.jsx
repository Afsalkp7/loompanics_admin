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
import Categories from './components/categories/Categories';
import CategoryDetail from './components/categories/CategoryDetail';
import Publishers from './components/publishers/Publishers';
import PublisherDetail from './components/publishers/PublisherDetail';
import Products from './components/products/Products';
import AddProduct from './components/products/AddProduct';
import ProductDetail from './components/products/ProductDetail';


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
            path="/add-product"
            element={

              <PrivateRoute >
                <AddProduct />
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
            path="/categories"
            element={

              <PrivateRoute >
                <Categories /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/publishers"
            element={

              <PrivateRoute >
                <Publishers /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/products"
            element={

              <PrivateRoute >
                <Products /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/products/:_id"
            element={

              <PrivateRoute >
                <ProductDetail /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/publishers/:_id"
            element={

              <PrivateRoute >
                <PublisherDetail /> 
              </PrivateRoute>
                
            }
          />
          <Route
            path="/categories/:_id"
            element={

              <PrivateRoute >
                <CategoryDetail /> 
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

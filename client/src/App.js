import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.css';
import './components/styling/theme.css';
import './components/Login.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import SideBar from './components/SideBar'
import AllOutfits from './components/AllOutfits';
import ShoppingCart from './components/ShoppingCart';
import UserPage from './components/UserPage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      auth: false,
      user: null,
      otherUser: null,
      updateState: null,
    }
  }

  componentDidMount() {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(res => res.json())
      .then(res => {
        this.setState({
          auth: res.auth,
          user: res.data.user,
        })
      }).catch(err => console.log(err));
  }

  handleLoginSubmit = (e, data) => {
    e.preventDefault();
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
        auth: res.auth,
        user: res.data.user
      })
    }).catch(err => console.log(err));
  }

  handleRegisterSubmit = (e, data) => {
    e.preventDefault();
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
        auth: res.auth,
        user: res.data.user
      })
    }).catch(err => console.log(err));
  }

  logout = () => {
    fetch('/api/auth/logout', {
      credentials: 'include',
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        auth: res.auth,
        user: res.data.user,
      })
    }).catch(err => console.log(err))
  }


  otherUser = (id) => {
    console.log(id)
    fetch(`/api/auth/userGet/${id}`, 
    { credentials: 'include' })
        .then(res => res.json())
        .then(res => {
            console.log(res.data.User)
            this.setState({
                otherUser : res.data.User,
            });
        }).then(res => {
          console.log(this.state.otherUser)
          console.log(this.state.otherUser.username)
        }).catch(err => console.log(err));
}

updateStateFunction = (param) => {
  this.setState({
    updateState: param,
  })
}

  render() {
    return (
      <Router>
        <div className="App">
          <Header logout={this.logout}/>
          {/* {(this.state.auth) 
          ? <SideBar user={this.state.user.id}/>
          : ''} */}

          <div className="container">
          {(this.state.auth) 
          ? <SideBar user={this.state.user.id} updateState={this.state.updateState} updateStateFunction={this.updateStateFunction} otherUserFunction={this.otherUser}/>
          : ''}

            <Route exact path='/' 
            render={() => ( 
            <AllOutfits outfits={this.state.outfits} 
            user={this.state.user} otherUserFunction={this.otherUser}/> )} />

            <Route exact path='/login' render={() => (
              this.state.auth
              ? <Redirect to='/dashboard' />
              : <Login handleLoginSubmit={this.handleLoginSubmit} />
            )} />

            <Route exact path='/register' render={() => (
              this.state.auth
              ? <Redirect to='/dashboard' />
              : <Register handleRegisterSubmit={this.handleRegisterSubmit} />
            )} />

             <Route exact path='/dashboard' render={() => (
              !this.state.auth
              ? <Redirect to='/login' />
              : <Dashboard  user={this.state.user} />
            )} />


        
            <Route exact path={`/user/${(this.state.otherUser) ? this.state.otherUser.username : ''}`} 
            render={() => (
              (this.state.otherUser === null) 
              ? <Redirect to='/outfits'/>
              : <UserPage user={this.state.otherUser} otherUser={true} updateStateFunction={this.updateStateFunction}/>
            )}/>


            <Route exact path='/outfits' 
            render={() => ( 
            <AllOutfits outfits={this.state.outfits} 
            user={this.state.user} otherUserFunction={this.otherUser}/> )} />

            <Route exact path='/shopping-cart' render={() => (
              this.state.auth
              ? < ShoppingCart user={this.state.user} />
              : < Redirect to='/login'/>
            )}/>

    

          </div>

          {/* <Footer /> */}

          </div>        
      </Router>
    );
  }
}

export default App;

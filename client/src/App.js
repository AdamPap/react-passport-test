import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Auth from './Auth'
import Subscription from './Subscription'

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <div>
          <Link to="/">Home</Link>
          <Link to="/auth">Auth</Link>
          <Link to="/subscription">Subscription</Link>
        </div>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/subscription" component={Subscription} />
        </Switch>
      </BrowserRouter>
      {/* <Auth /> */}
    </div>
  )
}

export default App;

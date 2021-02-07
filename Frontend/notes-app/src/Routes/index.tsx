import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../Pages/Login/Login';
import UserNotes from '../Pages/UserNotes';
import UserProfile from '../Pages/UserProfile/UserProfile';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route path="/userprofile">
                    <UserProfile />
                </Route>
                <Route path="/usernotes">
                    <UserNotes />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;
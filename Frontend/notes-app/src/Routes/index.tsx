import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../Pages/Login/Login';
import UserNotes from '../Pages/UserNotes';
import UserProfile from '../Pages/UserProfile/UserProfile';
import ErrorPage from '../Pages/Error/';

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
                    <UserNotes showTurnBackButton={true} />
                </Route>
                <Route path="/error">
                    <ErrorPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;

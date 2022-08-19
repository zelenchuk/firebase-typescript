import React, { useEffect, useState } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { useUser } from 'reactfire';

import AuthenticatedLayout from '../AuthenticatedLayout';
import GuestLayout from '../GuestLayout';
import HomeScreen from '../HomeScreen';
import NotFoundScreen from '../NotFoundScreen';
import SignInScreen from '../../Auth/SignInScreen';

import FlatList from '../FlatList';

const Root: React.FC = () => {
  const {
    data: user,
    // hasEmitted,
    firstValuePromise,
  } = useUser();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const isLogged = !!user;
  useEffect(() => {
    firstValuePromise.then(() => setIsUserLoaded(true));
  }, [firstValuePromise, setIsUserLoaded]);

  // doesn't always work, but suddenly works when subscribing to `firstValuePromise`
  // thus we use `isUserLoaded` below
  // if (!hasEmitted) {
  //   return null;
  // }
  if (!isUserLoaded) {
    return null;
  }

  if (isLogged) {
    return (
      <AuthenticatedLayout>
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route path="/flats" component={FlatList} />
          <Route path="/login" component={() => <Redirect to="/" />} />
          <Route path="/register" component={() => <Redirect to="/" />} />
          <Route path="*" component={NotFoundScreen} />
        </Switch>
      </AuthenticatedLayout>
    );
  }

  return (
    <GuestLayout>
      <Switch>
        <Route exact path="/login" component={SignInScreen} />
        <Route path="/register" component={SignInScreen} />
        <Route path="/" component={() => <Redirect to="/login" />} />
        <Route path="*" component={NotFoundScreen} />
      </Switch>
    </GuestLayout>
  );
};

export default Root;

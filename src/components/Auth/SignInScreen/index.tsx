import React from 'react';

import { useLocation } from 'react-router-dom';

import { makeStyles } from '@mui/styles';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Image from './login_image.png';

import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

const useStyles = makeStyles({
  bigImage: {
    background: `url(${Image}) no-repeat center`,
    width: 100,
    height: '100vh',
    backgroundSize: 'cover',
  },
});

const SignInScreen: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  const renderHomeScreen = () => {
    return (
      <Box>
        <Container maxWidth={false} disableGutters={false}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={4} className={classes.bigImage} />
            <Grid item xs={4}>
              {location.pathname === '/register' ? (
                <RegisterForm />
              ) : (
                <LoginForm />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };

  return renderHomeScreen();
};

export default SignInScreen;

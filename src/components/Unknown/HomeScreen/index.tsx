import * as React from 'react';

import { useHistory } from 'react-router-dom';

import { useUser, useAuth } from 'reactfire';

import { makeStyles } from '@mui/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { UIContext } from '../UIContext';

import clearFirestoreCache from '../../../common/clearFirestoreCache';

const useStyles = makeStyles({
  roundedUserItem: {
    background: '#BDBDBD',
    color: '#fff',
    padding: '7px',
    borderRadius: 60,
    width: 38,
  },
});

interface Error {
  message: string;
}

const HomeScreen: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();

  const { setAlert } = React.useContext(UIContext);

  const { data: user } = useUser();

  const auth = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = async () => {
    await auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        clearFirestoreCache();

        setAlert({
          show: true,
          severity: 'success',
          message: 'You successfully logged out.',
        });
      })
      .catch((error: Error) => {
        // An error happened.

        const { message } = error;
        // Show alert with message.
        setAlert({
          show: true,
          severity: 'error',
          message,
        });
      });
  };

  const showUserInitials = (username: string | null) => {
    if (username == null) return 'U';

    const nameStr = username.split(' ');

    if (nameStr.length >= 2) {
      return [nameStr[0][0], nameStr[1][0]].join('');
    }

    return [nameStr[0][0]].join('');
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MuiAppBar position="static">
          <Toolbar>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="h1" sx={{ flexGrow: 1, ml: 3 }}>
              Voypost
            </Typography>

            <div>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <Box className={classes.roundedUserItem}>
                  {showUserInitials(user.displayName)}
                </Box>
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </MuiAppBar>
      </Box>

      <Button onClick={() => history.push('/flats')}>Flats List</Button>
    </>
  );
};

export default HomeScreen;

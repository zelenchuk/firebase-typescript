import * as React from 'react';

import { useLocation, useHistory } from 'react-router-dom';

import {
  useUser,
  useAuth,
  useFirestore,
  useFirestoreCollection,
} from 'reactfire';

import { makeStyles } from '@mui/styles';

import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from '@mui/material';

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

// TODO
// https://mui.com/material-ui/react-autocomplete/#google-maps-place

const HomeScreen: React.FC = () => {
  // Start Flats app ========================================================

  // Get a current search param value for key "city".
  const useCityParam = () => {
    const { search } = useLocation();
    const result = new URLSearchParams(search);

    return result.get('city');
  };

  const [flats, setFlats] = React.useState<any>([]); // Search input value.

  const [searchQuery, setSearchQuery] = React.useState(''); // Search input value.
  const cityParamValue = useCityParam(); // Current city param value.

  const history = useHistory();

  const handleEditSearchInput = (e: React.BaseSyntheticEvent) => {
    setSearchQuery(e.target.value);
  };

  const allFlats = useFirestore()
    .collection('flats')
    .orderBy('publicationTime')
    .limit(20);

  const filteredFlats = useFirestore()
    .collection('flats')
    .where('city', '==', searchQuery)
    .limit(20);

  const GetCollection = () => {
    console.log(cityParamValue === searchQuery);

    if (searchQuery.length === 0 && cityParamValue !== searchQuery) {
      return allFlats;
    }

    return filteredFlats;
  };

  const response = useFirestoreCollection(GetCollection());

  // Update input value from urls params.
  React.useEffect(() => {
    if (cityParamValue != null) {
      setSearchQuery(cityParamValue);
    }
  }, [cityParamValue]);

  React.useEffect(() => {
    if (response.status === 'success') {
      const result = response.data.docs.map((item) => ({
        id: item.id,
        data: item.data(),
      }));
      console.log(result);
      if (result.length !== 0) {
        setFlats(result);
      }
    }
  }, [response.status, response.data]);

  const handleSubmit = () => {
    history.push({
      pathname: '/flats',
      search: `?${new URLSearchParams({ city: searchQuery }).toString()}`,
    });

    if (response.status === 'success') {
      const result = response.data.docs.map((item) => ({
        id: item.id,
        data: item.data(),
      }));

      console.log(result);

      if (result.length !== 0) {
        setFlats(result);
      }
    }
  };

  // END Flats app ========================================================

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

      {/* New component */}

      <Box
        component="form"
        sx={{ mx: 5, mt: 5, width: '35%', display: 'grid' }}
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormControl>
          <InputLabel htmlFor="flat_filter">City</InputLabel>
          <FilledInput
            value={searchQuery}
            onChange={handleEditSearchInput}
            disableUnderline
            placeholder="Type something"
            id="flat_filter"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleSubmit}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Typography component="h1" variant="h5" sx={{ m: 5 }}>
        Flats to rent
      </Typography>

      {flats.length === 0 && (
        <Typography component="p" variant="h6" sx={{ m: 5 }}>
          Loading ...
        </Typography>
      )}

      {flats.length !== 0 &&
        flats.map((flat: any) => {
          return (
            <Card
              key={flat.id}
              sx={{
                width: '35%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                m: 5,
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: '100%' }}
                image={flat.data.coverImage}
                alt={flat.data.name}
              />
              <Box sx={{ display: 'grid' }}>
                <CardContent>
                  <Typography component="div" variant="h6">
                    ${flat.data.price} / night
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    {flat.data.address}
                  </Typography>
                  <Box sx={{ height: 30, fontSize: '10px' }}>
                    {flat.data.description}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button size="large">Details</Button>
                </CardActions>
              </Box>
            </Card>
          );
        })}
    </>
  );
};

export default HomeScreen;

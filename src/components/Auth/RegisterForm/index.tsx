import React, { useContext, useState } from 'react';

import {
  Box,
  Button,
  Typography,
  FilledInput,
  InputAdornment,
  FormHelperText,
  InputLabel,
  TextField,
  IconButton,
  FormControl,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

import { useHistory } from 'react-router-dom';
import { useAuth } from 'reactfire';

import { useFormik } from 'formik';
import { registerFormSchema } from '../yup_schemas';

import { UIContext } from '../../Unknown/UIContext';

import { ReactComponent as ReactLogo } from './Vector.svg';

const useStyles = makeStyles({
  myInputLabel: {
    color: '#424242',
    '&.Mui-focused': {
      color: '#424242',
    },
  },

  myTextField: {
    color: '#424242',
    '& .Mui-focused': {
      color: '#424242',
    },
  },

  mainForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    padding: '0 60px',
  },

  submitButton: {
    textTransform: 'uppercase',
  },

  logoImage: {
    justifySelf: 'center',
  },

  askTextBlock: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '10px',
    padding: '40px 0 0 0',
    '& *': {
      fontWeight: 900,
      textAlign: 'center',
    },
  },
});

interface Values {
  email: string;
  full_name: '';
  password: '';
  repeat_password: '';
}

interface Error {
  message: string;
}

const LoginForm: React.FC = () => {
  const classes = useStyles();

  const { setAlert } = useContext(UIContext);

  const [submitingError, setSubmitingError] = useState(false);

  const auth = useAuth();
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepPassword, setShowRepPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowRepPassword = () => setShowRepPassword(!showRepPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const register = ({ email, password }: Values) =>
    auth.createUserWithEmailAndPassword(email, password);

  const updateUserProfile = ({ user }: any, { full_name }: Values) => {
    return user.updateProfile({
      displayName: full_name,
    });
  };

  // Handle submiting Form and if validate is success - do Register()
  const onSubmit = async (formData: Values) => {
    try {
      // Register new user and set isLogged to true.
      const reg = await register(formData);

      // Update User Profile - add a full_name
      await updateUserProfile(reg, formData).then(() => {
        // Show success alert with message.
        setAlert({
          show: true,
          message: 'Welcome on board 🚀',
          afterRegister: true,
        });
      });
    } catch (all_errors: any) {
      // Show all error messages from backend and brouser.
      setAlert({
        show: true,
        severity: 'error',
        message: all_errors.message,
      });
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: '',
      full_name: '',
      password: '',
      repeat_password: '',
    },
    validationSchema: registerFormSchema,
    onSubmit,
  });

  return (
    <>
      <Box
        onSubmit={handleSubmit}
        component="form"
        noValidate
        autoComplete="off"
        className={classes.mainForm}
      >
        <ReactLogo className={classes.logoImage} />

        <Typography align="center" variant="h4">
          Register
        </Typography>

        <TextField
          error={submitingError}
          fullWidth
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Email"
          id="email"
          variant="filled"
          InputProps={{ disableUnderline: true }}
          type="email"
          aria-describedby="email"
          helperText={errors.email && touched.email ? errors.email : ''}
          className={classes.myTextField}
        />

        <TextField
          error={submitingError}
          fullWidth
          value={values.full_name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Full name"
          id="full_name"
          variant="filled"
          InputProps={{ disableUnderline: true }}
          type="full_name"
          aria-describedby="full_name"
          helperText={
            errors.full_name && touched.full_name ? errors.full_name : ''
          }
          className={classes.myTextField}
        />

        <FormControl variant="filled" fullWidth error={submitingError}>
          <InputLabel htmlFor="password" className={classes.myInputLabel}>
            Password
          </InputLabel>

          <FilledInput
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disableUnderline
            id="password"
            type={showPassword ? 'text' : 'password'}
            aria-describedby="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {errors.password && touched.password && (
            <FormHelperText id="component_helper_password">
              {errors.password}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl variant="filled" fullWidth error={submitingError}>
          <InputLabel
            htmlFor="repeat_password"
            className={classes.myInputLabel}
            error={submitingError}
          >
            Repeat password
          </InputLabel>

          <FilledInput
            value={values.repeat_password}
            onChange={handleChange}
            onBlur={handleBlur}
            disableUnderline
            id="repeat_password"
            type={showRepPassword ? 'text' : 'password'}
            aria-describedby="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle repeat_password visibility"
                  onClick={handleClickShowRepPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showRepPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {errors.repeat_password && touched.repeat_password && (
            <FormHelperText id="component_helper_password">
              {errors.repeat_password}
            </FormHelperText>
          )}
        </FormControl>

        <Button
          size="large"
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          fullWidth
          className={classes.submitButton}
        >
          {!isSubmitting ? 'register' : 'loading ...'}
        </Button>

        <Box className={classes.askTextBlock}>
          <Typography variant="subtitle1" component="p">
            Already have account?
          </Typography>

          <Button
            component="p"
            variant="text"
            onClick={() => history.push('/login')}
          >
            login
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;

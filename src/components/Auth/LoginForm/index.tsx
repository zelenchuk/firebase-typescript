import React, { useContext, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { useAuth } from 'reactfire';

import { useFormik } from 'formik';

import { makeStyles } from '@mui/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';

import { loginFormSchema } from '../yup_schemas';

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
    padding: '180px 0 0 0',
    '& *': {
      fontWeight: 900,
      textAlign: 'center',
    },
  },
});

interface Values {
  email: string;
  password: string;
}

interface Error {
  message: string;
}

const LoginForm: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();

  const { setAlert } = useContext(UIContext);

  const [submitingError, setSubmitingError] = useState(false);

  const auth = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const login = ({ email, password }: Values) =>
    auth.signInWithEmailAndPassword(email, password);

  // Handle submiting Form and if success - do Logining()
  const onSubmit = async (formData: Values) => {
    try {
      await login(formData)
        .then(() =>
          // Signed in.
          setAlert({
            show: true,
            severity: 'success',
            message: 'Login success',
          }),
        )
        .catch(({ message }: Error) => {
          // Turn on Server Errors indications.
          setSubmitingError(true);

          // Show alert with message.
          setAlert({
            show: true,
            severity: 'error',
            message,
          });
        });
    } catch (err: any) {
      console.log(err.message);
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
      password: '',
    },
    validationSchema: loginFormSchema,
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
          Login
        </Typography>

        <TextField
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

        <FormControl variant="filled" fullWidth>
          <InputLabel
            htmlFor="password"
            className={classes.myInputLabel}
            error={submitingError}
          >
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

        <Button
          size="large"
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          fullWidth
          className={classes.submitButton}
        >
          {!isSubmitting ? 'login' : 'loading ...'}
        </Button>

        <Box className={classes.askTextBlock}>
          <Typography variant="subtitle1" component="p">
            Don’t have an account?
          </Typography>

          <Button
            component="p"
            variant="text"
            onClick={() => history.push('/register')}
          >
            register
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;

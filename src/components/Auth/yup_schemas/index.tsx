import * as yup from 'yup';

// Min 12 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;

const onlyLatinCharRule =
  /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/;
const fullNameRule = /^([A-Z][a-z]*)(\s)([A-Z][a-z]+)$/;

export const loginFormSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Required'),
  password: yup.string().min(12).required('Required'),
});

export const registerFormSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Required'),
  full_name: yup
    .string()
    .min(6)
    .matches(onlyLatinCharRule, {
      message: 'Full name can only contain Latin letters',
    })
    .matches(fullNameRule, {
      message: 'Please enter your full name: Elon Musk',
    })
    .required('Required'),
  password: yup
    .string()
    .min(12)
    .matches(passwordRule, { message: 'Please create a stronger password' })
    .required('Required'),
  repeat_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

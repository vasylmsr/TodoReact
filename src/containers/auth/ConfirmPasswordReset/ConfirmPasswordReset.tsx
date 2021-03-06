// Todo: refactor file: 1) Move form to separate file; 2) Move validation rule to separate file
import React, { useEffect } from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { UiButton } from 'components/ui';
import { clearConfirmResetPasswordState } from 'store/auth/slice';
import { confirmPasswordReset } from 'store/auth/asyncThunks';
import { AuthTextField } from 'components/auth/AuthTextField/AuthTextField';
import { ROUTES } from 'utils/constants/routes';
import { password } from 'utils/validationRules';
import { useAsyncAction } from 'hooks/useAsyncAction';
import { getDefaultAuthStyles } from '../styles';
import { MetaTitle } from 'components/MetaTitle';

const useStyles = makeStyles(theme => getDefaultAuthStyles(theme));
const { SIGN_IN, SIGN_UP } = ROUTES;

const forgotPasswordValidationSchema = yup.object({
  newPassword: password().required(),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')])
    .required(),
});

type PropsType = {
  code: string;
};

export const ConfirmPasswordReset: React.FC<PropsType> = ({ code }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(forgotPasswordValidationSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const { loading, execute } = useAsyncAction(async (data: any) => {
    await dispatch(confirmPasswordReset({ code, newPassword: data.newPassword }));
    enqueueSnackbar('Password successfully changed');
    history.push(SIGN_IN);
  });

  useEffect(() => {
    return () => {
      clearConfirmResetPasswordState();
    };
  }, []);

  const onSubmit = handleSubmit(data => execute(data));
  return (
    <>
      <MetaTitle title="Reset Password" />
      <>
        <Typography component="h1" variant="h5">
          Forgot password
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <AuthTextField
            label="New password"
            name="newPassword"
            autoFocus
            inputRef={register}
            customError={errors.newPassword}
          />

          <AuthTextField
            label="Confirm new password"
            name="newPasswordConfirmation"
            inputRef={register}
            customError={errors.newPasswordConfirmation}
          />

          <Grid container>
            <Grid item xs>
              <RouterLink to={SIGN_IN}>Sign In</RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to={SIGN_UP}>Don`t have an account? Sign Up</RouterLink>
            </Grid>
          </Grid>

          <UiButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            loading={loading}
          >
            Set new password
          </UiButton>
        </form>
      </>
    </>
  );
};

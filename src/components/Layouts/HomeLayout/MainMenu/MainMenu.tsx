import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../../../../store/auth/login/actions';
import { UiButton } from '../../../ui/UiButton/UiButton';
import { SIGN_IN } from '../../../../utils/constants/routes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface IMainMenuProps {
  openSidebar: () => void;
}

export const MainMenu: React.FC<IMainMenuProps> = (props: IMainMenuProps): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logout());
    history.push(SIGN_IN);
  };
  const { openSidebar } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={openSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <UiButton color="secondary" onClick={signOut}>
            Logout
          </UiButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
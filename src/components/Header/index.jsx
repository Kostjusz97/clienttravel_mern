import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { useDispatch, useSelector} from 'react-redux'

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  const onClickLogout = () => {
    if (window.confirm('Do you really want to leave?')) {
      dispatch(logout());
      window.localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Travel Blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained" color="success">Make an article</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined" color="success">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained" color="success" >Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

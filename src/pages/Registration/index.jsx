import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import {useDispatch, useSelector} from 'react-redux'
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import axios from '../../axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = React.useState('');
  const [avatarId, setAvatarId] = React.useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid} ,
    setValue
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      avatarUrl: ''
    },
    mode: 'onChange'
  });

  const inputFileRef = React.useRef(null);

  const handleAvatarChange = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('avatar', file);
      const { data } = await axios.post('/avatar', formData);
      setValue('avatarUrl',data.url);
      setImageUrl(data.url);
      setAvatarId(file.name);
    } catch (error) {
      console.warn(error)
      alert('Error uploading file')
    }
  }

  const onClickRemoveImage = async () => {
    console.log(avatarId)
    try {
      await axios.delete(`/avatar/${avatarId}`);
      console.log(avatarId);
      setImageUrl('');
      setAvatarId(null);
    } catch (error) {
      console.warn(error);
      alert('Error deleting file');
    }
  };

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))

    if (!data.payload) {
      return alert('Failed registration')
    }
    if ('token' in data.payload) {
     window.localStorage.setItem('token', data.payload.token)
    } 
  }
  if (isAuth) {
    return <Navigate to="/" />
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create account
      </Typography>
      <div className={styles.avatar}>
      <Avatar 
          key={imageUrl} 
          src={imageUrl}
          sx={{ width: 100, height: 100 }}
          onClick={() => inputFileRef.current.click()} />
        <input  ref={inputFileRef} type="file" onChange={handleAvatarChange} hidden />
        {imageUrl && (
          <IconButton aria-label="delete" size="large" color="error" onClick={onClickRemoveImage}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField 
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', { required: 'Enter full name'})}
        className={styles.field} 
        label="Full name" 
        fullWidth />
      <TextField 
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        type="email"
        {...register('email', { required: 'Enter email'})}
        className={styles.field} 
        label="E-Mail" 
        fullWidth />
      <TextField
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', { required: 'Enter password'})} 
        className={styles.field} 
        label="Password" 
        fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Register
      </Button>
      </form>
    </Paper>
  );
};

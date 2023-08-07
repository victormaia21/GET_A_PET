import { useState } from 'react';
import formStyles from '../form/Form.module.css';
import Input from '../form/Input';
import Button from '../form/Button';

import { useContext } from 'react';
import { context } from '../../context/userContext';
import Message from '../layouts/Message';

const Login = () => {
    const [user,setUser] = useState({});
    const {login} = useContext(context);
    const onHandleChange = (e) => {
        setUser({...user,[e.target.name]:e.target.value})
    }
    console.log(user)
    function handleSubmit(e) {
        e.preventDefault();
        login(user);
    }
  return (
    <section className={formStyles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
            <Input 
                text='Email' 
                name='email' 
                placeholder='Digite o seu email' 
                type='email' 
                onChange={onHandleChange}
            />
            <Input 
                text='Senha' 
                name='senha' 
                placeholder='Digite a sua senha' 
                type='password' 
                onChange={onHandleChange}
                />
                <Button value='Login'/>
            </form>
            <Message/>
    </section>
  )
}

export default Login
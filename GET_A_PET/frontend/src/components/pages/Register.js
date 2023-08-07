import { useState } from 'react';
import formStyles from '../form/Form.module.css';
import Input from '../form/Input';
import Button from '../form/Button';

import { useContext } from 'react';
import { context } from '../../context/userContext';
import Message from '../layouts/Message';

const Register = () => {
    const [user,setUser] = useState({});
    const {register} = useContext(context);
    const onHandleChange = (e) => {
        setUser({...user,[e.target.name]:e.target.value})
    }
    function handleSubmit(e) {
        e.preventDefault();
        register(user);
    }
  return (
    <section className={formStyles.container}>
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                text='Nome' 
                name='nome' 
                placeholder='Digite o seu nome' 
                type='text' 
                onChange={onHandleChange}
                />
                <Input 
                text='Email' 
                name='email'
                placeholder='Digite um email' 
                type='email' 
                onChange={onHandleChange}
                />
                <Input 
                text='Telefone' 
                name='telefone' 
                placeholder='Digite o seu telefone' 
                type='text' 
                onChange={onHandleChange}
                />
                <Input 
                text='Senha' 
                name='senha' 
                placeholder='Digite uma senha' 
                type='password' 
                onChange={onHandleChange}
                />
                <Input 
                text='Confirme a senha' 
                name='confirmaçaodesenha' 
                placeholder='Digite novamente sua senha' 
                type='password' 
                onChange={onHandleChange}
                />
                <Button value='Cadastrar'/>
                <Message/>
            </form>
    </section>
  )
}

export default Register
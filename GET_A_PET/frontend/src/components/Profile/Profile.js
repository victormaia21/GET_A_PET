import { useState,useEffect } from "react";
import api from "../../utils/api";
import formStyles from '../form/Form.module.css'
import Input from "../form/Input";
import ImageProfile from "../layouts/ImageProfile";
import Button from '../form/Button';
import {useNavigate} from 'react-router-dom';
import useFlashMessage from '../../hooks/useFlashMessage'
import Message from '../layouts/Message';
import { context } from "../../context/userContext";
import { useContext } from "react";
const Profile = () => {
    const [user,setUser] = useState({});
    const [preview,setPreview] = useState('');
    const [token] = useState(localStorage.getItem('token'))
    const {setFlashMessage} = useFlashMessage();
    const navigate = useNavigate();
    const {deleteCount} = useContext(context);
    useEffect(() => {
        api.get('/users/myuser',{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data);
        });
    },[])
    const onHandleChange = (e) => {
        setUser({...user,[e.target.name]:e.target.value})
    }
    const onFileChange = (e) => {
        setPreview(e.target.files[0]);
        setUser({...user,[e.target.name]:e.target.files[0]});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        await Object.keys(user).forEach((key) => {
            formData.append(key,user[key]);
        });
        let msgType = 'success';
        let msgText = '';
        await api.patch('/users/update',formData,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`,
                'Content-Type':'multipart/form-data'
            }
        }).then((response) => {
            msgText = response.data.message
            setFlashMessage(msgText,msgType);
            navigate('/');
        }).catch((err) => {
           msgText = err.response.data.message
           msgType = 'error';
           setFlashMessage(msgText,msgType);
        }) 

        
    }
    
  return (
    <section className={formStyles.container}>
        <h1>Usuario</h1>
        
        <Message/>
        {(user.foto || preview) && (
            <ImageProfile 
            src={
                preview ? 
                URL.createObjectURL(preview) : 
                `http://localhost:5000/images/users/${user.foto}`
            } 
            alt={user.name}/>
        )}
        <form onSubmit={handleSubmit}>
            <Input 
            type='text' 
            name='nome' 
            placeholder='Digite o seu nome' 
            text='Nome' 
            onChange={onHandleChange}
            value={user.nome}
            />
            <Input 
            type='email' 
            name='email' 
            placeholder='Digite o seu email' 
            text='Email' 
            onChange={onHandleChange}
            value={user.email}
            />
            <Input 
            type='text' 
            name='telefone' 
            placeholder='Digite o seu telefone' 
            text='Telefone' 
            onChange={onHandleChange}
            value={user.telefone}
            />
            <Input 
            type='password' 
            name='senha' 
            placeholder='Digite uma senha' 
            text='Senha' 
            onChange={onHandleChange}
            />
            <Input 
            type='password' 
            name='confirmacaodesenha' 
            placeholder='Confirme a sua senha' 
            text='Confirmação de senha' 
            onChange={onHandleChange}
            />
            <Input 
            type='file' 
            name='foto' 
            text='Foto' 
            onChange={onFileChange}
            />
            <Button value='Editar'/>
            <div className={formStyles.delete}>
                <button onClick={() => deleteCount(user._id)}>Deletar</button>
            </div>
        </form>
    </section>
  )
}

export default Profile
import { useState } from 'react';
import formStyles from '../form/Form.module.css';
import Input from '../form/Input';
import Button from '../form/Button';
import Message from '../layouts/Message';
import Select from '../form/Select';
import api from '../../utils/api';
import useFlashMessage from '../../hooks/useFlashMessage';
import { useNavigate } from 'react-router-dom';
import ImageProfile from '../layouts/ImageProfile';
import ShowImages from '../layouts/ShowImages';
const PetsCreate = () => {
    const [pet,setPet] = useState({});
    const [preview,setPreview] = useState('');
    const cors = ["Escolha uma opção",'Branco','Preto','Azul','Vermelho','Amarelo','Verde'];
    const {setFlashMessage} = useFlashMessage();
    const navigate = useNavigate();
    const onHandleChange = (e) => {
        setPet({...pet,[e.target.name]:e.target.value})
    }
    const onFileChange = (e) => {
        setPreview(Array.from(e.target.files));
        setPet({...pet,[e.target.name]:e.target.files});
    }
    const onSelectChange = (e) => {
        setPet({...pet,[e.target.name]:e.target.options[e.target.selectedIndex].text})
    }
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        await Object.keys(pet).forEach((key) => {
            
            if(key === 'imagens') {
                for(let x=0;x<pet[key].length;x++) {
                    formData.append(key,pet[key][x])
                } 
            } else {
                formData.append(key,pet[key])
            }
        })
        let msgType = 'success';
        try {
            const token = localStorage.getItem('token') || '';
            const data = await api.post('/pets/create',formData,{
                headers:{
                    Authorization:`Bearer ${JSON.parse(token)}`
                }
            }).then((response) => {
                return response.data;
            })
            setFlashMessage(data.message,msgType)
            navigate('/')
        } catch(err) {
            msgType = 'error';
            setFlashMessage(err.response.data.message,msgType);
        }

    }
    
  return (
    <section className={formStyles.container}>
            <h1>Registre um pet</h1>
            <div className={formStyles.imagens}>
                {preview && preview.map((img) => (
                    <ShowImages src={URL.createObjectURL(img)} alt={pet.name}/>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <Input 
                text='Nome' 
                name='nome' 
                placeholder='Digite o nome do pet' 
                type='text' 
                onChange={onHandleChange}
                />
                <Input 
                text='Idade' 
                name='idade' 
                placeholder='Digite a idade do pet' 
                type='text' 
                onChange={onHandleChange}
                />
                <Input 
                text='Comprimento' 
                name='comprimento' 
                placeholder='Digite o comprimento do pet' 
                type='text' 
                onChange={onHandleChange}
                />
                <Input 
                text='Imangens' 
                name='imagens' 
                type='file' 
                onChange={onFileChange}
                multiple={true}
                />
                <Select 
                options={cors}
                onChange={onSelectChange}
                name='cor'
                text='Cor'
                />
                <Button value='Cadastrar'/>
                <Message/>
            </form>
    </section>
  )
}

export default PetsCreate
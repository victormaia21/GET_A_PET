import { useState,useEffect } from 'react';
import formStyles from '../form/Form.module.css';
import Input from '../form/Input';
import Button from '../form/Button';
import Message from '../layouts/Message';
import { useParams,useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Select from '../form/Select';
import useFlashMessage from '../../hooks/useFlashMessage';
import ShowImages from '../layouts/ShowImages';

const UpdatePet = () => {
    const {id} = useParams();
    const [pet,setPet] = useState({});
    const cors = ["Escolha uma opção",'Branco','Preto','Azul','Vermelho','Amarelo','Verde'];
    const [token] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();
    const [preview,setPreview] = useState([]);
    const {setFlashMessage} = useFlashMessage();
    const onHandleChange = (e) => {
        setPet({...pet,[e.target.name]:e.target.value})
    }
    
    const [imagePet,setImagePet] = useState(true);
    const onFileChange = (e) => {
        setPreview(Array.from(e.target.files));
        setPet({...pet,[e.target.name]:e.target.files})
        if(preview) {
            setImagePet(false);
        }
        if(!preview) {
            setImagePet(true);
        }
    }
    const onSelectChange = (e) => {
        setPet({...pet,[e.target.name]:e.target.options[e.target.selectedIndex].text});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        await Object.keys(pet).forEach((key) => {
            if(key === 'imagens') {
                for(let x=0;x<pet[key].length;x++) {
                    formData.append(key,pet[key][x]);
                }
            } else {
                formData.append(key,pet[key]);
            }
        });
        let msgType = 'success';
        await api.patch(`/pets/edit/${pet._id}`,formData,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`,
                'Content-Type':'multipart/form-data'
            }
        }).then((response) => {
            navigate('/mypets');
            setFlashMessage(response.data.message,msgType);
        }).catch((err) => {
            msgType = 'error';
            setFlashMessage(err.response.data.message,msgType);
        })
    }

    useEffect(() => {
        let msgText;
        let msgType = 'success'
        api.get(`/pets/${id}`,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPet(response.data.pet);
        }).catch((err) => {
            msgText = err.response.data.message;
            msgType = 'error';
            setFlashMessage(msgText,msgType);
        })
    },[])
    
  return (
    <section className={formStyles.container}>
            <h1>Atualize seu pet</h1>
            <div className={formStyles.imagens}>
                {(pet.imagens && imagePet) && pet.imagens.map((image) => (
                    <ShowImages src={`http://localhost:5000/images/pets/${image}`}/>
                ))}
                {(preview.length > 0 && preview.map((image) => (
                    <ShowImages src={URL.createObjectURL(image)}/>
                )))}
            </div>
            
            <form onSubmit={handleSubmit}>
                <Input 
                text='Nome' 
                name='nome' 
                placeholder='Digite o seu nome' 
                type='text' 
                onChange={onHandleChange}
                value={pet.nome}
                />
                <Input 
                text='Idade' 
                name='idade' 
                placeholder='Digite a sua idade' 
                type='text' 
                onChange={onHandleChange}
                value={pet.idade}
                />
                <Input 
                text='comprimento' 
                name='comprimento' 
                placeholder='Digite o seu comprimento' 
                type='text' 
                onChange={onHandleChange}
                value={pet.comprimento}
                />
                <Select name='cor' onChange={onSelectChange} text='Cor' options={cors} value={pet.cor}/>
                <Input 
                text='Imagens' 
                name='imagens' 
                type='file' 
                onChange={onFileChange}
                multiple={true}
                />
                <Button value='Atualizar'/>
                <Message/>
            </form>
    </section>
  )
}

export default UpdatePet
import { useState,useEffect } from 'react';
import styles from '../layouts/ShowPets.module.css';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import useFlashMessage from '../../hooks/useFlashMessage';
const MyPets = () => {
    const [pets,setPets] = useState({});
    const [token] = useState(localStorage.getItem('token') || '');
    const {setFlashMessage} = useFlashMessage();
    useEffect(() => {
        api.get('/pets/mypets',{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPets(response.data.pets)
        })
    })
    const deletePet = async (id) => {
        let msgText;
        let msgType = 'success';
        await api.delete(`/pets/delete/${id}`,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response) => { 
            msgText = response.data.message;
            setFlashMessage(msgText,msgType);
        }).catch((err) => {
            msgText = err.response.data.message;
            msgType = 'error';
            setFlashMessage(msgText,msgType)
        })
    }
    
    
  return (
    <section className={styles.section}>
        <h1>Seus Pets</h1>
        {pets.length === 0 && (
            <div className={styles.no_pets}>
                <h1>Você ainda não registrou nenhum pet <Link to='/pets/create'> Clique aqui para registrar</Link>
                </h1>
            </div>
        )}
        {pets.length > 0 && pets.map((pet) => (
            <div className={styles.pet}>
                <div className={styles.apresentacao}>
                    <div className={styles.dog_image}>
                        <img src={`http://localhost:5000/images/pets/${pet.imagens[0]}`} alt={pet.nome} />
                    </div>
                    <div className={styles.lis_icones}>
                        <ul>
                            <li><span>Nome</span><span>{pet.nome}</span></li>
                            <li><span>Idade</span><span>{pet.idade}</span></li>
                            <li><span>Comprimento</span><span>{pet.comprimento}</span></li>
                            <li><span>Cor</span><span>{pet.cor}</span></li>
                        </ul>
                        <div className={styles.icones}>
                            <i class="bi bi-trash" onClick={() => deletePet(pet._id)}></i>
                            <Link to={`/pets/edit/${pet._id}`} className={styles.icones_link_edit}><i class="bi bi-pencil-square"></i></Link>
                        </div>
                    </div>
                </div>
                
            </div>
        ))}
    </section>
  )
}

export default MyPets
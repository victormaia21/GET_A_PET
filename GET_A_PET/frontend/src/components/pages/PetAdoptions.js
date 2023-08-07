import { useState,useEffect, useContext } from 'react';
import styles from '../layouts/ShowPets.module.css';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import useFlashMessage from '../../hooks/useFlashMessage';
import { context } from '../../context/userContext';
import InputSearch from '../layouts/InputSearch';
import { useNavigate } from 'react-router-dom';

const PetAdoptions = () => {
    const [pets,setPets] = useState({});
    const [token] = useState(localStorage.getItem('token') || '');
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    const {setFlashMessage} = useFlashMessage();
    const {authenticated} = useContext(context)

    useEffect(() => {
        api.get('/pets/petadoptions',{
          headers:{
            Authorization:`Bearer ${JSON.parse(token)}`
          }
        }).then((response) => {
            setPets(response.data.pets)
        })
    },[])
    console.log(pets)
    const search = () => {
      if(query.length === 0) {
        navigate('/');
        return
      }
      navigate(`/search?q=${query}`);
    }
    const adotarPet = async (id) => {
      await api.patch(`/pets/adoption/${id}`,null,{
        headers:{
          Authorization:`Bearer ${JSON.parse(token)}`
        }
      }).then((response) => {
        navigate('/pets/adoptions');
        setFlashMessage(response.data.message,'success');
      }).catch((err) => {
        setFlashMessage(err.response.data.message,'error');
      })
    }
  return (
    <section className={styles.section}>
      <InputSearch onChange={(e) => setQuery(e.target.value)} onClick={search}/>
        <h1>Pets</h1>
        {pets.length === 0 && (
            <div className={styles.no_pets}>
                <h1>Ainda não existe pets criado <Link to={authenticated ? '/pets/create' : '/login'}> Clique aqui para registrar</Link>
                </h1>
            </div>
        )}
        {pets.length > 0 && pets.map((pet) => (
            <>
            {!pet.disponivel && (
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
                          <li><span>Dono</span>{pet.usuario.nome}</li>
                      </ul>
                      <div className={styles.iconess}>
                        <p>Pet adotado com sucesso, por favor fale com {pet.usuario.nome} pelo telefone <b>{pet.usuario.telefone}</b></p>
                      </div>
                  </div>
              </div>
          </div>
            )}
            </>
        ))}
    </section>
  )
}

export default PetAdoptions
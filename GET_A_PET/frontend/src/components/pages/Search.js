import { useState,useEffect, useContext } from 'react';
import styles from '../layouts/ShowPets.module.css';
import api from '../../utils/api';
import { Link, useSearchParams } from 'react-router-dom';
import useFlashMessage from '../../hooks/useFlashMessage';
import { context } from '../../context/userContext';
import InputSearch from '../layouts/InputSearch';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [pets,setPets] = useState({});
    const [newPet,setNewPet] = useState([])
    const {setFlashMessage} = useFlashMessage();
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    const [useParams] = useSearchParams();
    const nomePet = useParams.toString().replace('q=','');
    const {authenticated} = useContext(context)
  
    
    const primeiraLetra = nomePet.split('')[0].toUpperCase();
      const arraySemAprimeiraLetra = nomePet.split('').filter((e) => {
        return e != primeiraLetra.toLowerCase();
      })
      arraySemAprimeiraLetra.unshift(primeiraLetra);
      const novaLetra = arraySemAprimeiraLetra.join('')

    useEffect(() => {
      api.get(`/pets/pet/${nomePet}`).then((response) => {
          setPets(response.data.pet);
      })
    },[nomePet])
    
    
      
      useEffect(() => {
        api.get(`/pets/pet/${novaLetra}`).then((response) => {
          setNewPet(response.data.pet);
      })
      },[newPet]);
       
    
      
    const search = () => {
      if(query.length === 0) {
        navigate('/');
        return;
      }
      navigate(`/search?q=${query}`);
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
            {pet.disponivel && (
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
                  </div>
              </div>
          </div>
            )}
            </>
        ))}
        {newPet.length > 0 && newPet.map((pet) => (
          <>
          {pet.disponivel && (
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
                </div>
            </div>
        </div>
          )}
          </>
        ))}
    </section>
  )
}

export default Home
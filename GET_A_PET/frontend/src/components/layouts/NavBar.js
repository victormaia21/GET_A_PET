import styles from './NavBar.module.css';
import logo from '../../assets/imagens/logo.png';
import { Link } from 'react-router-dom';
import { context } from '../../context/userContext';
import { useContext } from 'react';
const NavBar = () => {
    const {authenticated,logout} = useContext(context);
  return (
    <header className={styles.header}>
        <div className="logo">
            <Link to='/'><img src={logo} alt='logo'/></Link>
        </div>
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                {authenticated ? (
                    <>
                        <li><Link to='/profile'>Usuario</Link></li>
                        <li><Link to='/mypets'>Meus Pets</Link></li>
                        <li><Link to='/pets/create'>Adicionar um pet</Link></li>
                        <li><Link to='/pets/adoptions'>Pets Adotados</Link></li>
                        <li className={styles.sair} onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/register'>Registro</Link></li>
                    </>
                )}
                
            </ul>
        </nav>
    </header>
  )
}

export default NavBar
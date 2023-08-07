import styles from './InputSearch.module.css';

const InputSearch = ({onChange,onClick}) => {
  return (
    <div className={styles.container}>
        <input type="text" onChange={onChange} />
        <button onClick={onClick}><i class="bi bi-search"></i></button>
    </div>
  )
}

export default InputSearch
import styles from './Input.module.css';

const Input = ({type,name,text,placeholder,onChange,value,multiple}) => {
  return (
    <div className={styles.container}>
        <label htmlFor={name}>{text}:</label>
        <input type={type} name={name} placeholder={placeholder} onChange={onChange} value={value} {...(multiple) ? {multiple} : ''}/>
    </div>
  )
}

export default Input
import styles from './Select.module.css';

const Select = ({options,name,value,onChange,text}) => {
  return (
    <div className={styles.container}>
        <label htmlFor={name}>{text}</label>
        <select name={name}  value={value} onChange={onChange} >
            {options.map((option,index) => (
                <option key={index}>{option}</option>
            ))}
        </select>
    </div>
  )
}

export default Select
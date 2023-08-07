import styles from './Button.module.css'

const Button = ({value}) => {
  return (
    <div className={styles.button}>
        <button type="submit" >{value}</button>
    </div>
  )
}

export default Button
import styles from './ShowImages.module.css';

const ShowImages = ({src,alt}) => {
  return (
    <img src={src} alt={alt} className={styles.images}/>
  )
}

export default ShowImages
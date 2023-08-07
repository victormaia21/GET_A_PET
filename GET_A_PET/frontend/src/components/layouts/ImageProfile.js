import styles from './ImageProfile.module.css';

const ImageProfile = ({src,alt}) => {
  return (
    <div className={styles.container}>
        <img src={src} alt={alt} />
    </div>
  )
}

export default ImageProfile
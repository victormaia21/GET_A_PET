import bus from "../../utils/bus";
import { useState,useEffect } from "react";
import styles from './Message.module.css';
const Message = () => {
    const [message,setMessage] = useState('');
    const [type,setType] = useState('');
    const [visibility,setVisibility] = useState(false);
    useEffect(() => {
        bus.addListener('flash',({message,type}) => {
            setMessage(message);
            setType(type);
            setVisibility(true);

            setTimeout(() => {
                setVisibility(false);
            }, 15000);
        })
    })
  return (
    (visibility && (
        <div className={type == 'success' ? styles.success : styles.error}>
            <p>{message}</p>
        </div>
    ))
  )
}

export default Message
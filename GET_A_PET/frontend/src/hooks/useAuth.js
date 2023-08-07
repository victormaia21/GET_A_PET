import api from "../utils/api";
import useFlashMessage from "./useFlashMessage";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function useAuth() {
    const {setFlashMessage} = useFlashMessage();
    const [authenticated,setAuthenticated] = useState(false);
    const navigate = useNavigate();
    console.log(authenticated)
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true);
        }
    },[])
    async function register(user) {
        let msgText;
        let msgType = 'success';

        try {
            const data = await api.post('users/register',user).then((response) => {
                return response.data
            })
            msgText = data.message;
            auth(data);
            setFlashMessage(msgText,msgType)
        } catch(err) {
            msgText = err.response.data.message
            msgType = 'error';
            setFlashMessage(msgText,msgType)
        }
        console.log(msgText)
    }

    async function auth(user) {
        setAuthenticated(true);
        localStorage.setItem('token',`${JSON.stringify(user.token)}`);
        navigate('/');
    }

    function logout() {
        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;
        let msgText = 'Logout com sucesso';
        let msgType = 'success';
        navigate('/login')
        setFlashMessage(msgText,msgType);
    }

    async function login(user) {
        let msgType = 'success';
        let msgText;
        try {
            const data = await api.post('/users/login',user).then((response) => {
                return response.data;
            })
            msgText = data.message;
            setFlashMessage(msgText,msgType);
            await auth(data);
        } catch(err) {
            msgText = err.response.data.message;
            msgType = 'error';
            setFlashMessage(msgText,msgType);
        }
    }
    
    async function deleteCount(id) {
        let msgText;
        let msgType = 'success';
        const token = localStorage.getItem('token');
        await api.delete(`users/delete/${id}`,{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            msgText = response.data.message;
            setFlashMessage(msgText,msgType)
            api.defaults.headers.Authorization = undefined;
            setAuthenticated(false);
            localStorage.removeItem('token');
            navigate('/');
        }).catch((err) => {
            msgText = err.response.data.message;
            setFlashMessage(msgText,msgType)
            api.defaults.headers.Authorization = undefined;
            setAuthenticated(false);
            localStorage.removeItem('token');
            navigate('/');
        })
    }
    
    return {register,authenticated,logout,login,deleteCount}
}

export default useAuth;
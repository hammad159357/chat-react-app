import {postRequest, getRequest, notifyError, notifySuccess}  from 'constants/functions'
import endpoints from 'constants/utils'

export const register = async (data)=>{
    const url = endpoints.register
    try{

        let response = await postRequest(url, data)
        if(response.success){
            notifySuccess(response?.message)
            return response.data
        }
        notifyError(response?.message)
        return response?.data
    }catch(e){
        notifyError(e?.toString())
        return null
    }
    
}
export const login = async (data)=>{
    const url = endpoints.login
    try{

        let response = await postRequest(url, data)
        if(response.success){
            notifySuccess(response?.message)
            return response.data
        }
        notifyError(response?.message)
        return response?.data
    }catch(e){
        notifyError(e?.toString())
        return null
    }
    
}
export const userFromToken = async (token)=>{
    const url = endpoints.userFromToken
    try{

        let response = await getRequest(url, {token})
        if(response.success){
            return response.data
        }
        notifyError(response?.message)
        return response?.data
    }catch(e){
        notifyError(e?.toString())
        return null
    }
    
}

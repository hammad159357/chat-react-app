import { getRequest } from 'constants/functions';
import {postRequest, notifyError, notifySuccess}  from 'constants/functions'
import endpoints from 'constants/utils'


export const getContacts = async ()=>{
    let url = endpoints.getContacts;
    try{
        let response = await getRequest(url);
        if(response.success){
            return response.data;
        }
    }catch(e){
        notifyError(e.toString());
    }
}

export const getContactMessages = async(userId)=>{
    let url = endpoints.getContactMessages;
    try{
        let response = await getRequest(url, {id: userId});
        if(response.success){
            return response.data;
        }
    }catch(e){
        notifyError(e.toString());
    }
}

export const getContactById = async (id)=>{
    let url = endpoints.getContactById;
    try{
        let response = await getRequest(url, { id });
        if(response.success){
            return response.data;
        }
    }catch(e){
        // notifyError(e.toString());
    }

}
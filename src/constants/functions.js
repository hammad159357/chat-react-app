import { toast } from "react-toastify";

export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);

export const getRequest = (url, data=null)=>{
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('user-token');
      let headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      let q = '';
      if(token){
        headers['Authorization'] = "Bearer " + token;
      }
      if(data){
        let arr = []
        Object.keys(data).forEach((key)=>{
          arr.push(`${key}=${data[key]}`);
        })
        q = arr.join('&');
      }
  
  
      try {
        fetch(`${url}?${q}`, {
          method: "GET",
          mode: "cors",
          headers,
        }).then((res) => {
          res.json().then((data) => {
            resolve(data);
          });
          return;
        });
      } catch (error) {
        reject(error);
        console.log("Error", error);
      }
    });
  }
  
  
export  const postRequest = (url, data=null) =>{
    return new Promise((resolve, reject) => {
    const token = localStorage.getItem('user-token');
      let headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if(token){ 
        headers['Authorization'] = "Bearer " + token;
      }
  
      try {
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers,
          body:JSON.stringify(data),
        }).then((res) => {
          res.json().then((data) => {
            resolve(data);
          });
          return;
        });
      } catch (error) {
        reject(error);
        console.log("Error", error);
      }
    });
  }


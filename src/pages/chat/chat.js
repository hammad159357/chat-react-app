import { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { UserContext } from 'App';
import './chat.css';
import { useNavigate } from 'react-router-dom';
import { getContacts, getContactById, getContactMessages } from 'constants/api/chat';
import moment from 'moment/moment';
import { io } from 'socket.io-client';
import { notifyError } from 'constants/functions';
import ringtone from 'assets/ringtone.mp3';

// const socket = io("ws://localhost:3000",{
//     auth: {
//         token: localStorage.getItem('user-token'),
//     }
// });

export default function Chat(){
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const socket = useRef(null);
    const [isConnected, setIsConnected] = useState(socket?.connected);

    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [search, setSearch] = useState('');

    const [selectedContact, setSelectedContact] = useState(null);
    const [contactMessages, setContactMessages] = useState({});
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState(null);
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }

const handleProfile = ()=>{
    navigate('/profile')

}
    const logout = ()=>{
        localStorage.removeItem('user-token');
        setUser(null);
        socket.current?.disconnect();
        navigate('/auth/login')
    }
    const sendMessage =  (e)=>{
        e?.preventDefault();
        if(!message || !selectedContact) return;

        let msgObj = {
            text: message,
            receiver: selectedContact._id,
            sender: user._id,
        }
        socket.current.emit('send-message', msgObj)
        setContactMessages({...contactMessages, [selectedContact._id]: [...contactMessages[selectedContact._id], msgObj]})

        // updating contact list recent msg
        let receiver = contacts.find(c=>c._id?.toString().trim() == msgObj.receiver?.toString().trim());
        receiver.recentMessage = msgObj;
        let updatedContacts = contacts.filter(c=> c._id != msgObj.receiver);
        setContacts( [receiver, ...updatedContacts]);

        setMessage('');
    }

    const ring = useCallback(()=> (new Audio(ringtone)).play());

    const receiveMessage = useCallback(async (msg)=>{
        let sender = contacts.find(c=>c._id?.toString().trim() == msg.sender?.toString().trim());
        if(!sender){
            sender = await getContactById(msg.sender); // if a user has just registered and not in loaded contact list
            if(!sender) return;
        }
        if(contactMessages[sender._id]){
            setContactMessages({ ...contactMessages, [sender._id] : [...contactMessages[sender._id], msg] });
        }
        sender.recentMessage = msg;
        let updatedContacts = contacts.filter(c=> c._id != msg.sender);
        setContacts( [sender, ...updatedContacts]);
        ring();

    }, [contacts, contactMessages]);

    // For Reconnecting Socket on login and logout
    useLayoutEffect(()=>{
        if(user && !socket.current?.connected){
            socket.current = io("ws://localhost:3000",{
                            auth: {
                                token: user.token,
                            }
                        });
        }
    },[]);

    useEffect(()=>{
        getContacts().then(contacts=> setContacts(contacts) )
    }, []);

    // Update Filtered/Searched Contacts when contacts update
    useEffect(()=>{
        setFilteredContacts(contacts);
        setSearch('');
    }, [contacts]);

    // Fetching Selected Contact Messages on click
    useEffect(()=>{
        if(!selectedContact) return;
        let fetchedMessages = contactMessages[selectedContact._id];
        if(fetchedMessages) return;

        getContactMessages(selectedContact._id).then(messages=>{
            setContactMessages({...contactMessages, [selectedContact._id]: messages});
        })
    }, [selectedContact]);

    // When a open a chat window or receive new msg, scrollToBottom
    useEffect(() => {
        if(selectedContact){
            scrollToBottom()
        }
    }, [contactMessages]);
    
    // When Typing on search
    useEffect(() => {
        if(!search || search==''){
            setFilteredContacts(contacts);
            return;
        }
        console.log(search);
        let term = search.toLowerCase().trim();
        let searched = contacts.filter(c=> c.name?.toLowerCase()?.includes(term) || c.email?.toLowerCase()?.includes(term));
        setFilteredContacts(searched);
    }, [search]);   

    // handle New Messages from socket io 
    useEffect(()=>{
        if(newMessage){
            receiveMessage(newMessage);
            setNewMessage(null);
        }
    }, [newMessage]);

    // Socket io Events
    useEffect(()=>{
        if(socket.current){

            socket.current.on('connect', () => {
                setIsConnected(true);
            });
            
            socket.current.on('disconnect', () => {
                setIsConnected(false);
            });
            
            socket.current.on('receive-message', (msg)=> setNewMessage(msg) );
        }
      
          return () => {
            if(socket.current){
                socket.current.off('connect');
                socket.current.off('disconnect');
                socket.current.off('receive-message');
            }
          };
    },[socket.current]);




    return (
        <>
        <div className='container heading-container' style={{ paddingTop: 0, marginTop: 0 }}>
            <h4 className='heading'>Welcome, {user?.name} </h4>
        </div>
        <div className="container container-white">
            <div className="row">
                <nav className="menu">
                <ul className="items">
                    <li className="item item-active">
                        <i className="fa fa-commenting" aria-hidden="true"></i>
                    </li>
                    <li className="item" onClick={handleProfile}>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </li>
                    <li className="item" onClick={logout}>
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </li>
                </ul>
                </nav>
        
                <section className="discussions">
                <div className="discussion search">
                    <div className="searchbar">
                    <i className="fa fa-search" aria-hidden="true"></i>
                    <input type="text" value={search} onChange={( {target})=> setSearch(target.value) } className="form-control" placeholder="Search..." />
                    </div>
                </div>

                {
                    filteredContacts.map(c=>(
                        <div key={c._id} onClick={()=> setSelectedContact(c)} className={c._id==selectedContact?._id ? "discussion message-active" : "discussion"}>
                            <div className="photo" style={{ backgroundImage: c.profileImage ? `url("http://localhost:3000/${c.profileImage}")` : "url('https://www.w3schools.com/howto/img_avatar.png')"}}>
                            <div className="online"></div>
                            </div>
                            <div className="desc-contact">
                            <p className="name">{c.name}</p>
                            <p className="message">{ c.recentMessage && c.recentMessage.text  }</p>
                            </div>
                            <div className="timer">{ c.recentMessage && moment(c.recentMessage.createdAt).fromNow().replace(' ago','') }</div>
                        </div>
                    ))
                }
        

                </section>

                { selectedContact &&
                    <section className="chat">
                        <div className="header-chat">
                            <img className='photo-title' src="https://www.w3schools.com/howto/img_avatar.png" />

                            <p className="name">{selectedContact.name}</p>
                            <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
                        </div>
                        <div className="messages-chat">

                            {
                                contactMessages[selectedContact._id] && 

                                contactMessages[selectedContact._id].map(msg=>(
                                    <>
                                    <div key={msg?._id} className="message">
                                        {
                                            msg.sender !== user._id 
                                            ? <p className="text"> {msg.text} </p> 
                                            
                                            :<div className="response">
                                                <p className="text"> {msg.text}</p>
                                            </div>
                                            
                                        }
                                    </div>
                                    <p className={msg.sender !== user._id ? 'time' : ' time response-time'}>{moment(msg.createdAt).calendar()}</p>
                                    <div style={{ clear: 'both' }}></div>
                                    </>
                                ))
                            }
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="footer-chat">
                            <i className="icon fa fa-smile-o clickable" style={{ fontSize:"25pt" }} aria-hidden="true"></i>
                            <input type="text" value={message} onChange={({target})=> setMessage(target.value)} className="write-message form-control" placeholder="Type your message here" />
                            <i onClick={sendMessage} className="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
                        </form>
                    </section>
                }
                {
                    !selectedContact && 
                    <section style={{ background: "#d3d8e2" }} className="chat d-flex justify-content-center align-items-center">
                        <h4>No Contact Selected</h4>
                    </section>
                }
            </div>
            </div>
            </>
        
    )

}
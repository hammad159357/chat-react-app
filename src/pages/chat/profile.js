import { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect, useRe } from 'react';
import { UserContext } from 'App';
import './chat.css';
import { useNavigate } from 'react-router-dom';
import { getContacts, getContactById, getContactMessages, nameUpdate, uploadImage } from 'constants/api/chat';
import { io } from 'socket.io-client';

export default function Chat() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const socket = useRef(null);
    const inputRef = useRef(null)
    const [isConnected, setIsConnected] = useState(socket?.connected);
    const [registerForm, setRegisterForm] = useState({});
    const local = 'http://localhost:3000/'
    const apiImage = local + user?.profileImage
    const [image, setImage] = useState(user?.profileImage ? apiImage : null)
    const [staticImage, setStaticImage] = useState(null)
    const handleNameUpdate = (event) => {
        setRegisterForm({
            name: event.target.value
        })
    }
    const handleUpdate = (event) => {
        nameUpdate(registerForm).then(data => {
            if (data?.user && data.user.token) {
                setUser(data.user)
                // navigate('/profile')
                return
            }
        })
    }

    const handleProfile = () => {
        navigate('/profile')

    }
    const handleChat = () => {
        navigate('/chat')

    }
    const logout = () => {
        localStorage.removeItem('user-token');
        setUser(null);
        socket.current?.disconnect();
        navigate('/auth/login')
    }
    // For Reconnecting Socket on login and logout
    useLayoutEffect(() => {
        if (user && !socket.current?.connected) {
            socket.current = io("ws://localhost:3000", {
                auth: {
                    token: user.token,
                }
            });
        }
    }, []);

    const handleImage = (e) => {
        // setImage(e.target.files[0])

        if (!e.target) return
        setStaticImage(e.target.files[0])
    }
    const handleImageClick = (e) => {
        // inputRef.current.click()
        if (!staticImage) return
        const formData = new FormData();
        formData.append("image", staticImage)

        uploadImage(formData).then(data => {
            setImage(local + data)
            setStaticImage(null)


        })
    }
    // Socket io Events
    useEffect(() => {
        if (socket.current) {

            socket.current.on('connect', () => {
                setIsConnected(true);
            });

            socket.current.on('disconnect', () => {
                setIsConnected(false);
            });

        }

        return () => {
            if (socket.current) {
                socket.current.off('connect');
                socket.current.off('disconnect');
                socket.current.off('receive-message');
            }
        };
    }, [socket.current]);

    return (
        <>
            <div className='container heading-container' style={{ paddingTop: 0, marginTop: 0 }}>
                <h4 className='heading'>Welcome, {user?.name} </h4>
            </div>
            <div className="container container-white">
                <div className="column">
                    <nav className="menu">
                        <ul className="items">
                            <li className="item" onClick={handleChat}>
                                <i className="fa fa-commenting" aria-hidden="true"></i>
                            </li>
                            <li className="item item-active" onClick={handleProfile}>
                                <i className="fa fa-user" aria-hidden="true"></i>
                            </li>
                            <li className="item" onClick={logout}>
                                <i className="fa fa-sign-out" aria-hidden="true"></i>
                            </li>
                        </ul>
                    </nav>

                </div>
                <div className="profile">
                    <h4 >Upload your profile photo</h4>
                    <div >
                        {image ? <img style={{ maxHeight: "150px", borderRadius: "50%", maxWidth: "150px"  }} src={image} alt="aaa" /> : <img style={{ maxHeight: "150px", borderRadius: "50%", maxWidth: "150px"}} src="https://www.w3schools.com/howto/img_avatar.png" />}
                    </div>

                    <p ><span className="me-1">Note:</span>Minimum size 300px x 300px</p>
                    <div>
                        <input type="file" name="file" onChange={handleImage} />
                        <button disabled={!staticImage ? true : false} className="btn btn-primary" style={{ fontSize: "12px" }} onClick={handleImageClick}>Upload Image</button>
                    </div>
                    <p style={{ fontWeight: "500" }}><span className="me-1">{`Name: ${user?.name}`}</span></p>
                    <p style={{ fontWeight: "500" }}><span className="me-1">{`Email: ${user?.email}`}</span></p>
                </div>
                <hr />
                <form action="/profile" className='form-update' onSubmit={handleUpdate}>
                    <div style={{ marginRight: "10px" }}>
                        <label style={{ fontWeight: "500", marginRight: "10px" }} htmlFor="exampleInputEmail1">Name:</label>
                        <input style={{ border: "0.5px solid", lineHeight: "0px", padding: "6px" }} type="text" id="exampleInputEmail1" placeholder={user?.name} onBlur={(e) => handleNameUpdate(e)} />
                    </div>

                    <button type="submit" style={{ fontSize: "12px" }} className="btn btn-primary">Update Name</button>

                </form>
            </div>

        </>

    )

}
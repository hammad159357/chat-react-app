const baseUrl = process.env.REAT_APP_API_URL || 'http://localhost:3000'

const endpoints = {
    login: baseUrl + '/auth/login',
    register: baseUrl + '/auth/register',
    userFromToken: baseUrl + '/auth/user',
    getContacts: baseUrl + '/chat/contacts',
    getContactById: baseUrl + '/chat/contact',
    getContactMessages: baseUrl + '/chat/messages'
}

export default endpoints
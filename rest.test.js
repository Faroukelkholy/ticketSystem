const axios = require('axios');


const instanceWithoutToken = axios.create({
    baseURL: 'http://localhost:3000'
});

function fetchUsers() {
    return instanceWithoutToken
        .get('/users')
        .then(res => res.data)
        .catch(err => 'error');
}


test('response data message should be Success', async () => {
    const data = await fetchUsers();
    expect(data.message).toEqual('Success');
});


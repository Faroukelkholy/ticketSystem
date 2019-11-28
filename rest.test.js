const axios = require('axios');
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjQxNmM0ZmU0LTc0ZjktNDMwMS1iNzNiLWU2NjdiM2JjZmZjMSIsImlhdCI6MTU3MjQ1NTY0NCwiZXhwIjoxNTcyNDU5MjQ0fQ.ZkO7fIRiRpPxENIorJBBFQPAioDzp1pP6sy9Y_W-Dps";

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const instanceWithoutToken = axios.create({
    baseURL: 'http://localhost:3000'
});

function fetchLogs() {
    return instance
        .get('/users')
        .then(res => res.data)
        .catch(err => 'error');
}

function fetchUsersWithoutToken() {
    return instanceWithoutToken
        .get('/users')
        .then(res => res.data)
        .catch(err => 'error');
}

test('response data message should be Success', async () => {
    const data = await fetchLogs();
    expect(data.message).toEqual('Success');
});

it('calls the API and throws an error', async () => {
    try {
        const data = await fetchUsersWithoutToken();
    } catch (error) {
        console.log('data error :', error);
        expect(error.name).toEqual('Unauthorized');
        expect(error.status).toEqual(401);
    }
});

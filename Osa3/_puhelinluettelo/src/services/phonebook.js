import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => axios.get(baseUrl);
const create = (newPerson) => axios.post(baseUrl, newPerson);
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, remove };
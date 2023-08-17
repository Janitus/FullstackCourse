import axios from 'axios';

//const DEPLOYED_URL = 'https://fullstack-course-janitus.onrender.com/api/persons';
//const LOCAL_URL = 'http://localhost:3001/api/persons';

let baseUrl = 'https://fullstack-course-janitus.onrender.com/api/persons';

if (import.meta.env.VITE_APP_ENV === 'local') baseUrl = 'http://localhost:3001/api/persons'; // Only if I run on local for testing

const getAll = () => axios.get(baseUrl);
const create = (newPerson) => axios.post(baseUrl, newPerson);
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, remove, baseUrl };
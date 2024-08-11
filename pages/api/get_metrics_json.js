import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { endpoint } = req.query;

    // Create a new FormData instance and append the request body data to it
    const formData = new FormData();
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        formData.append(key, req.body[key]);
      }
    }

    // log time of request
    console.log('Request time:', new Date().toLocaleString());
    try {
      const response = await axios.post(`http://4.224.105.208:443/${endpoint}`, formData, {
        headers: formData.getHeaders(),  // axios will handle the multipart/form-data headers
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
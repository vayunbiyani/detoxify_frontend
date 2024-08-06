import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const formData = new FormData();

    if (req.method === 'POST') {
        const { file } = req.body;

        if (file) {
            formData.append('file', file);

            try {
                const apiRes = await axios.post('http://localhost:8000/top_channels', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                res.status(200).json(apiRes.data);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch top channels' });
            }
        } else {
            res.status(400).json({ error: 'No file uploaded' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

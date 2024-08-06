import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const metricsHandler = (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise<void>((resolve, reject) => {
        try {
            const form = formidable({
                keepExtensions: true,
                maxFileSize: 100 * 1024 * 1024, // 100MB
            });

            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to process form' });
                    reject(err);
                } else {
                    const file = files.file;
                    console.log('file here', typeof (file), file);
                    if (!file) {
                        res.status(400).json({ error: 'No file provided' });
                        reject(new Error('No file provided'));
                        return;
                    }

                    if (!file) {
                        res.status(400).json({ error: 'No file provided' });
                        reject(new Error('No file provided'));
                        return;
                    }

                    const formData = new FormData();
                    formData.append('file', file);

                    fetch('https://localhost:8000/metrics', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => {
                            if (response.ok) {
                                // File successfully uploaded to the other endpoint
                                res.status(200).json({ message: 'File uploaded successfully' });
                                resolve();
                            } else {
                                // Failed to upload file to the other endpoint
                                res.status(500).json({ error: 'Failed to upload serverside1' });
                                reject(new Error('Failed to upload serverside2'));
                            }
                        })
                        .catch(error => {
                            // Error occurred during the fetch request
                            res.status(500).json({ error: 'Failed to upload serverside3 '+error });
                            reject(error);
                        });
                }
            });

        } catch (parseError) {
            res.status(500).json({ error: 'Failed to process form' });
            reject(parseError);
        }
    });
};

export default metricsHandler;

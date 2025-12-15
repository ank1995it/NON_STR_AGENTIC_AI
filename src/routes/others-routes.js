// src/routes/others-routes.js

import axios from 'axios';
import { logger } from "../utils/logger.js";
import { BlobClient } from "@azure/storage-blob";


export async function othersRoutes(fastify) {

    const MEDIA_FUNCTION_BASE_URL = 'https://dev-aiag-media-manager.azurewebsites.net';

    const SAS_TOKEN = process.env.BLOB_SAS_TOKEN; 
    
    fastify.post('/call/initiate', async (request, reply) => {
        try {
            const payload = request.body;
            const azureFunctionUrl = 'https://dev-aiag-outbound.azurewebsites.net/api/calls/initiate';
            const azureResponse = await axios.post(azureFunctionUrl, payload);
            reply.code(azureResponse.status).send(azureResponse.data);
        } catch (err) {
            fastify.log.error('Azure Function call failed:', err.message);
            reply.code(500).send({ error: 'Azure Function call failed', detail: err.message });
        }
    });

    fastify.post('/v2/call/initiate', async (request, reply) => {
        try {
            const payload = request.body;
            const azureFunctionUrl = 'https://dev-aiag-outbound.azurewebsites.net/api/v2/calls/initiate';
            const azureResponse = await axios.post(azureFunctionUrl, payload);
            reply.code(azureResponse.status).send(azureResponse.data);
        } catch (err) {
            fastify.log.error('Azure Function call failed:', err.message);
            reply.code(500).send({ error: 'Azure Function call failed', detail: err.message });
        }
    });

    fastify.get('/v1/get/data', async (request, reply) => {
        try {
            const keyId = request.query.key;
            if (!keyId) {
            return reply.code(400).send({ error: 'Missing key query parameter' });
            }
        
            const azureFunctionUrl = `https://dev-aiag-outbound.azurewebsites.net/api/get/data?key=${keyId}`;
            const azureResponse = await axios.get(azureFunctionUrl);
        
            reply.code(azureResponse.status).send(azureResponse.data);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    return reply.code(404).send({
                    error: 'Requested key not found',
                    });
                }
                return reply.code(err.response.status).send(err.response.data);
            }
            fastify.log.error('Azure Function call failed:', err.message);
            return reply.code(500).send({
                error: 'Azure Function call failed',
                detail: err.message
            });
        }
    });


    fastify.get('/v1/saa/api/call/:callid', async (request, reply) => {
        try {
            const call_id = request.params.callid;
            const azureFunctionUrl = `https://dev-saa-connect.azurewebsites.net/api/calls/${call_id}`;
            const azureResponse = await axios.get(azureFunctionUrl);
            reply.code(azureResponse.status).send(azureResponse.data);
        } catch (err) {
            fastify.log.error('Azure Function call failed:', err.message);
            reply.code(500).send({ error: 'Azure Function call failed', detail: err.message });
        }
    });

    fastify.get('/v1/saa/api/call', async (request, reply) => {
        try {
            const azureFunctionUrl = 'https://dev-saa-connect.azurewebsites.net/api/calls';
            const azureResponse = await axios.get(azureFunctionUrl, {params: request.query});
            reply.code(azureResponse.status).send(azureResponse.data);
        } catch (err) {
            fastify.log.error('Azure Function call failed:', err.message);
            reply.code(500).send({ error: 'Azure Function call failed', detail: err.message });
        }
    });

    
    
    
    fastify.post('/api/upload_audio/:agent_type', async (request, reply) => {
        const { agent_type } = request.params;
        const targetUrl = `${MEDIA_FUNCTION_BASE_URL}/api/upload_audio/${agent_type}`;
        
        try {
            const parts = request.parts();
            const form = new FormData();
            
            for await (const part of parts) {
                if (part.type === 'file') {
                    form.append(part.fieldname, part.file, {
                        filename: part.filename,
                        contentType: part.mimetype,
                    });
                } else {
                    // Forward other form fields like 'call_id'
                    form.append(part.fieldname, part.value);
                }
            }

            const response = await axios.post(targetUrl, form, {
                headers: {
                    ...form.getHeaders()
                },
                // These options are important for handling large file uploads efficiently
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });

            reply.status(response.status).send(response.data);
        } catch (error) {
            fastify.log.error(error.message);
            if (error.response) {
                reply.status(error.response.status).send(error.response.data);
            } else {
                reply.status(500).send({ message: 'An internal server error occurred while uploading the file.' });
            }
        }
    });

    
    // This route proxies JSON data from the client to the function.
    fastify.post('/api/save_summary/:agent_type', async (request, reply) => {
        const { agent_type } = request.params;
        const apiKey = request.headers['x-api-key']; 

        const targetUrl = `${MEDIA_FUNCTION_BASE_URL}/api/save_summary/${agent_type}`;

        try {
            const response = await axios.post(targetUrl, request.body, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-functions-key': apiKey  
                },
            });
            reply.status(response.status).send(response.data);
        } catch (error) {
            fastify.log.error(error.message);
            if (error.response) {
                reply.status(error.response.status).send(error.response.data);
            } else {
                reply.status(500).send({ message: 'An internal server error occurred.' });
            }
        }
    });

    
    // This route proxies a GET request to fetch the transcript/metadata data.
    fastify.get('/api/:paramtype/:agent_type/:call_id.json', async (request, reply) => {
        const { paramtype,agent_type, call_id } = request.params;
        const targetUrl = `${MEDIA_FUNCTION_BASE_URL}/api/${paramtype}/${agent_type}/${call_id}.json`;

        logger.info({ targetUrl }, "GET request to fetch transcript data");
        const apiKey = request.headers['x-api-key']; 
        try {
            const response = await axios.get(targetUrl,{
                headers: {
                    'Content-Type': 'application/json',
                    'x-functions-key': apiKey  
                }});
            reply.status(response.status).send(response.data);
        } catch (error) {
            fastify.log.error(error.message);
            if (error.response) {
                reply.status(error.response.status).send(error.response.data);
            } else {
                reply.status(500).send({ message: 'An internal server error occurred.' });
            }
        }
    });

    fastify.get("/download/voice-recording/:name", async (request, reply) => {
        try {
            //SAS_TOKEN="sp=r&st=2025-10-06T09:30:50Z&se=2026-12-01T17:45:50Z&spr=https&sv=2024-11-04&sr=c&sig=5fCabDumH%2B9NnhO2nHE9oHH94Cc0y3%2FRnplS2AwlGCM%3D"
            const { name } = request.params;
            const url = `https://aiagoutboundfappsa.blob.core.windows.net/agentic-voice-recordings/${name}?sp=r&st=2025-10-06T09:30:50Z&se=2026-12-01T17:45:50Z&spr=https&sv=2024-11-04&sr=c&sig=5fCabDumH%2B9NnhO2nHE9oHH94Cc0y3%2FRnplS2AwlGCM%3D`;
            const blobClient = new BlobClient(url);

            // Get size & content-type from blob properties
            const props = await blobClient.getProperties();
            const size = props.contentLength ?? undefined;
            const type = props.contentType || "audio/wav";
            
            reply.header("Accept-Ranges", "bytes");
            reply.header("Content-Type", type);
            reply.header("Content-Disposition", `inline; filename="${encodeURIComponent(name)}"`);

            const range = request.headers.range;

            if (range && size !== undefined) {
                // Parse "bytes=start-end"
                const match = /^bytes=(\d*)-(\d*)$/.exec(range);
                if (!match) {
                // Malformed range; send full file
                reply.header("Content-Length", size);
                const full = await blobClient.download();
                return reply.code(200).send(full.readableStreamBody);
                }

                let start = match[1] ? parseInt(match[1], 10) : 0;
                let end = match[2] ? parseInt(match[2], 10) : size - 1;

                // Sanity clamp
                if (isNaN(start) || start < 0) start = 0;
                if (isNaN(end) || end >= size) end = size - 1;
                if (end < start) end = size - 1;

                const chunkLength = end - start + 1;

                const part = await blobClient.download(start, chunkLength);

                reply
                    .code(206)
                    .header("Content-Range", `bytes ${start}-${end}/${size}`)
                    .header("Content-Length", chunkLength);

                return reply.send(part.readableStreamBody);
            }else {
                 // No Range header or unknown size: stream whole file
                if (size !== undefined) reply.header("Content-Length", size);
                    const full = await blobClient.download();
                    return reply.code(200).send(full.readableStreamBody);
            }
            
            //const download = await blobClient.download();
            //reply.header("Content-Type", download.contentType ?? "application/octet-stream");
            //if (download.contentLength) {
            //    reply.header("Content-Length", download.contentLength);
            //}
            //reply.send(download.readableStreamBody);
        } catch (err) {
            console.error(err);
            reply.code(500).send({ error: " Failed to fetch blob"+err});
        }
    });

    

}

    



'use strict';

// Use got directly because the screwriver-request does not return proper format of error message when the responseType is 'buffer'.
// https://github.com/screwdriver-cd/request/blob/7a65a75c0b4e9109f1d1205d75bbc5e2dab547b2/index.js#L51-L53
import request from 'got';
import config from 'config';

import { ecosystemConfig } from '../../types/config';

const ecosystem: ecosystemConfig = config.get('ecosystem');
const baseUrl = `${ecosystem.store}/v1`;

const ZIP_FILE = 'SD_ARTIFACT.zip';
const RETRY_LIMIT = 5;

/**
 * Get zip artifact file
 * @method  getZipArtifact
 * @param   {Integer}    buildId    The ID of build that owned the artifacts
 * @param   {String}     token      The token to upload the extracted artifacts
 * @return  {Promise}               An zip object which contains artifacts
 */
export const getZipArtifact = async (buildId: string, token: string): Promise<any> => {
    const options = {
        url: `${baseUrl}/builds/${buildId}/ARTIFACTS/${ZIP_FILE}`,
        options: {
            method: 'GET',
            headers: {
                Authorization: token
            },
            retry: {
                limit: RETRY_LIMIT
            },
            responseType: 'buffer'
        }
    };

    try {
        return await request(options);
    } catch (err: any) {
        throw new Error(err.response.body.toString());
    }
};

/**
 * Put unzipped artifact file
 * @method  putArtifact
 * @param  {Integer}  buildId    The ID of build that owned the artifacts
 * @param  {String}   token      The token to upload the extracted artifacts
 * @param  {String}   fileName   File name of the artifact which is to put to store
 * @param  {Buffer}   file       File body of the artifact which is to put to store
 * @return  {Promise}
 */
export const putArtifact = async (buildId: string, token: string, fileName: string, file: Buffer): Promise<any> => {
    const options = {
        url: `${baseUrl}/builds/${buildId}/ARTIFACTS/${fileName}`,
        options: {
            method: 'PUT',
            headers: {
                Authorization: token,
                'Content-Type': 'text/plain'
            },
            retry: {
                limit: RETRY_LIMIT
            },
            body: file
        }
    };

    try {
        return await request(options);
    } catch (err: any) {
        throw new Error(err.response.body.toString());
    }
};

export const deleteZipArtifact = async (buildId: string, token: string) => {
    const options = {
        url: `${baseUrl}/builds/${buildId}/ARTIFACTS/${ZIP_FILE}`,
        options: {
            method: 'DELETE',
            headers: {
                Authorization: token
            },
            retry: {
                limit: RETRY_LIMIT
            }
        }
    };

    try {
        return await request(options);
    } catch (err: any) {
        throw new Error(err.response.body.toString());
    }
};

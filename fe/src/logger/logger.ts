import axios from 'axios';

export class Logger {
    static logInfoToServer(info: string) {
        var body = {
            info: info
        };
        return axios.post("Log/LogInfo", body);
    }
    static logGenericErrorToServer(err: any, instance: any, info: string) {
        var body = {
            errorName: err.name,
            errorMessage: err.message,
            errorStackTrace: err.stack,
            instance: instance,
            info: info
        };
        return axios.post("Log/LogError", body);
    }
    static logRESTRequestErrorToServer(err: any) {
        var body = {
            errorName: err.name,
            errorMessage: err.message,
            errorStackTrace: err.stack,
            requestURL: err.request?.responseURL,
            responseResult: err.response?.data?.result,
            responseStatus: err.response?.status
        };
        return axios.post("Log/LogError", body);
    }
}
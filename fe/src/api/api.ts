import axios from 'axios';

export class Api {
    //<signalr>
    static sendMessageToBroadcast(message: any) {
        let body = {
            message: message
        };
        return axios.post('SignalR/SendMessageToBroadcast', body);
    }
    static sendMessageToConnection(connectionId: string, message: any) {
        let body = {
            connectionId: connectionId,
            message: message
        };
        return axios.post('SignalR/SendMessageToConnection', body);
    }
    static sendMessageToClient(clientId: string, message: any) {
        let body = {
            clientId: clientId,
            message: message
        };
        return axios.post('SignalR/SendMessageToClient', body);
    }
    static sendMessageToUser(userId: string, message: any) {
        let body = {
            userId: userId,
            message: message
        };
        return axios.post('SignalR/SendMessageToUser', body);
    }
    //</signalr>
    //<notifications>
    static getNotifications() {
        return axios.get('Notifications/GetNotifications');
    }
    static setUnreadNotificationsAsRead() {
        return axios.post('Notifications/SetUnreadNotificationsAsRead', {});
    }
    static deleteNotification(notificationId: string) {
        let body = {
            Id: notificationId
        };
        return axios.post('Notifications/DeleteNotification', body);
    }
    //</notifications>
}
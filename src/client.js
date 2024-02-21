import cockpit from "cockpit";

const SessionHeader = 'X-Transmission-Session-Id';
const rpcPath = '/transmission/rpc';
let http = undefined;

export function init(host, port, username, password) {
    const auth = btoa(`${username}:${password}`);
    http = cockpit.http({
        "address": host,
        "headers": {
            "Authorization": `Basic ${auth}`,
        },
        "port": parseInt(port)
    });
}

function getToken() {
    if (!http) {
        return Promise.reject('HTTP client is not initialized');
    }

    return new Promise((resolve, reject) => {
        let token = '';
        http.get(rpcPath).response((status, headers) => {
            token = headers[SessionHeader];
            resolve(token);
        }).catch((error) => {
            reject(error);
        });
    });
}

function rpcCall(method, args) {
    return new Promise((resolve, reject) => {
        const data = {
            arguments: args,
            method,
        };
        getToken()
            .then(token => {
                http.post(rpcPath, data, { [SessionHeader]: token })
                    .then(response => {
                        resolve(JSON.parse(response));
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function getTorrents() {
    return rpcCall('torrent-get', {
        fields: [
            "id",
            "name",
            "error",
            "errorString",
            "eta",
            "isFinished",
            "isStalled",
            "labels",
            "leftUntilDone",
            "metadataPercentComplete",
            "peersConnected",
            "peersGettingFromUs",
            "peersSendingToUs",
            "percentDone",
            "queuePosition",
            "rateDownload",
            "rateUpload",
            "recheckProgress",
            "seedRatioMode",
            "seedRatioLimit",
            "sizeWhenDone",
            "status",
            "trackers",
            "downloadDir",
            "uploadedEver",
            "uploadRatio",
            "webseedsSendingToUs"
        ]
    });
}

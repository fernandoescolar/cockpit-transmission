import cockpit from "cockpit";

const SessionHeader = 'X-Transmission-Session-Id';
const rpcPath = '/transmission/rpc';
let http;

export function init(host, port, username, password) {
    const auth = btoa(`${username}:${password}`);
    http = cockpit.http({
        address: host,
        headers: {
            Authorization: `Basic ${auth}`,
        },
        port: parseInt(port)
    });
}

function getToken() {
    if (!http) {
        return Promise.reject(new Error('HTTP client is not initialized'));
    }

    return new Promise((resolve, reject) => {
        let token = '';
        http.get(rpcPath).response((status, headers) => {
            token = headers[SessionHeader];
            resolve(token);
        })
                .catch((error) => {
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
                            });
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

export function addTorrent(torrentUploads) {
    return rpcCall('torrent-add', torrentUploads);
}

export function startTorrent(ids) {
    return rpcCall('torrent-start', { ids: formatIds(ids) });
}

export function startTorrentNow(ids) {
    return rpcCall('torrent-start-now', { ids: formatIds(ids) });
}

export function stopTorrent(ids) {
    return rpcCall('torrent-stop', { ids: formatIds(ids) });
}

export function removeTorrent(ids, deleteLocalData) {
    return rpcCall('torrent-remove', { ids: formatIds(ids), deleteLocalData });
}

export function verifyTorrent(ids) {
    return rpcCall('torrent-verify', { ids: formatIds(ids) });
}

export function reannounceTorrent(ids) {
    return rpcCall('torrent-reannounce', { ids: formatIds(ids) });
}

export function renameTorrent(ids, path, name) {
    return rpcCall('torrent-rename-path', { ids: formatIds(ids), path, name });
}

export function setTorrentLocation(ids, location, move = true) {
    return rpcCall('torrent-set-location', { ids: formatIds(ids), location, move });
}

export function setTorrentPriority(ids, priority, fileIds) {
    // low | normal | high
    return rpcCall('torrent-set', { ids: formatIds(ids), [`priority-${priority}`]: fileIds });
}

function formatIds(ids) {
    if (!Array.isArray(ids)) {
        return [ids];
    }

    return ids;
}

import React from "react";
import * as transmission from "./client";

let loopInterval;

const TransmissionContext = React.createContext();

const ActionTypes = {
    INIT: 'INIT',
    LOADING: 'LOADING',
    ALERT: 'ALERT',
    READ_ALERT: 'READ_ALERT',
    TORRENTS: 'TORRENTS',
    DETAILS: 'DETAILS',
    STOP: 'STOP',
    START: 'START',
    START_NOW: 'START_NOW',
    ASK_DELETE: 'ASK_DELETE',
    DELETE: 'DELETE',
    ASK_FULL_DELETE: 'ASK_FULL_DELETE',
    VERIFY: 'VERIFY',
    ASK_SET_LOCATION: 'ASK_SET_LOCATION',
    SET_LOCATION: 'SET_LOCATION',
    ASK_RENAME: 'ASK_RENAME',
    RENAME: 'RENAME',
    REANNOUNCE: 'REANNOUNCE',
};

const transmissionReducer = (state, action) => {
    const currentdate = new Date().getTime();
    const alerts = state.alerts.filter(a => a.key >= currentdate - 5000) ?? [];
    const modal = undefined;
    const torrent = undefined;
    const loading = false;
    switch (action.type) {
        case ActionTypes.INIT:
            return { ...state, alerts, hasBeenInitialized: true, config: action.data, loading, modal, torrent, torrents: [] };
        case ActionTypes.LOADING:
            return { ...state, alerts, loading: true };
        case ActionTypes.ALERT:
            const key = new Date().getTime();
            const variant = action.data.variant ? action.data.variant : action.data.error ? 'danger' : 'info';
            alerts.push({ key, variant, title: action.data.message });
            console.log(action.data);
            return { ...state, loading, alerts };
        case ActionTypes.READ_ALERT:
            a = alerts.filter(a => a.key !== action.data) ?? [];
            return { ...state, loading, alerts: a };
        case ActionTypes.TORRENTS:
            return { ...state, alerts, loading, torrents: action.data };
        case ActionTypes.DETAILS:
            return { ...state, alerts, loading, modal: 'details', torrent: action.data };
        case ActionTypes.STOP:
            alerts.push({ key: new Date().getTime(), variant: 'success', title: `Torrent ${action.data.name} has been stopped` });
            state.torrents.find(t => t.id === action.data.id).status = 0;
            return { ...state, alerts, loading, modal, torrent, torrents: state.torrents };
        case ActionTypes.START:
            alerts.push({ key: new Date().getTime(), variant: 'success', title: `Torrent ${action.data.name} has been started` });
            state.torrents.find(t => t.id === action.data.id).status = 3;
            return { ...state, alerts, loading, modal, torrent, torrents: state.torrents };
        case ActionTypes.ASK_DELETE:
            return { ...state, alerts, loading, modal: 'delete', torrent: action.data };
        case ActionTypes.DELETE:
            alerts.push({ key: new Date().getTime(), variant: 'success', title: `Torrent ${action.data.name} has been deleted` });
            return { ...state, alerts, loading, modal, torrent, torrents: state.torrents.filter(t => t.id !== action.data.id) };
        case ActionTypes.ASK_FULL_DELETE:
            return { ...state, alerts, loading, modal: 'full-delete', torrent: action.data };
        case ActionTypes.VERIFY:
            alerts.push({ key: new Date().getTime(), variant: 'info', title: `Verification of torrent ${action.data.name} has been started` });
            state.torrents.find(t => t.id === action.data.id).status = 1;
            return { ...state, alerts, loading, modal, torrent, torrents: state.torrents };
        case ActionTypes.ASK_SET_LOCATION:
            return { ...state, alerts, loading, modal: 'set-location', torrent: action.data };
        case ActionTypes.SET_LOCATION:
            alerts.push({ key: new Date().getTime(), variant: 'success', title: `Location of torrent ${action.data.torrent.name} has been changed` });
            return { ...state, alerts, loading, modal, torrent };
        case ActionTypes.ASK_RENAME:
            return { ...state, alerts, loading, modal: 'rename', torrent: action.data };
        case ActionTypes.RENAME:
            alerts.push({ key: new Date().getTime(), variant: 'success', title: `Torrent ${action.data.torrent.name} has been renamed` });
            state.torrents.find(t => t.id === action.data.torrent.id).name = data.name;
            return { ...state, alerts, loading, modal, torrent };
        case ActionTypes.REANNOUNCE:
            alerts.push({ key: new Date().getTime(), variant: 'info', title: `Reannounce of torrent ${action.data.name} has been started` });
            return { ...state, alerts, loading, modal, torrent };
    }

    return state;
};

const trasmissionActions = (dispatch) => {
    const loadTorrents = () => new Promise((resolve, reject) => {
        transmission
            .getTorrents()
            .then(response => {
                dispatch({ type: ActionTypes.TORRENTS, data: response.arguments.torrents });
                resolve();
            })
            .catch(error => {
                dispatch({ type: ActionTypes.ALERT, data:  { error, message: 'Cannot load torrents' } });
                reject(error);
            });
    });

    return {
        init: (config) => {
            transmission.init(config.host, config.port, config.username, config.password);
            dispatch({ type: ActionTypes.INIT, data: config });
            if (loopInterval) {
                clearInterval(loopInterval);
            }

           loadTorrents()
                .then(() => {
                    loopInterval = setInterval(() => {
                        loadTorrents();
                    }, 5000);
                });
        },
        reload: () => {
            loadTorrents();
        },
        readAlert: (key) => {
            dispatch({ type: ActionTypes.READ_ALERT, data: key });
        },
        details: (torrent) => {
            dispatch({ type: ActionTypes.DETAILS, data: torrent });
        },
        stop: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .stopTorrent(torrent.id)
                .then(() => {
                    dispatch( { type: ActionTypes.STOP, data: torrent });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error stopping torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        start: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .startTorrent(torrent.id)
                .then(() => {
                    dispatch( { type: ActionTypes.START, data: torrent } );
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error starting torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        startNow: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .startTorrentNow(torrent.id)
                .then(() => {
                    dispatch({ type: ActionTypes.START_NOW, data: torrent });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error starting torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        askDelete: (torrent) => {
            dispatch({ type: ActionTypes.ASK_DELETE, data: torrent });
        },
        delete: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .removeTorrent(torrent.id)
                .then(() => {
                    dispatch({ type: ActionTypes.DELETE, data: torrent });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error deleting torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        askFullDelete: (torrent) => {
            dispatch({ type: 'ask-full-delete', data: torrent });
        },
        fullDelete: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .removeTorrent(torrent.id, true)
                .then(() => {
                    dispatch({ type: ActionTypes.DELETE, data: torrent });
                    resolve();
                })
                .catch(error => dispatch( { type: ActionTypes.ALERT, data: { error, message: `Error deleting torrent: ${torrent.name}` } } ));
        }),
        verify: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .verifyTorrent(torrent.id)
                .then(() => {
                    dispatch({ type: ActionTypes.VERIFY, data: torrent });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error verifying torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        askSetLocation: (torrent) => {
            dispatch({ type: ActionTypes.ASK_SET_LOCATION, data: torrent });
        },
        setLocation: (torrent, location) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .setTorrentLocation(torrent.id, location)
                .then(() => {
                    dispatch({ type: ActionTypes.SET_LOCATION, data: { torrent, location } });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error setting location for torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        askRename: (torrent) => {
            dispatch({ type: ActionTypes.ASK_RENAME, data: torrent });
        },
        rename: (torrent, name) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .renameTorrent(torrent.id, name)
                .then(() => {
                    dispatch({ type: ActionTypes.RENAME, data: { torrent, name } });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error renaming torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
        reannounce: (torrent) => new Promise((resolve, reject) => {
            dispatch({ type: ActionTypes.LOADING });
            transmission
                .reannounceTorrent(torrent.id)
                .then(() => {
                    dispatch({ type: ActionTypes.REANNOUNCE, data: torrent });
                    resolve();
                })
                .catch(error => {
                    dispatch({ type: ActionTypes.ALERT, data: { error, message: `Error reannouncing torrent: ${torrent.name}` } });
                    reject(error);
                });
        }),
    };
};

export const WithTransmissionContext = ({ children }) => {
    const emptyState = {
        alerts: [],
        loading: false,
        modal: undefined,
        torrent: undefined,
        torrents: [],
        hasBeenInitialized: false,
        config: { host: '', port: '', username: '', password: '' }
    };
    const [state, dispatch] = React.useReducer(transmissionReducer, emptyState);
    const actions = trasmissionActions(dispatch);
    return (
        <TransmissionContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </TransmissionContext.Provider>
    );
};

export const useTransmissionContext = () => {
    const context = React.useContext(TransmissionContext)
    if (context === undefined) {
      throw new Error('useTransmissionContext must be used within a TransmissionContext')
    }

    return context;
}

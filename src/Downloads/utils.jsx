import cockpit from 'cockpit';

export const _ = cockpit.gettext;

export const StatusNames = [
    "Stopped",
    "Check waiting",
    "Checking",
    "Download waiting",
    "Downloading",
    "Seed waiting",
    "Seeding"
];

export const Statuses = {
    Stopped: 0,
    CheckWait: 1,
    Check: 2,
    DownloadWait: 3,
    Download: 4,
    SeedWait: 5,
    Seed: 6
};

export const timeRemaining = (torrent) => {
    if (torrent.rateDownload > 0) {
        let remaining = torrent.leftUntilDone / torrent.rateDownload;

        if (remaining < 60) {
            return Math.floor(remaining) + " seconds";
        }
        remaining /= 60;
        if (remaining < 60) {
            return Math.floor(remaining) + " minutes";
        }
        remaining /= 60;
        if (remaining < 24) {
            return Math.floor(remaining) + " hours";
        }
        remaining /= 24;
        return Math.floor(remaining) + " days";
    }

    return "remaining unknown";
};

export const fileSize = (size) => {
    size /= 1024;
    if (size < 1024) {
        return size.toFixed(2) + " KB";
    }
    size /= 1024;
    if (size < 1024) {
        return size.toFixed(2) + " MB";
    }
    size /= 1024;
    if (size < 1024) {
        return size.toFixed(2) + " GB";
    }
    size /= 1024;
    return size.toFixed(2) + " TB";
};

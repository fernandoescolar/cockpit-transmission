import React from 'react';
import { Text } from "@patternfly/react-core/dist/esm/components/Text";
import { fileSize, Statuses } from '../utils';

export const DownloadStatus = ({ torrent }) => {
    if (torrent.errorString) {
        return (
            <Text component='small' className='error'>
                {torrent.errorString}
            </Text>
        );
    }
    if (torrent.status === Statuses.Stopped) {
        return (
            <Text component='small'>
                Stopped
            </Text>
        );
    }
    if (torrent.status <= Statuses.Check) {
        return (
            <Text component='small'>
                Checking
            </Text>
        );
    }
    if (torrent.status <= Statuses.Download) {
        return (
            <Text component='small'>
                Downloading from {torrent.peersConnected} peers - ▼{fileSize(torrent.rateDownload)}/s ▲ {fileSize(torrent.rateUpload)}/s
            </Text>
        );
    }
    return (
        <Text component='small'>
            Seeding from {torrent.peersConnected} peers - ▲ {fileSize(torrent.rateUpload)}/s
        </Text>
    );
};

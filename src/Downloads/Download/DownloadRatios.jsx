import React from 'react';
import { Text } from "@patternfly/react-core/dist/esm/components/Text";
import { Statuses, fileSize, timeRemaining } from '../utils';

export const DownloadRatios = ({ torrent }) => {
    if (torrent.status <= Statuses.Check) {
        return (
            <Text component='small'>
                {fileSize(torrent.sizeWhenDone)}, uploaded {fileSize(torrent.uploadedEver)} (Ratio {torrent.uploadRatio.toFixed(2)})
            </Text>
        );
    }

    return (
        <Text component='small'>
            {fileSize(torrent.sizeWhenDone)}, uploaded {fileSize(torrent.uploadedEver)} (Ratio {torrent.uploadRatio.toFixed(2)}) - {timeRemaining(torrent)}
        </Text>
    );
};

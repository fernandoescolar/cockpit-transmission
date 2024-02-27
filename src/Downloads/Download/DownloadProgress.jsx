import React from 'react';
import { Progress, ProgressVariant } from '@patternfly/react-core';
import { Statuses } from '../utils';

export const DownloadProgress = ({ torrent }) => {
    if (torrent.status === Statuses.CheckWait || torrent.status === Statuses.Check) {
        return (
            <Progress aria-label="check-progress" value={torrent.recheckProgress * 100} variant={ProgressVariant.warning} size='lg' />
        );
    }

    return (
        <>
            <Progress aria-label="download-progress" value={torrent.percentDone * 100} variant={ProgressVariant.success} />
            <Progress aria-label="upload-progress" className="progress-layer" value={torrent.uploadRatio * 100} max={torrent.seedRatioLimit * 100} />
        </>
    );
};

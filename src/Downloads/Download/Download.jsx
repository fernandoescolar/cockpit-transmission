import React from 'react';
import { Text } from "@patternfly/react-core/dist/esm/components/Text";
import { Stack, StackItem, Icon } from '@patternfly/react-core';
import { CheckCircleIcon, DownloadIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { DownloadRatios } from './DownloadRatios';
import { DownloadStatus } from './DownloadStatus';
import { DownloadActions } from './DownloadActions';
import { DownloadProgress } from './DownloadProgress';
import { StatusNames } from '../utils';

export const Download = ({ torrent }) => {
    const className = 'separator ' + StatusNames[torrent.status].toLowerCase();
    return (
        <Stack className={className}>
            <StackItem>
                <Text className='torrent-title' component='h2'>
                    {torrent.errorString ? (<Icon status="danger"><ExclamationCircleIcon /></Icon>) : torrent.percentDone === 1 ? (<Icon status="success"><CheckCircleIcon /></Icon>) : (<Icon status="info"><DownloadIcon /></Icon>)}
                    {torrent.name}
                </Text>
                <DownloadActions torrent={torrent} />
            </StackItem>
            <StackItem>
                <DownloadStatus torrent={torrent} />
            </StackItem>
            <StackItem>
                <DownloadProgress torrent={torrent} />
            </StackItem>
            <StackItem>
                <DownloadRatios torrent={torrent} />
            </StackItem>
        </Stack>
    );
};


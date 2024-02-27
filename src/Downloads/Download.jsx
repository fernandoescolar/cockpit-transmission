import React from 'react';
import { Text } from "@patternfly/react-core/dist/esm/components/Text";
import { Progress, ProgressVariant, Stack, StackItem, Icon } from '@patternfly/react-core';
import { CheckCircleIcon, DownloadIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { DownloadState } from './DownloadState';
import { DownloadStatus } from './DownloadStatus';
import { DownloadActions } from './DownloadActions';
import { StatusNames } from './utils';

export const Download = ({ torrent }) => {
    console.log(torrent);

    // const tabs = [
    //     {
    //         name: _("Logs"),
    //         renderer: () => (<Text>Hola1</Text>),
    //         data: { torrent }
    //     },
    //     {
    //         name: _("Tags"),
    //         renderer: () => (<Text>Hola2</Text>),
    //         data: { torrent }
    //     },
    //     {
    //         name: _("Pigs"),
    //         renderer: () => (<Text>Hola3</Text>),
    //         data: { torrent }
    //     }
    // ];
    const className = 'separator ' + StatusNames[torrent.status].toLowerCase();
    return (
        <Stack className={className}>
            <StackItem>
                <Text component='h2'>
                    {torrent.errorString ? (<Icon status="danger"><ExclamationCircleIcon /></Icon>) : torrent.percentDone === 1 ? (<Icon status="success"><CheckCircleIcon /></Icon>) : (<Icon status="info"><DownloadIcon /></Icon>)}
                    {torrent.name}
                    <DownloadActions torrent={torrent} />
                </Text>
            </StackItem>
            <StackItem>
                <DownloadStatus torrent={torrent} />
            </StackItem>
            <StackItem>
                <Progress value={torrent.percentDone * 100} variant={ProgressVariant.success} />
                <Progress className="progress-layer" value={torrent.uploadRatio * 100} max={torrent.seedRatioLimit * 100} />
            </StackItem>
            <StackItem>
                <DownloadState torrent={torrent} />
            </StackItem>
        </Stack>
        //            <ListingPanel colSpan='4' tabRenderers={tabs} />
    );
};

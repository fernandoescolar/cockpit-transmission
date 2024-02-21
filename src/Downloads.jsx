import cockpit from 'cockpit';
import React, { useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@patternfly/react-core/dist/esm/components/Card";
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown/index.js';
import { Flex, FlexItem } from "@patternfly/react-core/dist/esm/layouts/Flex";
import { ExpandableSection } from "@patternfly/react-core/dist/esm/components/ExpandableSection";
import { Text, TextVariants } from "@patternfly/react-core/dist/esm/components/Text";
import { LabelGroup } from "@patternfly/react-core/dist/esm/components/Label";
import { cellWidth, SortByDirection } from '@patternfly/react-table';
import { ListingTable } from "cockpit-components-table.jsx";
import { ListingPanel } from 'cockpit-components-listing-panel.jsx';
import { useTransmissionContext } from './context';
import { Progress, ProgressVariant, ProgressSize, Stack, StackItem } from '@patternfly/react-core';

const _ = cockpit.gettext;
const statuses = [
    "Stopped",
    "CheckWait",
    "Check",
    "DownloadWait",
    "Download",
    "SeedWait",
    "Seed"
];
const Downloads = ({ }) => {
    const state = useTransmissionContext();

    const rows = [];
    state.torrents.forEach(torrent => rows.push(Download({torrent})));
    return (
        <Card id="transmission">
            <CardHeader>
                <Flex flexWrap={{ default: 'nowrap' }} className="pf-v5-u-w-100">
                    <FlexItem grow={{ default: 'grow' }}>
                        <Flex>
                            <CardTitle>
                                <Text component={TextVariants.h1} className="containers-images-title">Trasnmission</Text>
                            </CardTitle>
                        </Flex>
                    </FlexItem>
                    <FlexItem>
                        <ImageOverActions />
                    </FlexItem>
                </Flex>
            </CardHeader>
            <CardBody>
            {state.torrents.length === 0 && (
                    <ul>
                        <li>No torrents</li>
                    </ul>
                )}
                <Stack>
                    {state.torrents.map(torrent => (
                    <Download torrent={torrent} />
                    ))}
                </Stack>
            </CardBody>
        </Card>
    );
};

const ImageOverActions = ({  }) => {
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);

    return (
        <Dropdown toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} id="image-actions-dropdown" />}
                  isOpen={isActionsKebabOpen}
                  isPlain
                  position="right"
                  dropdownItems={[
                      <DropdownItem key="settings"
                                    component="button"
                                    onClick={() => {
                                        setIsActionsKebabOpen(false);
                                    }}>
                          {"Settings"}
                      </DropdownItem>,
                      <DropdownItem key="prune-unused-images"
                                    id="prune-unused-images-button"
                                    component="button"
                                    className="pf-m-danger btn-delete"
                                    onClick={() => {
                                        setIsActionsKebabOpen(false);
                                    }}>
                          {"Add torrent"}
                      </DropdownItem>,
                  ]} />
    );
};

const Download = ({ torrent }) => {
    console.log(torrent);
    const fileSize = (size) => {
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

    const tabs = [
        {
            name: _("Logs"),
            renderer: () => (<Text>Hola1</Text>),
            data: { torrent }
        },
        {
            name: _("Tags"),
            renderer: () => (<Text>Hola2</Text>),
            data: { torrent }
        },
        {
            name: _("Pigs"),
            renderer: () => (<Text>Hola3</Text>),
            data: { torrent }
        }
    ];

    return (
        <>
            <StackItem>
                <Text component='h2'>
                    {torrent.name}
                </Text>
            </StackItem>
            <StackItem>
                <Text component='small'>
                {statuses[torrent.status]} from {torrent.peersConnected} peers - ▼{fileSize(torrent.rateDownload)}/s ▲ {fileSize(torrent.rateUpload)} kB/s
                </Text>
            </StackItem>
            <StackItem>
                <Progress value={torrent.percentDone*100} variant={ProgressVariant.success} />
                <Progress className="progress-layer" value={torrent.uploadRatio * 100} max={torrent.seedRatioLimit * 100}  />
            </StackItem>
            <StackItem>
                <Text component='small'>
                {fileSize(torrent.sizeWhenDone)}, uploaded {fileSize(torrent.uploadedEver)} (Ratio {torrent.uploadRatio.toFixed(2)})
                </Text>
            </StackItem>
            <StackItem className='separator'>

            </StackItem>
        </>
//            <ListingPanel colSpan='4' tabRenderers={tabs} />

    );
};

export default Downloads;
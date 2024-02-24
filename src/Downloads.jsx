import cockpit from 'cockpit';
import React, { useEffect, useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@patternfly/react-core/dist/esm/components/Card";
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown/index.js';
import { Flex, FlexItem } from "@patternfly/react-core/dist/esm/layouts/Flex";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core/dist/esm/components/Toolbar";
import { ExpandableSection } from "@patternfly/react-core/dist/esm/components/ExpandableSection";
import { Divider } from "@patternfly/react-core/dist/esm/components/Divider";
import { FormSelect, FormSelectOption } from "@patternfly/react-core/dist/esm/components/FormSelect";
import { Text, TextVariants } from "@patternfly/react-core/dist/esm/components/Text";
import { LabelGroup } from "@patternfly/react-core/dist/esm/components/Label";
import { cellWidth, SortByDirection } from '@patternfly/react-table';
import { ListingTable } from "cockpit-components-table.jsx";
import { ListingPanel } from 'cockpit-components-listing-panel.jsx';
import { useTransmissionContext } from './context';
import { Progress, ProgressVariant, ProgressSize, Stack, StackItem, Icon, SearchInput } from '@patternfly/react-core';
import { CheckCircleIcon, DownloadIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import * as transmission from './client';

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
const sanitize = (text) => {
    return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
};

const Downloads = () => {
    const state = useTransmissionContext();
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState({ state: 'all', search: '' });
    useEffect(() => {
        let r = state.torrents.slice();
        if (filter.search) {
            r = r.filter(t => sanitize(t.name).includes(sanitize(filter.search)));
        }
        if (filter.state === 'active') {
            r = r.filter(t => t.rateDownload > 0 || t.rateUpload > 0);
        }
        if (filter.state === 'downloading') {
            r = r.filter(t => t.status === 3 || t.status === 4);
        }
        if (filter.state === 'seeding') {
            r = r.filter(t => t.status === 5 || t.status === 6);
        }
        if (filter.state === 'stopped') {
            r = r.filter(t => t.status === 0);
        }
        if (filter.state === 'finished') {
            r = r.filter(t => t.percentDone === 1);
        }
        r.sort((a, b) => a.name.localeCompare(b.name));
        setRows(r);
    }, [state.torrents, filter]);

    return (
        <Card id="transmission">
            <CardHeader actions={{ actions: (<Filters filter={filter} handleFilterChanged={filter => setFilter(filter)} handleAddTorrent={() => { }} />) }}>
                <Flex flexWrap={{ default: 'nowrap' }} className="pf-v5-u-w-100">
                    <CardTitle>
                        <Text component={TextVariants.h1} className="containers-images-title">{_("Trasnmission")}</Text>
                    </CardTitle>
                </Flex>
            </CardHeader>
            <CardBody>
                <Stack>
                    {rows.map(torrent => (
                        <Download torrent={torrent} key={torrent.id} />
                    ))}
                </Stack>
            </CardBody>
        </Card>
    );
};

const Filters = ({ filter, handleFilterChanged, handleAddTorrent }) => {
    return (
        <Toolbar>
            <ToolbarContent>
                <ToolbarItem variant="label" htmlFor="torrents-filter">
                    {_("Show")}
                </ToolbarItem>
                <ToolbarItem>
                    <FormSelect id="torrents-filter" value={filter.state} onChange={(_, state) => handleFilterChanged({ ...filter, state })}>
                        <FormSelectOption value='all' label={_("All")} />
                        <FormSelectOption value='active' label={_("Active")} />
                        <FormSelectOption value='downloading' label={_("Downloading")} />
                        <FormSelectOption value='seeding' label={_("Seeding")} />
                        <FormSelectOption value='stopped' label={_("Stopped")} />
                        <FormSelectOption value='finished' label={_("Finished")} />
                    </FormSelect>
                </ToolbarItem>
                <Divider orientation={{ default: "vertical" }} />
                <ToolbarItem>
                    <SearchInput
                        value={filter.search}
                        onChange={(_, search) => handleFilterChanged({ ...filter, search })}
                        onClear={() => handleFilterChanged({ ...filter, search: '' })}
                    />
                </ToolbarItem>
                <Divider orientation={{ default: "vertical" }} />
                <ToolbarItem>
                    <Button variant="primary" onClick={handleAddTorrent}>
                        {_("Add Torrent")}
                    </Button>
                </ToolbarItem>
                <ToolbarItem>
                    <ImageOverActions />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};

const ImageOverActions = ({ }) => {
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);

    return (
        <Dropdown
            toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} />}
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
    const className = 'separator ' + statuses[torrent.status].toLowerCase();
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

const DownloadActions = ({ torrent }) => {
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);
    const handleStop = () => {
        transmission.stopTorrent(torrent.id).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleStart = () => {
        transmission.startTorrent(torrent.id).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleStartNow = () => {
        transmission.startTorrentNow(torrent.id).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleRemove = () => {
        console.log("Remove");
        setIsActionsKebabOpen(false);
        // transmission.removeTorrent(torrent.id).then(() => {
        //     setIsActionsKebabOpen(false);
        // });
    };
    const handleFullRemove = () => {
        console.log("Full remove");
        setIsActionsKebabOpen(false);
        // transmission.removeTorrent(torrent.id, true).then(() => {
        //     setIsActionsKebabOpen(false);
        // });
    };
    const handleVerify = () => {
        transmission.verifyTorrent(torrent.id).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleSetLocation = () => {
        console.log("Set location");
        setIsActionsKebabOpen(false);
    };
    const handleRename = () => {
        console.log("Rename");
        setIsActionsKebabOpen(false);
    };
    const handleReannounce = () => {
        transmission.reannounceTorrent(torrent.id).then(() => {
            setIsActionsKebabOpen(false);
        });
    };

    return (
        <Dropdown
            toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} id="torrent-actions-dropdown" />}
            isOpen={isActionsKebabOpen}
            isPlain
            position="right"
            dropdownItems={[
                <DropdownItem component="button" key="stop" onClick={handleStop}>
                    {_("Stop")}
                </DropdownItem>,
                <DropdownItem component="button" key="start" onClick={handleStart}>
                    {_("Start")}
                </DropdownItem>,
                <DropdownItem component="button" key="start-now" onClick={handleStartNow}>
                    {_("Start now")}
                </DropdownItem>,
                <Divider key="separator1" orientation={{ default: "horizontal" }} />,
                <DropdownItem component="button" key="remove" onClick={handleRemove}>
                    {_("Remove from list")}
                </DropdownItem>,
                <DropdownItem component="button" key="full-remove" onClick={handleFullRemove}>
                    {_("Trash data and remove from list")}
                </DropdownItem>,
                <Divider key="separator2" orientation={{ default: "horizontal" }} />,
                <DropdownItem component="button" key="verify" onClick={handleVerify}>
                    {_("Verify local data")}
                </DropdownItem>,
                <DropdownItem component="button" key="setlocation" onClick={handleSetLocation}>
                    {_("Set location")}
                </DropdownItem>,
                <DropdownItem component="button" key="rename" onClick={handleRename}>
                    {_("Rename")}
                </DropdownItem>,
                <Divider key="separator3" orientation={{ default: "horizontal" }} />,
                <DropdownItem component="button" key="reannounce" onClick={handleReannounce}>
                    {_("Ask tracker for more peers")}
                </DropdownItem>,
            ]}
        />
    );
};

const DownloadStatus = ({ torrent }) => {
    if (torrent.errorString) {
        return (
            <Text component='small' className='error'>
                {torrent.errorString}
            </Text>
        );
    }
    if (torrent.status === 0) {
        return (
            <Text component='small'>
                Stopped
            </Text>
        );
    }
    if (torrent.status <= 2) {
        return (
            <Text component='small'>
                Checking
            </Text>
        );
    }
    if (torrent.status <= 4) {
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

const DownloadState = ({ torrent }) => {
    if (torrent.status <= 2) {
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

const timeRemaining = (torrent) => {
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

export default Downloads;
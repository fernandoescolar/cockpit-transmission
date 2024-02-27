import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core/dist/esm/components/Card";
import { Flex } from "@patternfly/react-core/dist/esm/layouts/Flex";
import { Text, TextVariants } from "@patternfly/react-core/dist/esm/components/Text";
import { Stack } from '@patternfly/react-core';
import { useTransmissionContext } from '../context';
import { DownloadsFilters } from './DownloadsFilters';
import { Download } from './Download/Download';
import { _ } from './utils';

const sanitize = (text) => {
    return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
};

export const Downloads = () => {
    const { state } = useTransmissionContext();
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
            <CardHeader actions={{ actions: (<DownloadsFilters filter={filter} handleFilterChanged={filter => setFilter(filter)} handleAddTorrent={() => { }} />) }}>
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

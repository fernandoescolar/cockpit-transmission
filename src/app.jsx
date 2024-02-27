import cockpit from 'cockpit';
import React, { useState, useEffect } from 'react';
import { Page, PageSection } from "@patternfly/react-core/dist/esm/components/Page";
import { Stack } from "@patternfly/react-core/dist/esm/layouts/Stack";
import { WithTransmissionContext } from './context';
import * as transmission from './client';
import { Downloads } from './Downloads';
import Configuration from './Configuration';

export const Application = () => {
    const [reloadInterval, setReloadInterval] = useState(undefined);
    const [state, setState] = useState({ torrents: [], hasBeenInitialized: false, config: { host: '', port: '', username: '', password: '' } });
    const syntax = {
        parse: (data) => JSON.parse(data),
        stringify: (data) => JSON.stringify(data, null, 2),
    };
    const file = cockpit.file('/usr/share/cockpit/.cockpit-transmission', { syntax, superuser: true });
    const reload = () => {
        transmission
                .getTorrents()
                .then(response => {
                    setState({ ...state, torrents: response.arguments.torrents, hasBeenInitialized: true });
                })
                .catch(err => {
                    console.log(err);
                    setState({ ...state, torrents: [], hasBeenInitialized: false });
                });
    };
    const readConfiguration = (config) => {
        if (!config) {
            return;
        }

        if (!config.host || !config.port || !config.username || !config.password) {
            return;
        }

        transmission.init(config.host, config.port, config.username, config.password);
        setState({ torrents: [], hasBeenInitialized: true, config });
        if (reloadInterval) {
            clearInterval(reloadInterval);
        }
        if (reloadInterval) {
            clearInterval(reloadInterval);
        }

        reload();
        setReloadInterval(setInterval(() => {
            reload();
        }, 5000));
    };

    useEffect(() => {
        file.watch(content => {
            readConfiguration(content);
        });
    }, []);

    const handleUpdate = ({ host, port, username, password }) => {
        console.log("Update");
        setState({ ...state, config: { host, port, username, password } });
        file.replace(state.config);
    };

    return (
        <WithTransmissionContext value={state}>
            <Page id="transmission" key="transmission">
                <PageSection className='ct-pagesection-mobile'>
                    <Stack hasGutter>
                        { state.hasBeenInitialized ? (<Downloads />) : (<Configuration handleUpdate={handleUpdate} />) }
                    </Stack>
                </PageSection>
            </Page>
        </WithTransmissionContext>
    );
};

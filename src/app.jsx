import cockpit from 'cockpit';
import React, { useState, useEffect } from 'react';
import { Page, PageSection, PageSectionVariants } from "@patternfly/react-core/dist/esm/components/Page";
import { Alert, AlertActionCloseButton, AlertActionLink, AlertGroup } from "@patternfly/react-core/dist/esm/components/Alert";
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Checkbox } from "@patternfly/react-core/dist/esm/components/Checkbox";
import { EmptyState, EmptyStateHeader, EmptyStateFooter, EmptyStateIcon, EmptyStateActions, EmptyStateVariant } from "@patternfly/react-core/dist/esm/components/EmptyState";
import { Stack } from "@patternfly/react-core/dist/esm/layouts/Stack";
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { WithTransmissionContext } from './context';
import * as transmission from './client';
import Downloads from './Downloads';
import Configuration from './Configuration';

const Application = () => {
    const [reloadInterval, setReloadInterval] = useState(undefined);
    const [state, setState] = useState({ torrents: [], hasBeenInitialized: false, config: { host: '', port: '', username: '', password: ''} });
    const syntax = {
        parse: (data) => JSON.parse(data),
        stringify: (data) => JSON.stringify(data, null, 2),
    };
    const file = cockpit.file('/usr/share/cockpit/.cockpit-transmission', { syntax, superuser: true });
    const reload = () => {
        transmission.getTorrents().then(response => {
            setState({ ...state, torrents: response.arguments.torrents, hasBeenInitialized: true });
        }).catch(err => {
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
        }, 10000));
    };

    useEffect(() => {
        file.watch(content => {
            console.log("File changed");
            console.log(content);
            readConfiguration(content);
        });
    }, []);

    const handleUpdate = ({ host, port, username, password }) => {
        console.log("Update");
        setState({ ...state, config: { host, port, username, password } });
        file.replace(state.config).done(() => { console.log("Done") }).fail(err => { console.log(err) });
    };

    return (
        <WithTransmissionContext value={state}>
            <Page id="transmission" key="transmission">
                <PageSection className="content-filter" padding={{ default: 'noPadding' }} variant={PageSectionVariants.light}>
                </PageSection>
                <PageSection className='ct-pagesection-mobile'>
                    <Stack hasGutter>
                        { state.hasBeenInitialized ? (<Downloads />) : (<Configuration handleUpdate={handleUpdate} />) }
                    </Stack>
                </PageSection>
            </Page>
        </WithTransmissionContext>
    );
};

export default Application;
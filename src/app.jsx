import cockpit from 'cockpit';
import React, { useEffect } from 'react';
import { Page, PageSection } from "@patternfly/react-core/dist/esm/components/Page";
import { Stack } from "@patternfly/react-core/dist/esm/layouts/Stack";
import { useTransmissionContext } from './context';
import { Toasts } from './Toasts';
import { Downloads } from './Downloads';
import Configuration from './Configuration';

export const Application = () => {
    const { state, actions } = useTransmissionContext();
    const syntax = {
        parse: (data) => JSON.parse(data),
        stringify: (data) => JSON.stringify(data, null, 2),
    };
    const file = cockpit.file('/usr/share/cockpit/.cockpit-transmission', { syntax, superuser: true });
    const readConfiguration = (config) => {
        if (!config) {
            return;
        }

        if (!config.host || !config.port || !config.username || !config.password) {
            return;
        }

        actions.init(config);
    };
    const handleUpdate = ({ host, port, username, password }) => {
        file.replace({ host, port, username, password });
    };

    useEffect(() => {
        file.watch(content => {
            readConfiguration(content);
        });
    }, []);

    return (
        <>
            <Toasts />
            <Page id="transmission" key="transmission">
                <PageSection className='ct-pagesection-mobile'>
                    <Stack hasGutter>
                        { state.hasBeenInitialized ? (<Downloads />) : (<Configuration handleUpdate={handleUpdate} />) }
                    </Stack>
                </PageSection>
            </Page>
        </>
    );
};

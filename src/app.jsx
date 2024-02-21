/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from 'cockpit';
import React from 'react';
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

const _ = cockpit.gettext;

export class Application extends React.Component {
    constructor() {
        super();
        this.reloadInterval = undefined;
        this.state = {
            torrents: [],
            hasBeenInitialized: false,
            config: {
                host: '',
                port: '',
                username: '',
                password: '',
            },
        };

        cockpit.file('~/.cockpit-transmission').watch(content => {
            if (!content) {
                return;
            }

            var config = JSON.parse(content);
            if (config.host === '' || config.port === '' || config.username === '' || config.password === '') {
                return;
            }

            transmission.init(config.host, config.port, config.username, config.password);
            this.setState({  torrents: [], hasBeenInitialized: true, config: config});
            if (this.reloadInterval) {
                clearInterval(this.reloadInterval);
            }

            this.reloadInterval = setInterval(() => {
                transmission.getTorrents().then(response => {
                    this.setState({ ...this.state, torrents: response.arguments.torrents });
                });
            }, 10000);
        });
    }

    render() {
        return (
            <WithTransmissionContext value={this.state}>
                <Page id="transmission" key="transmission">
                    <PageSection className="content-filter" padding={{ default: 'noPadding' }} variant={PageSectionVariants.light}>
                    </PageSection>
                    <PageSection className='ct-pagesection-mobile'>
                        <Stack hasGutter>
                            { this.state.hasBeenInitialized ? (<Downloads />) : (<Configuration />) }
                        </Stack>
                    </PageSection>
                </Page>
            </WithTransmissionContext>
        );
    }
}


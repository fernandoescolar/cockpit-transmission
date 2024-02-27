import React from 'react';
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core/dist/esm/components/Toolbar";
import { Divider } from "@patternfly/react-core/dist/esm/components/Divider";
import { FormSelect, FormSelectOption } from "@patternfly/react-core/dist/esm/components/FormSelect";
import { SearchInput } from '@patternfly/react-core';
import { DownloadsActions } from './DownloadsActions';
import { _ } from './utils';

export const DownloadsFilters = ({ filter, handleFilterChanged, handleAddTorrent }) => {
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
                    <DownloadsActions />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};

import React, { useState } from 'react';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown/index.js';
import { _ } from './utils';

export const DownloadsActions = () => {
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);

    return (
        <Dropdown
            toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} />}
            isOpen={isActionsKebabOpen}
            isPlain
            position="right"
            dropdownItems={[
                <DropdownItem
                    key="settings"
                    component="button"
                    onClick={() => {
                        setIsActionsKebabOpen(false);
                    }}
                >
                    {_("Settings")}
                </DropdownItem>,
                <DropdownItem
                    key="add-torrent"
                    component="button"
                    className="pf-m-danger btn-delete"
                    onClick={() => {
                        setIsActionsKebabOpen(false);
                    }}
                >
                    {_("Add torrent")}
                </DropdownItem>,
            ]}
        />
    );
};

import React, { useState } from 'react';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown/index.js';
import { Divider } from "@patternfly/react-core/dist/esm/components/Divider";
import { Statuses, _ } from '../utils';
import { useTransmissionContext } from '../../context';

export const DownloadActions = ({ torrent }) => {
    const { actions } = useTransmissionContext();
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);
    const handleDetails = () => {
        console.log(torrent);
        setIsActionsKebabOpen(false);
    };
    const handleStop = () => {
        actions.stop(torrent).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleStart = () => {
        actions.start(torrent).then(() => {
            setIsActionsKebabOpen(false);
        });
    };
    const handleStartNow = () => {
        actions.startNow(torrent).then(() => {
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
        actions.verify(torrent).then(() => {
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
        actions.reannounce(torrent).then(() => {
            setIsActionsKebabOpen(false);
        });
    };

    const dropdownItems = [];
    dropdownItems.push(<DropdownItem component="button" key="details" onClick={handleDetails}>{_("View details")}</DropdownItem>);
    dropdownItems.push(<Divider key="separator" orientation={{ default: "horizontal" }} />);
    if (torrent.status === Statuses.Stopped) {
        dropdownItems.push(<DropdownItem component="button" key="start" onClick={handleStart}>{_("Start")}</DropdownItem>);
        dropdownItems.push(<DropdownItem component="button" key="start-now" onClick={handleStartNow}>{_("Start now")}</DropdownItem>);
    } else {
        dropdownItems.push(<DropdownItem component="button" key="stop" onClick={handleStop}>{_("Stop")}</DropdownItem>);
    }
    dropdownItems.push(<Divider key="separator1" orientation={{ default: "horizontal" }} />);
    dropdownItems.push(<DropdownItem component="button" key="remove" onClick={handleRemove}>{_("Remove from list")}</DropdownItem>);
    dropdownItems.push(<DropdownItem component="button" key="full-remove" onClick={handleFullRemove}>{_("Trash data and remove from list")}</DropdownItem>);
    dropdownItems.push(<Divider key="separator2" orientation={{ default: "horizontal" }} />);
    dropdownItems.push(<DropdownItem component="button" key="verify" onClick={handleVerify}>{_("Verify local data")}</DropdownItem>);
    dropdownItems.push(<DropdownItem component="button" key="setlocation" onClick={handleSetLocation}>{_("Set location")}</DropdownItem>);
    dropdownItems.push(<DropdownItem component="button" key="rename" onClick={handleRename}>{_("Rename")}</DropdownItem>);
    dropdownItems.push(<Divider key="separator3" orientation={{ default: "horizontal" }} />);
    dropdownItems.push(<DropdownItem component="button" key="reannounce" onClick={handleReannounce}>{_("Ask tracker for more peers")}</DropdownItem>);

    return (
        <Dropdown
            toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} id="torrent-actions-dropdown" />}
            isOpen={isActionsKebabOpen}
            isPlain
            position="right"
            dropdownItems={dropdownItems}
        />
    );
};

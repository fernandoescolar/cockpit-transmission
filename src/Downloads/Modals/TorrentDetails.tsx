import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, TabTitleText, FlexItem, Flex, DescriptionList, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription } from '@patternfly/react-core';
import { StatusNames, _ } from '../utils';
import { Caption, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

export const TorrentDetails = ({torrent, handleClose}) => {
    const [activeTabKey, setActiveTabKey] = useState(0);
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };
    return (
        <Modal
            bodyAriaLabel={torrent.name}
            tabIndex={0}
            title={torrent.name}
            isOpen={true}
            onClose={handleClose}
            actions={[
                <Button key="confirm" variant="primary" onClick={handleClose}>
                    {_("Close")}
                </Button>,
            ]}
        >
            <Tabs
                activeKey={activeTabKey}
                onSelect={handleTabClick}
                isBox
                aria-label="Torrent details tabs"
                role="region"
            >
                <Tab eventKey={0} title={<TabTitleText>Info</TabTitleText>} aria-label="info">
                    <Info torrent={torrent} />
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Peers</TabTitleText>} aria-label="peers">
                    <Peers torrent={torrent} />
                </Tab>
                <Tab eventKey={2} title={<TabTitleText>Trackers</TabTitleText>} aria-label="trackers">
                    Trackers
                </Tab>
                <Tab eventKey={3} title={<TabTitleText>Files</TabTitleText>} aria-label="files">
                    Files
                </Tab>
            </Tabs>
        </Modal>
    );
};

const Info = ({torrent}) => {
    return (
        <Flex>
            <FlexItem>
                <DescriptionList>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("ID")}</DescriptionListTerm>
                        <DescriptionListDescription>{torrent.ID}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("Name")}</DescriptionListTerm>
                        <DescriptionListDescription>{torrent.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("State")}</DescriptionListTerm>
                        <DescriptionListDescription>{StatusNames[torrent.status]}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("Size")}</DescriptionListTerm>
                        <DescriptionListDescription>{torrent.totalSize}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("Downloaded")}</DescriptionListTerm>
                        <DescriptionListDescription>{torrent.downloaded}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>{_("Uploaded")}</DescriptionListTerm>
                        <DescriptionListDescription>{torrent.uploaded}</DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </FlexItem>
        </Flex>
    );
};

const Peers = ({torrent}) => {
    return (
        <Table
            aria-label="Simple table"
        >
            <Caption>Simple table using composable components</Caption>
            <Thead>
            <Tr>
                <Th>_("Up")</Th>
                <Th>_("Down")</Th>
                <Th>_("Status")</Th>
                <Th>_("Client")</Th>
                <Th>_("IP")</Th>
            </Tr>
            </Thead>
            <Tbody>
                {torrent.peers.map((peer, index) => (
                    <Tr key={index}>
                        <Td>{peer.up}</Td>
                        <Td>{peer.down}</Td>
                        <Td>{peer.status}</Td>
                        <Td>{peer.client}</Td>
                        <Td>{peer.ip}</Td>
                    </Tr>
                ))}
            </Tbody>
      </Table>
    );
}

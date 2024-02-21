import cockpit from 'cockpit';
import React, { useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@patternfly/react-core/dist/esm/components/Card";
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/dist/esm/deprecated/components/Dropdown/index.js';
import { Flex, FlexItem } from "@patternfly/react-core/dist/esm/layouts/Flex";
import { ExpandableSection } from "@patternfly/react-core/dist/esm/components/ExpandableSection";
import { Text, TextVariants } from "@patternfly/react-core/dist/esm/components/Text";
import { useTransmissionContext } from './context';

const Downloads = ({ }) => {
    const state = useTransmissionContext();


   return (
        <Card id="transmission">
            <CardHeader>
                <Flex flexWrap={{ default: 'nowrap' }} className="pf-v5-u-w-100">
                    <FlexItem grow={{ default: 'grow' }}>
                        <Flex>
                            <CardTitle>Trasnmission</CardTitle>
                        </Flex>
                    </FlexItem>
                    <FlexItem>
                        <ImageOverActions />
                    </FlexItem>
                </Flex>
            </CardHeader>
            <CardTitle>Trasnmission</CardTitle>
            <CardBody>
                {state.torrents.length === 0 && (
                    <ul>
                        <li>No torrents</li>
                    </ul>
                )}
                {state.torrents.map((torrent, index) => (
                    <ExpandableSection key={index} toggleText={torrent.name}>
                        <Text component={TextVariants.small}>ID: {torrent.id}</Text>
                        <Text component={TextVariants.small}>Date created: {torrent.dateCreated}</Text>
                        <Text component={TextVariants.small}>Download directory: {torrent.downloadDir}</Text>
                        <Text component={TextVariants.small}>Added date: {torrent.addedDate}</Text>
                    </ExpandableSection>
                ))}
            </CardBody>
        </Card>
    );
};

const ImageOverActions = ({  }) => {
    const [isActionsKebabOpen, setIsActionsKebabOpen] = useState(false);

    return (
        <Dropdown toggle={<KebabToggle onToggle={() => setIsActionsKebabOpen(!isActionsKebabOpen)} id="image-actions-dropdown" />}
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

export default Downloads;
import React, { useState } from 'react';
import cockpit from 'cockpit';
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Form, FormGroup } from "@patternfly/react-core/dist/esm/components/Form";
import { TextInput } from "@patternfly/react-core/dist/esm/components/TextInput";
import { useTransmissionContext } from './context';

const Configuration = ({ }) => {
    const [t, _] = useTransmissionContext();
    const [state, setState] = useState(t.config);
    const handleUpdate = () => {
        console.log("Update");
        cockpit.file('~/.cockpit-transmission').replace(JSON.stringify(state));
    };

    return (
        <>
        <Form isHorizontal>
            <FormGroup fieldId="rename-dialog-container-name" label={_("New container name")}>
                <TextInput
                        value={state.config.host}
                        placeholder='localhost'
                        type="text"
                        onChange={(_, value) => setState({...state, host: value })} />
                <TextInput
                        value={state.config.port}
                        placeholder='9091'
                        type="text"
                        onChange={(_, value) => setState({...state, port: value })} />
                <TextInput
                        value={state.config.username}
                        type="text"
                        onChange={(_, value) => setState({ ...state, username: value })} />
                <TextInput
                        value={state.config.password}
                        placeholder='localhost'
                        type="password"
                        onChange={(_, value) => setState({...state, password: value })} />
            </FormGroup>
        </Form>
        <Button variant="primary" onClick={handleUpdate}>
            {_("Update")}
        </Button>
        </>
    );
}

export default Configuration;
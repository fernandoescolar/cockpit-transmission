import React, { useState } from 'react';
import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { Form, FormGroup } from "@patternfly/react-core/dist/esm/components/Form";
import { TextInput } from "@patternfly/react-core/dist/esm/components/TextInput";
import { useTransmissionContext } from './context';

const Configuration = ({ handleUpdate }) => {
    const t = useTransmissionContext();
    const [state, setState] = useState(t.config);
    return (
        <>
        <Form isHorizontal>
            <FormGroup fieldId="rename-dialog-container-name" label="New container name">
                <TextInput
                        value={state.host}
                        placeholder='localhost'
                        type="text"
                        onChange={(_, value) => setState({...state, host: value })} />
                <TextInput
                        value={state.port}
                        placeholder='9091'
                        type="text"
                        onChange={(_, value) => setState({...state, port: value })} />
                <TextInput
                        value={state.username}
                        type="text"
                        onChange={(_, value) => setState({ ...state, username: value })} />
                <TextInput
                        value={state.password}
                        placeholder='localhost'
                        type="password"
                        onChange={(_, value) => setState({...state, password: value })} />
            </FormGroup>
        </Form>
        <Button variant="primary" onClick={() => handleUpdate(state)}>
            Update
        </Button>
        </>
    );
}

export default Configuration;
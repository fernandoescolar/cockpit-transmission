import React from 'react';
import { Alert, AlertGroup, AlertActionCloseButton, AlertVariant } from '@patternfly/react-core';
import { useTransmissionContext } from './context';

export const Toasts = () => {
  const { state, actions } = useTransmissionContext();
  const removeAlert = (key) => {
    actions.readAlert(key);
  };

  return (
      <AlertGroup isToast isLiveRegion>
        {state.alerts.map(({ key, variant, title }) => (
          <Alert
            variant={AlertVariant[variant]}
            title={title}
            actionClose={
              <AlertActionCloseButton
                title={title}
                variantLabel={`${variant} alert`}
                onClose={() => removeAlert(key)}
              />
            }
            key={key}
          />
        ))}
      </AlertGroup>
  );
};

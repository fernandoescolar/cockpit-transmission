import React, { useContext } from "react";

export const TransmissionContext = React.createContext();
export const useTransmissionContext = () => useContext(TransmissionContext);

export const WithTransmissionContext = ({ value, children }) => {
    return (
        <TransmissionContext.Provider value={value}>
            {children}
        </TransmissionContext.Provider>
    );
};

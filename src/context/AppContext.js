import AgoraRTC from "agora-rtc-sdk-ng";
import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(
    undefined
);

const config = {
    mode: "rtc", codec: "vp8",
};


export const AppProvider = ({ children }) => {

    const [client, setClient] = useState(AgoraRTC.createClient(config));
    const value = useMemo(() => ({
        client,
        setClient
    }), [client]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

FormSubmit.propTypes = {

};

function FormSubmit(props, ref) {
    const [appId, setAppId] = useState('2d265eac4ca3480688a95fa45278a645');
    const [channel, setChannel] = useState('DOCOSAN_VIDEO_0987334567');
    const [token, setToken] = useState('0062d265eac4ca3480688a95fa45278a645IADNq0jTxUNax/DXa3AW3OW0uRNzQ1WsyAGt6y6sBp3af7LdtrQAAAAAIgAEZAAAGH+kYAQAAQAAAAAAAwAAAAAAAgAAAAAABAAAAAAA');


    useImperativeHandle(ref, () => ({
        getAllData
    }));

    const getAllData = () => {
        return {
            appId,
            channel,
            token,
        }
    }

    return (
        <div>
            <form>
                <label>
                    App Id:
                <input type="text"
                        value={appId}
                        onChange={(e) => {
                            setAppId(e.target.value)
                        }}
                    />

                </label>
                <label>
                    Channel:
                <input type="text" value={channel}
                        onChange={(e) => {
                            setChannel(e.target.value)
                        }}

                    />

                </label>
                <label>
                    Token:
                <input type="text" value={token}
                        onChange={(e) => {
                            setToken(e.target.value)
                        }}
                    />
                </label>
                {/* <input type="submit" value="Submit" /> */}
            </form>
        </div>
    );
}


FormSubmit = forwardRef(FormSubmit);

export default FormSubmit;
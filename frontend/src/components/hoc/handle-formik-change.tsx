import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

export interface IHandleFormikChange {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?(values: any): void;
}

const HandleFormikChange: React.FC<IHandleFormikChange> = ({ onChange }) => {
    const { values } = useFormikContext();

    useEffect(() => {
        if (typeof onChange !== 'function') return;
        onChange(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    return null;
};

export default HandleFormikChange;

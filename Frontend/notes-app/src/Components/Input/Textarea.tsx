import "./style.css"
import React from 'react'


type Props = {
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}

function Textarea({ placeholder, onChange, value }: Props) {
    return (
        <textarea
            autoCapitalize="sentences"
            autoComplete="on"
            onChange={onChange}
            spellCheck={true}
            minLength={1}
            value={value}
            placeholder={placeholder}></textarea>
    )
}

export default Textarea;
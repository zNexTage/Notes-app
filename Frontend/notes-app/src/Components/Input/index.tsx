import "./style.css"
import React from 'react'

type Props = {
    placeholder: string
    type: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
}

function Input({ type, onChange, placeholder, value }: Props) {
    return (
        <input
            value={value}
            placeholder={placeholder}
            type={type}
            onChange={onChange}
        />
    )
}

export default Input;
import "./style.css"
import React from 'react'

type Props = {
    placeholder: string
    type: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({ type, onChange, placeholder }: Props) {
    return (
        <input
            placeholder={placeholder}
            type={type}
            onChange={onChange}
        />
    )
}

export default Input;
import "./style.css"
import React from 'react'


type Props = {
    placeholder: string
    onChange?:(event: React.ChangeEvent<HTMLTextAreaElement>)=>void
}

function Textarea({placeholder, onChange}:Props){
    return (
        <textarea 
        autoCapitalize="sentences"
        autoComplete="on"
        onChange={onChange} 
        spellCheck={true}
        minLength={1}
        placeholder={placeholder}></textarea> 
    )
}

export default Textarea;
import React from 'react'
import "./style.css"

type Props = {
    color: string
}

function Separator({ color }: Props) {
    return (
        <div style={{ backgroundColor: color }} className="separator"></div>
    );
}

export default Separator;
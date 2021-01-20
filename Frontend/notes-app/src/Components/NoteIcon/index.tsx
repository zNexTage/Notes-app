import Icon from "../../Assets/icon.png"

type Props = {
    width:string | number;
    height:string | number;
}

function NoteIcon({width, height}:Props){
    return (
        <img 
        style={{width, height}}
        src={Icon}
        />
    )
}

export default NoteIcon;
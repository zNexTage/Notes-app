import "./style.css";

type Props = {
    title: string
    color: string
    textColor?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button({ title, color, textColor, onClick }: Props) {

    return (
        <button onClick={onClick} className="btn" style={{ backgroundColor: color, color: textColor ? textColor : "white" }}>
            <label>
                {title}
            </label>
        </button>
    );
}

export default Button;
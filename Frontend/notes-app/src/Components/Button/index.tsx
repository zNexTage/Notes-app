import "./style.css";

type Props = {
    title: string | JSX.Element
    color: string
    textColor?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseOver?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseOut?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button({ title, color, textColor, onClick, onMouseOver, onMouseOut }: Props) {
    const isTitleString = typeof title === "string";

    return (
        <button onMouseOut={onMouseOut} onMouseOver={onMouseOver} onClick={onClick} className="btn" style={{ backgroundColor: color, color: textColor ? textColor : "white" }}>
            {isTitleString ?
                <label>
                    {title}
                </label>
                :
                title
            }
        </button>
    );
}

export default Button;
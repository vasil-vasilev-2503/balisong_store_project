/*
import "../index.css"

export const Label = ({htmlForAttribute, text}) => {
    return <label className="labels" htmlFor={htmlForAttribute}>
        {text}
    </label>
}

 */
import "../index.css";

export const Label = ({ htmlForAttribute, text, auth }) => {
    const className = auth ? "auth-form-label" : "profile-form-label";
    return (
        <label className={className} htmlFor={htmlForAttribute}>
            {text}
        </label>
    );
};
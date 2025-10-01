/*
import "../index.css"
import {useFormContext} from "react-hook-form";


export const Input = ({type, id}) => {
    const {register} = useFormContext();
    return <input className="inputs" type={type} id={id} {...register(id)}></input>
}

 */
import "../index.css";

export const Input = ({ type, id, value, onChange, auth }) => {
    const className = auth ? "auth-input" : "profile-form-input";
    return (
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className={className}
            placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
        />
    );
};


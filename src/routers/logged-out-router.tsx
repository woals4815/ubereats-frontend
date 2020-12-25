import React from "react";
import { useForm } from "react-hook-form";

export const LoggedOutRouter = () => {
    const {register, watch, handleSubmit, errors} = useForm();
    const onSubmit = () => {
        console.log(watch());
    };
    const onInvalid = () => {
        console.log('cant create account');
    };
    console.log(errors);
    return (
        <div>
            <h1>Logged Out</h1>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}> 
                <div>
                    <input 
                        ref={register({
                            required: true,
                        })}
                        name="email"
                        type='email'
                        placeholder='email'/>
                </div>
                <div>
                    <input 
                        ref={register({ required: true })}
                        name="password"
                        type="password"
                        required
                        placeholder="password"
                        />
                </div>
            </form>
        </div>
    )

}
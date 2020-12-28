import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import uberLogo from '../images/eats-logo.svg';
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql`
mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
interface ILoginForm {
    email: string;
    password: string;
    resultError?: string;
  }
  
  export const Login = () => {
    const { register, getValues, errors, handleSubmit, formState } = useForm<ILoginForm>({
        mode: 'onChange'
    });
    const onCompleted = (data: loginMutation) => {
        const {
          login: { ok, token },
        } = data;
        if (ok && token) {
          localStorage.setItem(LOCALSTORAGE_TOKEN, token);
          authTokenVar(token);
          isLoggedInVar(true);
        }
      };
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
    >(LOGIN_MUTATION, {
        onCompleted,
        });
    const onSubmit = () => {
    if(!loading){    
        const { email, password } = getValues();
        loginMutation({
        variables: {
            loginInput: {
                email,
                password,
            },
            },
        });}
    };
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Uber Eats</title>
            </Helmet>
            <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={uberLogo} className="w-52 mb-10" alt="uberLogo"/>
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Welcome Back
                </h4>
                <h3 className="text-2xl text-gray-800">Log In</h3>
                <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-3 mt-5 w-full mb-5"
                >
                    <input
                    ref={register({ 
                        required: "Email is required", 
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    })}
                    name="email"
                    required
                    type="email"
                    placeholder="Email"
                    className="input"
                    />
                    {errors.email?.message && (
                    <FormError errorMessage={errors.email?.message} />
                    )}
                    {errors.email?.type === "pattern" && (
                        <FormError errorMessage={'Please enter a valid email'} />
                    )}
                    <input
                    ref={register({ required: "Password is required" })}
                    required
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input"
                    />
                    {errors.password?.message && (
                    <FormError errorMessage={errors.password?.message} />
                    )}
                    {errors.password?.type === "minLength" && (
                    <FormError errorMessage="Password must be more than 10 chars." />
                    )}
                    <Button 
                        canClick={formState.isValid}
                        loading={loading}
                        actionText={"Log in"}
                    />
                    {loginMutationResult?.login.error && (
                    <FormError errorMessage={loginMutationResult.login.error} />
                    )}
                </form>
                <div>
                    New to Uber?{" "}
                    <Link to="/create-account" className=" text-lime-600 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
        );
    };
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";
import { meQuery } from "../__generated__/meQuery";

const ME_QUERY = gql`
    query meQuery {
        me {
            id
            email
            role
            verified
        }
    }
`;

export const LoggedInRouter = () => {
    const {data, loading, error} = useQuery<meQuery>(ME_QUERY);
    console.log(error);
    if(loading || !data || error){
        return <div className=" h-screen flex justify-center items-center">
            <span className="font-medium text-xl tracking-wide">Loading...</span>
        </div>
    }
    return (
    <div>
        <h1>Logged In</h1>
        <button onClick={()=> isLoggedInVar(false)}>Log Out</button>
    </div>
    )
}

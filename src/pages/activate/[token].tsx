import axios from "axios";
import { NextPageContext } from "next";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Activate({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    activateAccount();
  }, [token]);
  const activateAccount = async () => {
    try {
      const { data } = await axios.put("/api/auth/activate", { token });
      setSuccess(data.message);
    } catch (error: any) {
      setError((error?.response?.data as Error).message);
    }
  };
  return (
    <div className="bg-black h-screen flex items-center justify-center text-center">
      {error && (
        <div>
          <p className="text-red-500 text-xl font-bold">{error}</p>
          <button
            className="mt-4 bg-blue-500 text-white hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-150"
            onClick={() => signIn()}
          >
            Sign in instead
          </button>
        </div>
      )}
      {success && (
        <div>
          <p className="text-green-500 text-xl font-bold">{success}</p>
          <button
            className="mt-4 bg-blue-500 text-white hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-150"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const token = query.token;
  return {
    props: { token },
  };
}

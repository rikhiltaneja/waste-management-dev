"use client";

import { useAuth, useSignUp, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Details {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function Page() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, userId } = useAuth();
  const [details, setDetails] = useState<Details>({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (isSignedIn) {
      signUpCustomRequest();
    }
  }, [isSignedIn]);

  const signUpCustomRequest = () => {
    const userInfo = {
      id: userId,
      name: details.firstName + details.lastName,
      email: details.email,
      phoneNumber: details.phoneNumber,
      localityId: 1,
    };
    axios
      .post("http://localhost:8080/citizens/create", userInfo)
      .then((response) => {
        console.log(response);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!isLoaded) {
    return null;
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: details.otp,
    });

    if (signUpAttempt.status === "complete") {
      await setActive({
        session: signUpAttempt.createdSessionId,
        navigate: async ({ session }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
        },
      });
    } else {
      console.error(signUpAttempt);
    }
  };
  const sendOTP = async () => {
    await signUp.create({
      emailAddress: details.email,
      firstName: details.firstName,
      lastName: details.lastName,
    });

    await signUp.prepareEmailAddressVerification();
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <form
        onSubmit={(e) => {
          submitForm(e);
        }}
        className="flex flex-col gap-2"
      >
        <input
          onChange={(e) => {
            setDetails({ ...details, email: e.target.value });
          }}
          type="email"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="Email"
        />
        {/* <input
          onChange={(e) => {
            setDetails({ ...details, password: e.target.value });
          }}
          type="password"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="Secure password"
        /> */}
        <button type="button" onClick={sendOTP}>
          Send OTP
        </button>
        <input
          onChange={(e) => {
            setDetails({ ...details, otp: e.target.value });
          }}
          type="text"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="OTP"
        />
        <input
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          onChange={(e) => {
            setDetails({ ...details, firstName: e.target.value });
          }}
        />
        <input
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          onChange={(e) => {
            setDetails({ ...details, lastName: e.target.value });
          }}
        />
        <input
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          onChange={(e) => {
            setDetails({ ...details, phoneNumber: e.target.value });
          }}
        />
        <button type="submit">Submit</button>
      </form>
      <div id="clerk-captcha" />
    </div>
  );
}

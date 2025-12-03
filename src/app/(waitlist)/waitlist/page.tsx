"use client";

import { toast } from "sonner";
import { useState } from "react";
import CTA from "@/app/_components/waitlist/cta";
import Form from "@/app/_components/waitlist/form";
import Particles from "@/app/_components/waitlist/particles";

export default function WaitlistPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dreamUniversity, setDreamUniversity] = useState<string>("");
  const [gradeYear, setGradeYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDreamUniversityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDreamUniversity(event.target.value);
  };

  const handleGradeYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGradeYear(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!name || !email || !dreamUniversity || !gradeYear) {
      toast.error("Please fill in all fields 😠");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address 😠");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // First, attempt to send the email
        const mailResponse = await fetch("/api/waitlist/email", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: name, email, dreamUniversity, gradeYear }),
        });

        if (!mailResponse.ok) {
          if (mailResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Email sending failed");
          }
          return; // Exit the promise early if mail sending fails
        }

        // If email sending is successful, proceed to store in BaseHub Event Blocks
        const basehubResponse = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, dreamUniversity, gradeYear }),
        });

        if (!basehubResponse.ok) {
          if (basehubResponse.status === 429) {
            reject("Rate limited");
          } else {
            reject("Failed to save your details");
          }
        } else {
          resolve({ name });
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Getting you on the waitlist... 🚀",
      success: (data) => {
        setName("");
        setEmail("");
        setDreamUniversity("");
        setGradeYear("");
        return "Thank you for joining the waitlist 🎉";
      },
      error: (error) => {
        if (error === "Rate limited") {
          return "You're doing that too much. Please try again later";
        } else if (error === "Email sending failed") {
          return "Failed to send email. Please try again 😢.";
        } else if (error === "Failed to save your details") {
          return "Failed to save your details. Please try again 😢.";
        }
        return "An error occurred. Please try again 😢.";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <CTA />

        <Form
          name={name}
          email={email}
          dreamUniversity={dreamUniversity}
          gradeYear={gradeYear}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleDreamUniversityChange={handleDreamUniversityChange}
          handleGradeYearChange={handleGradeYearChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#F7FF9B"}
        refresh
      />
    </main>
  );
}





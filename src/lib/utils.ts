import { Interview } from "@/types/interview";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchInterviews = async (queryParams: string = "") => {
  try {
    const response = await fetch(
      `https://we23tm7jpl.execute-api.us-east-1.amazonaws.com/dev/getInterviews${queryParams}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch interviews");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw error;
  }
};

export const saveInterview = async (interview: Interview) => {
  try {
    const response = await fetch(`https://we23tm7jpl.execute-api.us-east-1.amazonaws.com/dev/interview`, {
      method: interview.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(interview),
    });
    if (!response.ok) {
      throw new Error("Failed to save interview");
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving interview:", error);
    throw error;
  }
};
const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
  return authCookie ? authCookie.split('=')[1] : null;
};
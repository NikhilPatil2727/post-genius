import GeneratePageClient from "@/modules/home/components/GeneratePageClient";

// Ensure the server action has enough time for Gemini generation. 
// 60s is a safe limit for Flash models generating larger content.
export const maxDuration = 60;


export const metadata = {
  title: "Content Studio | PostBloom",
  description: "Create platform-optimized social media posts using Gemini AI.",
};

export default function GeneratePage() {
  return <GeneratePageClient />;
}

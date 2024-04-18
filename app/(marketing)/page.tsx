'use client';
import Hero from '@/components/LandingPage/Hero/Hero';
import Work from '@/components/LandingPage/Work/Work';
import Marketing from '@/components/LandingPage/Marketing/Marketing';
import DragAndDrop from '@/components/LandingPage/DragAndDrop/DragAndDrop';
import Lead from '@/components/LandingPage/Lead/Lead';
import Pricing from '@/components/LandingPage/Pricing/Pricing';
import RequestDemo from '@/components/LandingPage/RequestDemo/RequestDemo';
import ReadyToBuild from '@/components/LandingPage/ReadyToBuild/ReadyToBuild';

export default function IndexPage() {
  
  const chatbot = {
    id: 'clq6m06gc000114hm42s838g2',
    name: 'OpenAssistantGPT',
    welcomeMessage:
      'Hello! I can help you with any questions you have about OpenAssistantGPT.',
  };

  return (
    <div className="bg-black min-h-screen w-full text-white">
      <div className="container mx-auto grid grid-flow-row grid-cols-1 place-content-center place-items-center gap-20 mt-10">
        <Hero />
        <Work />
        <Marketing />
        <DragAndDrop />
        <Lead />
        <Pricing />
        <RequestDemo />
        <ReadyToBuild />
      </div>
    </div>
  );
}
